import React, { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
import { useNavigate } from "react-router-dom";
import User from "models/User";
import Layout from "../ui/LayoutLoginRegister";
import { TextField, Button, Typography, Container } from "@mui/material";
import {
  connectWebSocket,
  disconnectWebSocket,
  subscribeToChannel,
} from "./WebsocketConnection";

const Register = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [passwordsMatch, setPasswordsMatch] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [isConnected, setIsConnected] = useState(false); // State to track WebSocket connection

  // useEffect(() => {
  //   // Cleanup WebSocket connection when component unmounts
  //   return () => {
  //     if (isConnected) {
  //       disconnectWebSocket();
  //     }
  //   };
  // }, [isConnected]);

  const doRegister = async (event) => {
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
        localStorage.setItem("username", response.data.username);

        // Connect to WebSocket after successful registration
        await connectWebSocket();
        setIsConnected(true); // Update state to reflect WebSocket connection status

        // Subscribe to channels
        subscribeToChannel("/login", (message) => {
          console.log("Login Message:", message.body);
        });
        subscribeToChannel("/logout", (message) => {
          console.log("Logout Message:", message.body);
        });

        // Navigate to dashboard after successful registration and WebSocket setup
        navigate("/dashboard/create-game");
      }
    } catch (error) {
      alert(
        `Something went wrong during the registration: \n${handleError(error)}`
      );
    }
  };

  const verifyPassword = (password2) => {
    setPassword2(password2);
    setPasswordsMatch(password === password2);
  };

  return (
    <Layout>
      <Container maxWidth="sm">
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
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password2"
            label="Repeat password"
            type="password"
            id="password2"
            autoComplete="current-password"
            value={password2}
            onChange={(e) => verifyPassword(e.target.value)}
          />
          {!passwordsMatch && (
            <Typography variant="body2" color="error">
              Passwords do not match.
            </Typography>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            onClick={doRegister}
            disabled={!passwordsMatch}
          >
            Register
          </Button>
        </form>
        <p>
          Already have an account? <a href="/login">Login</a>
        </p>
      </Container>
    </Layout>
  );
};

export default Register;
