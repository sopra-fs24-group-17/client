import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api, handleError } from "helpers/api";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Container,
  Grid,
  Paper,
  TableContainer,
} from "@mui/material";

const AllPlayers = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [players, setPlayers] = useState([]);
  const [filteredPlayers, setFilteredPlayers] = useState([]);

  const handleSearchChange = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = players.filter(
      (player) =>
        player.userid?.toString().includes(query) ||
        player.username?.toLowerCase().includes(query)
    );
    setFilteredPlayers(filtered);
  };

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        // Assuming the token is stored in local storage or context
        const token = localStorage.getItem("token");

        const response = await api.get(`/dashboard/420/profile/stats`, {
          // this userId could be any number because it's never checked, but for some server tests we need to pass a userId
          headers: { token: token },
        });
        console.log(response);
        const transformedPlayers = response.data.map((player) => ({
          ...player,
          userid: player.userid,
          username: player.username,
          gamesplayed: player.gamesplayed,
          winlossratio: player.winlossratio,
          achievementsunlocked: player.achievementsunlocked,
          lastplayed: player.lastplayed,
        }));
        setPlayers(transformedPlayers);
        setFilteredPlayers(transformedPlayers); // Initialize with fetched data
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchPlayers(); // Call the async function
  }, [userId]);

  const handlePlayerClick = (userid) => {
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
        <Grid item>
          <TextField
            id="search"
            label="Search for a player"
            variant="outlined"
            size="small"
            sx={{ mb: 2 }}
            value={searchQuery}
            onChange={handleSearchChange} // Add onChange handler
          />
        </Grid>
      </Grid>
      <Paper sx={{ width: "100%", mb: 2, overflowX: "auto" }}>
        <TableContainer>
          <Table stickyHeader aria-label="simple table" sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                <TableCell>User Id</TableCell>
                <TableCell>Username</TableCell>
                <TableCell>Games Played</TableCell>
                <TableCell>Win-loss Ratio</TableCell>
                <TableCell>Achievements Unlocked</TableCell>
                <TableCell>Last Played</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredPlayers.map((player) => (
                <TableRow
                  key={player.username}
                  hover
                  onClick={() => handlePlayerClick(player.userid)}
                >
                  <TableCell>{player.userid}</TableCell>
                  <TableCell>{player.username}</TableCell>
                  <TableCell>{player.gamesplayed}</TableCell>
                  <TableCell>{player.winlossratio}</TableCell>
                  <TableCell>{player.achievementsunlocked}</TableCell>
                  <TableCell>{player.lastplayed}</TableCell>
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
