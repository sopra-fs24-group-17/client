import React, { useEffect, useState } from 'react';
import { api, handleError } from "helpers/api";
import { useNavigate, useParams } from "react-router-dom";
import { TextField, Grid, Card, CardActions, CardContent, Button, Container, Typography, IconButton, InputAdornment } from '@mui/material';
import Profile from './Profile';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';


const ChangePassword = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    const [password, setPassword] = useState(null);
    const [passwordReenter, setPasswordReenter] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordReenter, setShowPasswordReenter] = useState(false);

    const [isChangingPassword, setIsChangingPassword] = useState(true);
    const toggleChangePassword = () => setIsChangingPassword(!isChangingPassword);




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


            } catch (error) {
                console.error(`Failed to fetch user data: ${handleError(error)}`);
            }

        };
      
        fetchUser();
      }, [userId, navigate]); 


    const handlePasswordChange = (event) => setPassword(event.target.value);
    const handlePasswordReenterChange = (event) => setPasswordReenter(event.target.value);

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const toggleShowPasswordReenter = () => {
        setShowPasswordReenter(!showPasswordReenter);
    };




    interface UpdateData {
        password?: string;
      }      



    const handleSubmit = async (event) => {
        event.preventDefault();
        const token = localStorage.getItem("token");
        const updateData: UpdateData = {};
    
        // Only add fields to the update object if they are not empty
        if (password && password.trim() !== '') updateData.password = password;
    
        console.log(updateData);
        try {
            await api.put(`dashboard/${userId}/profile`,
                JSON.stringify(updateData),
                {
                    headers: {
                        'Content-Type': 'application/json',
                        token: token
                    }
                });
            navigate(`/users/${userId}`);
        } catch (error) {
            alert(`Updating profile failed: ${handleError(error)}`);
        }
    };
    


    if (!isChangingPassword) {
        return <Profile />;
    }


    if (user) {
        return (

            <Container maxWidth='xl'>
                <Grid container style={{ minHeight: '100vh' }} alignItems="center" justifyContent="center">
                    <Grid item sx={{ display: 'flex', alignItems: 'center' }}>

                        <Card style={{ width: '100%' }}>
                            <CardContent>
                                <CardActions sx={{ justifyContent: 'center', marginBottom: 2 }}></CardActions>
                                
                                    {/* Username Field */}
                                    <Grid container spacing={2} alignItems="center" sx={{ marginBottom: '10px' }}>
                                        <Grid item xs>
                                            <TextField
                                                sx={{ width: '300px' }}
                                                type={showPassword ? 'text' : 'password'}
                                                fullWidth
                                                label="Enter new password"
                                                value={password}
                                                onChange={handlePasswordChange}
                                                onFocus={(event) => event.target.select()}
                                                InputProps={{
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            <IconButton
                                                                onClick={toggleShowPassword}
                                                                edge="end"
                                                            >
                                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                                            </IconButton>
                                                        </InputAdornment>
                                                    ),
                                                }}
                                            />
                                        </Grid>
                                    </Grid>

                                    <Grid container spacing={2} alignItems="center" sx={{ marginBottom: '10px' }}>
                                        <Grid item xs>
                                            <TextField
                                                sx={{ width: '300px' }}
                                                type={showPasswordReenter ? 'text' : 'password'}
                                                fullWidth
                                                label="Re-enter new password"
                                                value={passwordReenter}
                                                onChange={handlePasswordReenterChange}
                                                onFocus={(event) => event.target.select()}
                                                InputProps={{
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            <IconButton
                                                                onClick={toggleShowPasswordReenter}
                                                                edge="end"

                                                            >
                                                                {showPasswordReenter ? <VisibilityOff /> : <Visibility />}
                                                            </IconButton>
                                                        </InputAdornment>
                                                    ),
                                                }}
                                            />
                                        </Grid>
                                    </Grid>

                                {(password !== passwordReenter) && (passwordReenter !== null) &&
                                <Grid container spacing={2} alignItems="center" sx={{ marginBottom: '10px' }}>
                                    <Grid item xs>
                                        <Typography color={"#ff3d00"}>
                                            Passwords don&apos;t match!
                                        </Typography>
                                    </Grid>
                                </Grid>}




                            </CardContent>
                            <CardActions sx={{ justifyContent: 'center', marginBottom: 2 }}>
                                <Button variant="outlined" size="small" onClick={toggleChangePassword}>Cancel</Button>
                                {(password === passwordReenter) && (passwordReenter !== null) && (passwordReenter.trim() !== '') && <Button
                                    variant="outlined"
                                    size="small"
                                    onClick={(event) => {
                                        const doSubmit = async () => {
                                            await handleSubmit(event); 
                                            toggleChangePassword();
                                        };
                                        doSubmit();
                                    }}
                                >
                                    Save changes
                                </Button>}

                            </CardActions>
                        </Card>
                    </Grid>
                </Grid>
            </Container>



        )
    };

};

export default ChangePassword;