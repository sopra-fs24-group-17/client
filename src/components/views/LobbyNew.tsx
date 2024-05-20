import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
  connectWebSocket,
  disconnectWebSocket,
  subscribeToChannel,
  sendMessage,
} from "helpers/WebsocketConnection";
import HintsLobby from "./HintsLobby";
import { api } from "helpers/api";
import { Box, Button, IconButton, Typography } from "@mui/material";
import FileCopyIcon from "@mui/icons-material/FileCopy";

const LobbyNew = () => {
  const gameId = localStorage.getItem("gameId");
  const navigate = useNavigate();

  const [currentPlayerCount, setCurrentPlayerCount] = useState(null);
  const [maxPlayerCount, setMaxPlayerCount] = useState(null);
  const [startButtonDisabled, setStartButtonDisabled] = useState(true);

  const stompClientRef = useRef(null);
  const [isWebSocketConnected, setIsWebSocketConnected] = useState(false);

  const handleIncomingMessageGame = useCallback((message) => {
    const gameState = JSON.parse(message.body);
    if (gameState.type === "join" || gameState.type === "leave") {
      setCurrentPlayerCount(gameState.currentPlayers);
      setMaxPlayerCount(gameState.maxPlayers);
    }
    if (gameState === "lets all start together guys") {
      navigate(`/game/${gameId}`);
    }
  }, []);

  const handleStartGame = () => {
    console.log("Starting game");
    sendMessage(`/game/${gameId}`, "lets all start together guys");
    sendMessage(`/app/start/${gameId}`, {});
  };

  const handleLeaveLobby = async () => {
    console.log("Leaving lobby");
    const token = localStorage.getItem("token");
    try {
      const response = await api.put(
        `/dashboard/games/leave/${gameId}`,
        {},
        {
          headers: { token: token },
        }
      );
      localStorage.removeItem("createflag");
      localStorage.removeItem("joinGame");
      console.log("Left game successfully", response.data);
      navigate("/dashboard/create-game");
    } catch (error) {
      console.error(
        "Error leaving game:",
        error.response ? error.response.data : error.message
      );
    }
  };

  const handleCopyGameId = () => {
    navigator.clipboard
      .writeText(gameId)
      .then(() => {
        console.log("Game ID copied to clipboard");
      })
      .catch((err) => {
        console.error("Could not copy game ID: ", err);
      });
  };

  useEffect(() => {
    if (currentPlayerCount === Number(maxPlayerCount)) {
      setStartButtonDisabled(false);
    } else {
      setStartButtonDisabled(true);
    }
  }, [currentPlayerCount, maxPlayerCount]);

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      console.log("Before unload event triggered");
      handleLeaveLobby();
      event.preventDefault();
      event.returnValue = ""; // This is necessary for Chrome to trigger the dialog
    };

    const handlePopState = async () => {
      console.log("Popstate event triggered");
      await handleLeaveLobby();
    };

    console.log("Attaching event listeners");
    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("popstate", handlePopState);
    window.history.pushState(null, document.title, window.location.href);
    console.log("Event listeners attached");

    return () => {
      console.log("Removing event listeners");
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handlePopState);
      console.log("Event listeners removed");
    };
  }, []);

  useEffect(() => {
    const handleJoinGame = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await api.put(
          `/dashboard/games/join/${gameId}`,
          {},
          {
            headers: { token: token },
          }
        );
        console.log("Joined game successfully", response.data);
        setCurrentPlayerCount(response.data.currentPlayers);
        setMaxPlayerCount(response.data.maxPlayers);
      } catch (error) {
        console.error(
          "Error joining game:",
          error.response ? error.response.data : error.message
        );
      }
    };
    if (isWebSocketConnected) {
      const delay = 200; // Delay in milliseconds
      setTimeout(handleJoinGame, delay);
    }
  }, [isWebSocketConnected]);

  useEffect(() => {
    const connectAndSubscribe = async () => {
      try {
        const client = await connectWebSocket();
        stompClientRef.current = client;

        if (stompClientRef.current) {
          console.log("WebSocket Lobby connected.");
          subscribeToChannel(`/game/${gameId}`, handleIncomingMessageGame);
        } else {
          console.error("WebSocket client is not defined.");
        }
      } catch (error) {
        console.error("Error connecting to WebSocket:", error);
      }
    };

    connectAndSubscribe();
    setIsWebSocketConnected(true);
  }, []);

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      flexDirection="column"
    >
      <Typography variant="h3" mt={"20px"}>
        Waiting for players to join ...
      </Typography>
      <Box sx={{ display: "flex", gap: 0, mt: 2, alignItems: "center" }}>
        <Typography variant="h5">Game ID: {gameId}</Typography>
        <IconButton onClick={() => handleCopyGameId()}>
          <FileCopyIcon />
        </IconButton>
      </Box>
      <Typography variant="h5" mt={"20px"}>
        Current Players: {currentPlayerCount} out of {maxPlayerCount}
      </Typography>
      <HintsLobby />
      <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
        <Button
          onClick={handleStartGame}
          disabled={startButtonDisabled}
          variant="contained"
          color="success"
        >
          Start Game
        </Button>
        <Button onClick={handleLeaveLobby} variant="contained" color="error">
          Leave Lobby
        </Button>
      </Box>
    </Box>
  );
};

export default LobbyNew;
