import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import { api } from "helpers/api";
import {
  connectWebSocket,
  disconnectWebSocket,
  subscribeToChannel,
} from "./WebsocketConnection";

const AllPlayers = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [players, setPlayers] = useState([]);
  const [filteredPlayers, setFilteredPlayers] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [shouldReload, setShouldReload] = useState(false);
  const [friends, setFriends] = useState([]);
  const [friendRequestStatuses, setFriendRequestStatuses] = useState({});
  const [sortField, setSortField] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");

  const handleSort = (field) => {
    const isAsc = sortField === field && sortDirection === "asc";
    setSortDirection(isAsc ? "desc" : "asc");
    setSortField(field);
  };

  useEffect(() => {
    const sortedPlayers = [...players].sort((a, b) => {
      if (a[sortField] < b[sortField]) {
        return sortDirection === "asc" ? -1 : 1;
      }
      if (a[sortField] > b[sortField]) {
        return sortDirection === "asc" ? 1 : -1;
      }
      return 0;
    });
    setFilteredPlayers(sortedPlayers);
  }, [players, sortField, sortDirection]);

  const fetchFriends = async () => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("id");
    try {
      const response = await api.get(`/dashboard/${userId}/friends`, {
        headers: { token: token },
      });
      setFriends(response.data.map((friend) => friend.friendId));
      console.log("Friends fetched successfully.", response.data);
    } catch (error) {
      console.error("Error fetching friends:", error);
    }
  };

  useEffect(() => {
    fetchFriends();
    setupWebSocketAndFetchData();
  }, []);

  useEffect(() => {
    if (shouldReload) {
      window.location.reload();
    }
  }, [shouldReload]);

  const handleSearchChange = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = players.filter(
      (player) =>
        player.userid.toString().includes(query) ||
        player.username.toLowerCase().includes(query)
    );
    setFilteredPlayers(filtered);
  };

  const setupWebSocketAndFetchData = async () => {
    await connectWebSocket();
    const userId = localStorage.getItem("id");
    subscribeToChannel(`/friendshiprequest/acceptance/${userId}`, (message) => {
      console.log("Friendship acceptance message:", message);
    });

    subscribeToChannel(`/friendshiprequest/received/${userId}`, (message) => {
      console.log("Friendship request received:", message);
      const newRequest = {
        requestingUserUsername: message.body,
      };
      setFriendRequests((prev) => [...prev, newRequest]);
      setShouldReload(true);
    });

    try {
      const token = localStorage.getItem("token");
      const response = await api.get(`/dashboard/420/profile/stats`, {
        // just use any userid, doesn't matter
        headers: { token: token },
      });
      console.log(response);
      setPlayers(response.data);
      setFilteredPlayers(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const fetchFriendRequests = async () => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("id");
    try {
      const response = await api.get(`/dashboard/${userId}/friends/requests`, {
        headers: { token: token },
      });
      setFriendRequests(response.data);
      console.log("Friend requests fetched successfully.", friendRequests);
    } catch (error) {
      console.error("Error fetching friend requests:", error);
    }
  };
  useEffect(() => {
    let isActive = true;

    const setup = async () => {
      if (isActive) {
        await fetchFriendRequests();
        await setupWebSocketAndFetchData();
      }
    };

    setup();

    return () => {
      isActive = false; // Prevent state updates after the component is unmounted
      disconnectWebSocket();
    };
  }, []);

  const sendFriendRequest = async (recipientUserId) => {
    try {
      const token = localStorage.getItem("token");
      setFriendRequestStatuses((prevStatuses) => ({
        ...prevStatuses,
        [recipientUserId]: "waiting",
      }));
      await api.put(
        `/dashboard/${recipientUserId}/friends/requests`,
        {},
        {
          headers: { token: token },
        }
      );
      console.log("Friend request sent successfully to user:", recipientUserId);
    } catch (error) {
      console.error("Failed to send friend request:", error);
    }
  };
  const handleAcceptFriendRequest = async (requestId) => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("id");
    try {
      await api.put(
        `/dashboard/${userId}/friends/requests/${requestId}`,
        { status: "ACCEPTED" },
        {
          headers: { token: token },
        }
      );
      setFriendRequests((prevRequests) =>
        prevRequests.filter((request) => request.requestId !== requestId)
      );
      console.log("Friend request accepted.");
    } catch (error) {
      console.error("Failed to accept friend request:", error);
    }
  };

  const handleRejectFriendRequest = async (requestId) => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("id");
    try {
      await api.put(
        `/dashboard/${userId}/friends/requests/${requestId}`,
        { status: "REJECTED" },
        {
          headers: { token: token },
        }
      );
      setFriendRequests((prevRequests) =>
        prevRequests.filter((request) => request.requestId !== requestId)
      );
      console.log("Friend request rejected.");
    } catch (error) {
      console.error("Failed to reject friend request:", error);
    }
  };
  const handlePlayerClick = (userid) => {
    console.log(userid);
    navigate(`../users/${userid}`);
  };

  return (
    <Container maxWidth={false} sx={{ mt: 2 }}>
      <Grid container justifyContent="space-between" alignItems="flex-start">
        <Grid item>
          <Typography variant="h4" component="h1" sx={{ mb: 2 }}>
            All Players
          </Typography>
        </Grid>
        {/* Search Field and Table */}
        <Grid item>
          <TextField
            id="search"
            label="Search for a player"
            variant="outlined"
            size="small"
            sx={{ mb: 2 }}
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </Grid>
      </Grid>

      {/* Friend Requests Section */}
      {friendRequests.length > 0 && (
        <List>
          {friendRequests.map((request) => (
            <ListItem key={request.requestId}>
              <ListItemText
                primary={`Friend request from ${request.requestingUserUsername}`}
              />
              <Button
                onClick={() => handleAcceptFriendRequest(request.requestId)}
                color="primary"
              >
                Accept
              </Button>
              <Button
                onClick={() => handleRejectFriendRequest(request.requestId)}
                color="primary"
              >
                Reject
              </Button>
            </ListItem>
          ))}
        </List>
      )}

      <Paper sx={{ width: "100%", mb: 2, overflowX: "auto" }}>
        <TableContainer>
          <Table stickyHeader aria-label="simple table" sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                <TableCell onClick={() => handleSort("userid")}>
                  User Id{" "}
                  {sortField === "userid"
                    ? sortDirection === "asc"
                      ? "↑"
                      : "↓"
                    : ""}
                </TableCell>
                <TableCell onClick={() => handleSort("username")}>
                  Username{" "}
                  {sortField === "username"
                    ? sortDirection === "asc"
                      ? "↑"
                      : "↓"
                    : ""}
                </TableCell>
                <TableCell onClick={() => handleSort("gamesplayed")}>
                  Games Played{" "}
                  {sortField === "gamesplayed"
                    ? sortDirection === "asc"
                      ? "↑"
                      : "↓"
                    : ""}
                </TableCell>
                <TableCell onClick={() => handleSort("winlossratio")}>
                  Win-loss Ratio{" "}
                  {sortField === "winlossratio"
                    ? sortDirection === "asc"
                      ? "↑"
                      : "↓"
                    : ""}
                </TableCell>
                <TableCell onClick={() => handleSort("achievementsunlocked")}>
                  Achievements Unlocked{" "}
                  {sortField === "achievementsunlocked"
                    ? sortDirection === "asc"
                      ? "↑"
                      : "↓"
                    : ""}
                </TableCell>
                <TableCell>Last Played</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredPlayers.map((player) => (
                <TableRow
                  key={player.userid}
                  hover
                  onClick={() => handlePlayerClick(player.userid)}
                  style={{ cursor: "pointer" }}
                >
                  <TableCell>{player.userid}</TableCell>
                  <TableCell>{player.username}</TableCell>
                  <TableCell>{player.gamesplayed}</TableCell>
                  <TableCell>{player.winlossratio}</TableCell>
                  <TableCell>{player.achievementsunlocked}</TableCell>
                  <TableCell>{player.lastplayed ? player.lastplayed.slice(0, 10) : 'n/a'}</TableCell>
                  <TableCell>
                    {localStorage.getItem("id") !== player.userid.toString() ? (
                      <Button
                        variant="contained"
                        size="small"
                        onClick={(event) => {
                          event.stopPropagation();
                          sendFriendRequest(player.userid);
                        }}
                        disabled={
                          friends.includes(player.userid) ||
                          friendRequestStatuses[player.userid] === "waiting"
                        }
                      >
                        {friends.includes(player.userid)
                          ? "Already Added"
                          : friendRequestStatuses[player.userid] === "waiting"
                            ? "Invitation sent"
                            : "Add Friend"}
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        size="small"
                        disabled
                        style={{ opacity: 0.5 }}
                      >
                        Yourself
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
};

export default AllPlayers;
