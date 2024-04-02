import React, { useEffect, useState } from 'react';
import { api, handleError } from "helpers/api";
import { useNavigate, useParams } from "react-router-dom";
import { TableCell, TableRow, TableBody, Table, TableHead, Paper, Grid, Card, CardMedia, CardActions, CardContent, Typography, Button, Container } from '@mui/material';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import EditProfile from './EditProfile';
import BlockIcon from '@mui/icons-material/Block';
import ChangePassword from './ChangePassword';





const Profile = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [losses, setLosses] = useState(null);
    const [avatar, setAvatar] = useState(null);

    const [isEditing, setIsEditing] = useState(false);
    const toggleEdit = () => setIsEditing(!isEditing);

    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const toggleChangePassword = () => setIsChangingPassword(!isChangingPassword);

    const [isAuthorizedToView, setIsAuthorizedToView] = useState(true);

    const currentUserID = localStorage.getItem("id");


    useEffect(() => {

        const fetchUser = async () => {
            try {
                const token = localStorage.getItem("token")
                const response = await api.get(`/dashboard/${userId}/profile`, {
                    headers: { token: token }
                    }
                );
                const fetchedUser = response.data;

                setUser(fetchedUser);
                setAvatar('/profile_image_placeholder.webp');
                const losses = fetchedUser.gamesplayed - fetchedUser.gameswon;
                setLosses(losses);

            } catch (error) {
                console.error(`Failed to fetch user data: ${handleError(error)}`);
                setIsAuthorizedToView(false);
            }

            
        };
        fetchUser();


    }, [userId])

    
    if (!isAuthorizedToView) {
        return (
            <Container maxWidth='xl'>
                <Grid
                    container
                    style={{
                        minHeight: '100vh', // Adjusted to take full viewport height for vertical centering
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center', // This centers the children vertically
                        textAlign: 'center' // Centers text horizontally
                    }}
                >
                    <Grid item xs={12}>
                        <BlockIcon sx={{ fontSize: 100 }} color="error" />
                    </Grid>
                    <Grid item xs={12} style={{ paddingTop: '20px' }}> {/* Adjusts space between icon and text */}
                        <Typography variant="h4" color="textSecondary">
                            This is a private profile.
                        </Typography>
                    </Grid>
                    <Grid marginTop={10}>                              
                        <Button variant='outlined' size='small' onClick={() => navigate(-1)}>
                            Take me back
                        </Button>
                    </Grid>
                </Grid>
            </Container>
        )
    }


    if (isEditing) {
        return <EditProfile />;
    }


    if (isChangingPassword) {
        return <ChangePassword />
    }


    if (user) {
        return (
            <Container maxWidth='xl'>


                <Grid container style={{ minHeight: '100vh' }} alignItems="center" justifyContent="space-between">

                    <Grid item component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell><strong>Games Played</strong></TableCell>
                                    <TableCell><strong>#Wins</strong></TableCell>
                                    <TableCell><strong>#Losses</strong></TableCell>
                                    <TableCell><strong>Win/Loss Ratio</strong></TableCell>
                                    <TableCell><strong>#Friends</strong></TableCell>
                                    <TableCell><strong>#Achievements unlocked</strong></TableCell>
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
                    </Grid>

                    <Grid item>
                        <Card sx={{ width: 345 }}>
                            <div style={{ height: 345, position: 'relative' }} >
                                <CardMedia
                                    sx={{ height: 345, position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
                                    image={avatar}
                                    title="profile"
                                />
                            </div>
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="div" align='center' marginBottom={2.5}>
                                    {user.username}
                                </Typography>
                                <Typography gutterBottom variant="body2" color="text.secondary" align='center'>
                                    {user.status === "ONLINE" ? (
                                        <FiberManualRecordIcon style={{ fontSize: 14, color: 'green', verticalAlign: 'middle' }} />
                                    ) : (
                                        <FiberManualRecordIcon style={{ fontSize: 14, color: 'red', verticalAlign: 'middle' }} />
                                    )}
                                    {user.status}
                                </Typography>
                                <Typography gutterBottom variant="body2" color="text.secondary" align='center'>
                                    Created on: {user.creationdate.slice(0, 10)}
                                </Typography>

                                {/* optional fields -> set as optional */}
                                    <Typography gutterBottom variant="body2" color="text.secondary" align='center'>
                                        Birthday: {user.birthdate ? user.birthdate.slice(0, 10) : "Not set"}
                                    </Typography>
                                    <Typography gutterBottom variant="body2" color="text.secondary" align='center'>
                                        Email: {user.email}
                                    </Typography>
                                    <Typography gutterBottom variant="body2" color="text.secondary" align='center' marginBottom={2.5}>
                                        Country: {user.countryoforigin ? user.countryoforigin : "Not set"}
                                    </Typography>

                                {/* <Typography variant="body2" color="text.secondary" align='center' marginBottom={2.5}>
                                    {user.bio}
                                </Typography> */}

                            </CardContent>
                            <CardActions sx={{ justifyContent: 'center', marginBottom: 2 }}>
                                {currentUserID === userId && (
                                    <Button variant="outlined" size="small" onClick={toggleEdit}>Edit Profile</Button>
                                )}          
                                {currentUserID === userId && (                      
                                <Button variant="outlined" size="small" onClick={toggleChangePassword}>Change Password</Button>
                                )}
                            </CardActions>
                        </Card>
                    </Grid>
        
                </Grid>


            </Container>
        )
    }


  };



export default Profile;