import React, { useState } from 'react';
import { api, handleError } from "helpers/api";
import { useNavigate } from "react-router-dom";
import User from "models/User"; import Layout from '../ui/Layout';
import { TextField, Button, Typography } from '@mui/material';

const Register = () => {
    const navigate = useNavigate();
    const [password, setPassword] = useState<string>("");
    const [username, setUsername] = useState<string>("");
    const [email, setEmail] = useState<string>("");

    const doRegister = async () => {
        event.preventDefault();

        try {
            const requestBody = JSON.stringify({ username, email, password });
            const response = await api.post("/users/register", requestBody);

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
            <Typography variant="h4" gutterBottom>
                Register
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
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                    onClick={doRegister}
                >
                    Register
                </Button>
            </form>
            <p>
                Already have an account? <a href="/login">Login</a>
            </p>
        </Layout>
    );
};

export default Register;