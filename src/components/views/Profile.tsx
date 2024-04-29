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
import placeholder from 'components/game/profile_image_placeholder.webp';


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

  const [domain, setDomain] = useState(null);

  const currentUserID = localStorage.getItem("id");

  useEffect(() => {
    setDomain(process.env.REACT_APP_API_URL);
    console.log(process.env.REACT_APP_API_URL);

    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await api.get(`/dashboard/${userId}/profile`, {
          headers: { token: token },
        });
        const fetchedUser = response.data;

        setUser(fetchedUser);
        console.log(fetchedUser.avatar);
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
                  height: "20vh",
                }}
                image={
                  avatarPath
                    ? domain + avatarPath
                    : placeholder
                }
                title="profile"
              />
              <CardContent>
                <Typography
                  gutterBottom
                  variant="h5"
                  component="div"
                  align="center"
                  marginBottom={2.5}
                >
                  {user.username}
                </Typography>
                <Typography
                  gutterBottom
                  variant="body2"
                  color="text.secondary"
                  align="center"
                >
                  {user.status === "ONLINE" ? (
                    <FiberManualRecordIcon
                      style={{
                        fontSize: 14,
                        color: "green",
                        verticalAlign: "middle",
                      }}
                    />
                  ) : (
                    <FiberManualRecordIcon
                      style={{
                        fontSize: 14,
                        color: "red",
                        verticalAlign: "middle",
                      }}
                    />
                  )}
                  {user.status}
                </Typography>
                <Typography
                  gutterBottom
                  variant="body2"
                  color="text.secondary"
                  align="center"
                >
                  Created on: {user.creationdate.slice(0, 10)}
                </Typography>

                {/* optional fields -> set as optional */}
                <Typography
                  gutterBottom
                  variant="body2"
                  color="text.secondary"
                  align="center"
                >
                  Birthday:{" "}
                  {user.birthdate ? user.birthdate.slice(0, 10) : "Not set"}
                </Typography>
                <Typography
                  gutterBottom
                  variant="body2"
                  color="text.secondary"
                  align="center"
                >
                  Email: {user.email}
                </Typography>
                <Typography
                  gutterBottom
                  variant="body2"
                  color="text.secondary"
                  align="center"
                  marginBottom={2.5}
                >
                  Country:{" "}
                  {user.countryoforigin ? user.countryoforigin : "Not set"}
                </Typography>
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
