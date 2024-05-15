import React, { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
import { useNavigate, useParams } from "react-router-dom";
import {
  TableCell,
  TableRow,
  TableBody,
  Table,
  TableHead,
  Paper,
  Grid,
  Card,
  CardMedia,
  CardActions,
  CardContent,
  Typography,
  Button,
  Container,
  TableContainer,
} from "@mui/material";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import EditProfile from "./EditProfile";
import BlockIcon from "@mui/icons-material/Block";
import ChangePassword from "./ChangePassword";
import placeholder from "components/game/profile_image_placeholder.webp";
import { FlagIcon } from "react-flag-kit";
import countryList from "react-select-country-list";

interface ProfileProps {
  userId: string;
}

const Profile: React.FC<ProfileProps> = ({ userId: propUserId }) => {
  const { userId: paramUserId } = useParams();
  const userId = propUserId || paramUserId;
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [losses, setLosses] = useState(null);

  const [avatarPath, setAvatarPath] = useState(null);

  const [isEditing, setIsEditing] = useState(false);
  const toggleEdit = () => setIsEditing(!isEditing);

  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const toggleChangePassword = () => setIsChangingPassword(!isChangingPassword);

  const [isAuthorizedToView, setIsAuthorizedToView] = useState(true);

  const currentUserID = localStorage.getItem("id");

  useEffect(() => {
    console.log(process.env.REACT_APP_API_URL);

    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await api.get(`/dashboard/${userId}/profile`, {
          headers: { token: token },
        });
        const fetchedUser = response.data;

        setUser(fetchedUser);
        setAvatarPath(fetchedUser.avatar);
        const losses = fetchedUser.gamesplayed - fetchedUser.gameswon;
        setLosses(losses);
      } catch (error) {
        console.error(`Failed to fetch user data: ${handleError(error)}`);
        setIsAuthorizedToView(false);
      }
    };
    fetchUser();
  }, [userId]);

  if (!isAuthorizedToView) {
    return (
      <Container maxWidth="xl">
        <Grid
          container
          style={{
            minHeight: "100vh", // Adjusted to take full viewport height for vertical centering
            display: "flex",
            flexDirection: "column",
            justifyContent: "center", // This centers the children vertically
            textAlign: "center", // Centers text horizontally
          }}
        >
          <Grid item xs={12}>
            <BlockIcon sx={{ fontSize: 100 }} color="error" />
          </Grid>
          <Grid item xs={12} style={{ paddingTop: "20px" }}>
            {" "}
            {/* Adjusts space between icon and text */}
            <Typography variant="h4" color="textSecondary">
              This is a private profile.
            </Typography>
          </Grid>
          <Grid marginTop={10}>
            <Button
              variant="outlined"
              size="small"
              onClick={() => navigate(-1)}
            >
              Take me back
            </Button>
          </Grid>
        </Grid>
      </Container>
    );
  }

  if (isEditing) {
    return <EditProfile />;
  }

  if (isChangingPassword) {
    return <ChangePassword />;
  }

  const countryNameToCode = (countryName) => {
    const country = countryList()
      .getData()
      .find((c) => c.label === countryName);
    return country ? country.value : null;
  };

  if (user) {
    return (
      <Container maxWidth="xl">
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <TableContainer component={Paper}>
              <Table aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <strong>Games Played</strong>
                    </TableCell>
                    <TableCell>
                      <strong>#Wins</strong>
                    </TableCell>
                    <TableCell>
                      <strong>#Losses</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Win/Loss Ratio</strong>
                    </TableCell>
                    <TableCell>
                      <strong>#Friends</strong>
                    </TableCell>
                    <TableCell>
                      <strong>#Achievements unlocked</strong>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      {user.gamesplayed}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {user.gameswon}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {losses}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {user.winlossratio}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {user.totalfriends}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {user.achievementsunlocked}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardMedia
                sx={{
                  height: "45vh",
                }}
                image={avatarPath ? avatarPath : placeholder}
                title="profile"
              />

              <CardContent
                style={{ paddingLeft: "35px", paddingRight: "35px" }}
              >
                <Typography
                  gutterBottom
                  variant="h5"
                  color="text.secondary"
                  align="center"
                  marginBottom={2.5}
                >
                  {user.status === "ONLINE" ? (
                    <FiberManualRecordIcon
                      style={{
                        marginRight: 5,
                        fontSize: 20,
                        color: "green",
                        verticalAlign: "-2px",
                      }}
                    />
                  ) : (
                    <FiberManualRecordIcon
                      style={{
                        marginRight: 5,
                        fontSize: 20,
                        color: "red",
                        verticalAlign: "-2px",
                      }}
                    />
                  )}
                  {user.username}
                </Typography>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    width: "100%",
                  }}
                >
                  {[
                    {
                      label: "Created on:",
                      value: user.creationdate.slice(0, 10),
                    },
                    {
                      label: "Birthday:",
                      value: user.birthdate
                        ? user.birthdate.slice(0, 10)
                        : "Not set",
                    },
                    { label: "Email:", value: user.email },
                    {
                      label: "Country:",
                      value: user.countryoforigin
                        ? user.countryoforigin
                        : "Not set",
                      flag: user.countryoforigin,
                    },
                  ].map((item, index) => (
                    <div
                      key={index}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        width: "100%",
                        marginBottom: "10px",
                      }}
                    >
                      <span style={{ paddingRight: "10px" }}>{item.label}</span>
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          fontWeight: "bold",
                          overflow:
                            item.label === "Email:" ? "hidden" : undefined,
                          whiteSpace:
                            item.label === "Email:" ? "nowrap" : undefined,
                          textOverflow:
                            item.label === "Email:" ? "ellipsis" : undefined,
                          cursor: "default",
                        }}
                        title={item.value}
                      >
                        {item.value}
                        {item.flag && (
                          <FlagIcon
                            code={countryNameToCode(user.countryoforigin)}
                            size={35}
                            style={{ marginLeft: 8, verticalAlign: "middle" }}
                          />
                        )}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>

              <CardActions sx={{ justifyContent: "center", marginBottom: 2 }}>
                {currentUserID === userId && (
                  <Button variant="outlined" size="small" onClick={toggleEdit}>
                    Edit Profile
                  </Button>
                )}
                {currentUserID === userId && (
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={toggleChangePassword}
                  >
                    Change Password
                  </Button>
                )}
              </CardActions>
            </Card>
          </Grid>
        </Grid>
      </Container>
    );
  }
};

export default Profile;
