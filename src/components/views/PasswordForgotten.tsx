import React, { useState } from 'react';
import { api, handleError } from "helpers/api";
import { useNavigate } from "react-router-dom";
import User from "models/User";
import Layout from '../ui/Layout';
import { TextField, Button, Typography, Container, Alert } from '@mui/material';


const PasswordForgotten = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [resetSuccess, setResetSuccess] = useState<boolean>(false);

    const doRequestPassword = async () => {
        event.preventDefault();

        try {
            const requestBody = JSON.stringify({ username, email });
            api.post("users/password-reset", requestBody);

            setResetSuccess(true);
        } catch (error) {
            alert(
                `Something went wrong during the reset: \n${handleError(error)}`
            );
            setResetSuccess(false);
        }
    };

    return (
        <Layout>
            <Container maxWidth="sm">
                <Typography variant="h4" gutterBottom>
                    Password Reset
                </Typography>
                <p>Enter your email address and username to reset your password. If there exists a user with these credentials, you will receive a one-time password</p>
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
                        label="Email"
                        name="email"
                        autoFocus
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    {resetSuccess && (
                        <Alert severity="success">
                            Password reset email sent. Check your inbox.
                        </Alert>
                    )}
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        onClick={doRequestPassword}
                    >
                        Submit
                    </Button>
                </form>
            </Container>
        </Layout>
    );
};

export default PasswordForgotten;