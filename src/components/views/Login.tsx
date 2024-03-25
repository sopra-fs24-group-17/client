import React, { useState } from 'react';
import { api, handleError } from "helpers/api";
import { useNavigate } from "react-router-dom";
import User from "models/User";
import Layout from '../ui/Layout';
import { TextField, Button, Typography, Container } from '@mui/material';


const Login = () => {
    const navigate = useNavigate();
    const [password, setPassword] = useState<string>("");
    const [username, setUsername] = useState<string>("");

    const doLogin = async () => {
        event.preventDefault();

        try {
            const requestBody = JSON.stringify({ username, password });
            const response = await api.post("/users/login", requestBody);

            // Get the returned user and update a new object.
            const user = new User(response.data);

            // Store the token into the local storage.
            const token = response.headers.token;
            console.log(token);

            if (token) {
                localStorage.setItem("token", token);
                localStorage.setItem("id", response.data.id);
            }

            // Login successfully worked --> navigate to the route /game in the GameRouter
            navigate("/game");
        } catch (error) {
            alert(
                `Something went wrong during the login: \n${handleError(error)}`
            );
        }
    };

    return (
        <Layout>
            <Container maxWidth="sm">
                <Typography variant="h4" gutterBottom>
                    Login
                </Typography>
                <form noValidate autoComplete="off">
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="username"
                        label="Username"
                        name="username"
                        autoFocus
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        onClick={doLogin}
                    >
                        Login
                    </Button>
                </form>
                <p>
                    Don&apos;t have an account? <a href="/register">Register</a>
                </p>
            </Container>
        </Layout>
    );
};

export default Login;