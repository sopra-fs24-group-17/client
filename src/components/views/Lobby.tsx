import PropTypes from "prop-types";
import React, { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { api, handleError } from "helpers/api";
import {
  connectWebSocket,
  disconnectWebSocket,
  subscribeToChannel,
  sendMessage,
} from "./WebsocketConnection";
import { Grid, Button, Box } from "@mui/material";
import WebSocketChat from "./chat";
import { hints, getRandomHint } from "components/lobby/hints.js";

const Lobby = () => {
  const [currentPlayers, setCurrentPlayers] = useState(1);
  const navigate = useNavigate();
  const { gameId } = useParams();
  const [joinButtonDisabled, setJoinButtonDisabled] = useState(true);
  const [leaveButtonDisabled, setLeaveButtonDisabled] = useState(false);
  const [totalPlayersRequired, setTotalPlayersRequired] = useState(2);
  const [message, setMessage] = useState(null);
  const [currentHint, setCurrentHint] = useState(getRandomHint());
  const storedUsername = localStorage.getItem("username");
  const creatorName = localStorage.getItem("creator");

  const handleLeaveGame = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await api.put(
        `/dashboard/games/leave/${gameId}`,
        {},
        {
          headers: { token: token },
        }
      );
      localStorage.removeItem("creatorflag");
      localStorage.removeItem("joinGame");
      console.log("Left game successfully", response.data);
      navigate("/dashboard");
    } catch (error) {
      console.error(
        "Error leaving game:",
        error.response ? error.response.data : error.message
      );
    }
  };

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      console.log("Before unload event triggered");
      handleLeaveGame();
      event.preventDefault();
      event.returnValue = ""; // This is necessary for Chrome to trigger the dialog
    };

    const handlePopState = async () => {
      console.log("Popstate event triggered");
      await handleLeaveGame();
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
    if (
      currentPlayers === totalPlayersRequired &&
      storedUsername === localStorage.getItem("creator")
    ) {
      setJoinButtonDisabled(false);
    } else {
      setJoinButtonDisabled(true);
    }
  }, [currentPlayers, totalPlayersRequired]);

  useEffect(() => {
    const fetchGameData = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await api.get(`dashboard/games`, {
          headers: { token: token },
        });
        if (response.data && response.data.length > 0) {
          const game = response.data.find(
            (game) => game.gameId === parseInt(gameId, 10)
          );

          if (game && game.maxPlayers !== undefined) {
            setTotalPlayersRequired(game.maxPlayers);
            setCurrentPlayers(game.currentPlayers);
            localStorage.setItem("creator", game.initiatingUserName);
            console.log("Current players:", game.currentPlayers);
          } else {
            console.error(
              "Game with specified ID not found or lacks 'maxPlayers' data"
            );
          }
        } else {
          console.error("Invalid or empty response data");
        }

        const initialiseWebsocketConnection = async () => {
          await connectWebSocket();
        };
        await initialiseWebsocketConnection();
        await handleSubscribe();
        try {
          await handleJoinGame();
        } catch {
          console.error(
            "Error joining game, did you try to join game with the initiator?"
          );
        }
      } catch (error) {
        console.error("Failed to fetch game data:", error);
      }
    };
    fetchGameData();

    return () => {
      disconnectWebSocket();
      console.log("Disconnected from WebSocket");
    };
  }, []);

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
    } catch (error) {
      console.error(
        "Error joining game:",
        error.response ? error.response.data : error.message
      );
    }
  };

  const handleSubscribe = async () => {
    subscribeToChannel(
      `/game/${gameId}`,
      (message) => {
        console.log(message);
        setMessage(message);
        const messageBody = JSON.parse(message.body);
        if (messageBody.type === "join") {
          setCurrentPlayers((prevPlayers) => prevPlayers + 1);
        } else if (messageBody.type === "leave") {
          setCurrentPlayers((prevPlayers) => prevPlayers - 1);
          if (messageBody.userName === creatorName) {
            console.log("Creator left the game");
            handleLeaveGame();
            navigate("/dashboard");
          }
        }

        if (messageBody === "lets all start together guys") {
          navigate(`/game/${gameId}`);
        }
      },
      { id: `sub-${gameId}` }
    );
  };

  const handleStartGame = async () => {
    sendMessage(`/game/${gameId}`, "lets all start together guys");
    sendMessage(`/app/start/${gameId}`, {});
  };

  useEffect(() => {
    let lastHint = currentHint.hint;

    const updateHint = () => {
      let newHintObject = getRandomHint();
      let attemptCount = 0;

      while (newHintObject.hint === lastHint && attemptCount < 10) {
        newHintObject = getRandomHint();
        attemptCount++;
      }

      setCurrentHint(newHintObject);
      console.log(newHintObject.hint);
      lastHint = newHintObject.hint;
    };

    updateHint();
    const intervalId = setInterval(updateHint, 10000);

    return () => clearInterval(intervalId);
  }, []);

  const lobbyContainerStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
  };

  const statusContainerStyle: React.CSSProperties = {
    textAlign: "center",
    marginBottom: "30px",
  };

  const playersStatusStyle: React.CSSProperties = {
    fontSize: "1.5rem",
    margin: "20px 0",
  };

  const checkIconStyle: React.CSSProperties = {
    color: "green",
    fontSize: "3rem",
    marginTop: "10px",
  };

  const hintContainerStyle: React.CSSProperties = {
    backgroundColor: "#f0f0f0",
    padding: "20px",
    width: "600px",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
  };

  const hintListStyle: React.CSSProperties = {
    listStyleType: "none",
    padding: 0,
    margin: 0,
    width: "100%",
  };

  const hintListItemStyle = {
    marginBottom: "5px",
    textAlign: "center",
  };

  return (
    <Box sx={{ flexGrow: 1, height: "100vh" }}>
      <Grid container spacing={2}>
        <Grid
          item
          xs={8}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={lobbyContainerStyle}>
            <div style={statusContainerStyle}>
              <h2>Waiting for players to join...</h2>
              <div style={playersStatusStyle}>
                {currentPlayers} out of {totalPlayersRequired} players
              </div>
              {currentPlayers === totalPlayersRequired && (
                <div style={checkIconStyle}>✓</div>
              )}
            </div>
            <div style={hintContainerStyle}>
              <ul style={hintListStyle}>
                <li>{currentHint.hint}</li>
                {currentHint.image ? (
                  <img
                    src={currentHint.image}
                    alt="Card Image"
                    style={{ maxWidth: "100px", marginTop: "10px" }}
                  />
                ) : null}
              </ul>
            </div>
            <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
              <Button
                onClick={handleStartGame}
                disabled={joinButtonDisabled}
                variant="contained"
                color="success"
              >
                Start Game
              </Button>
              <Button
                onClick={handleLeaveGame}
                disabled={leaveButtonDisabled}
                variant="contained"
                color="error"
              >
                Leave Lobby
              </Button>
            </Box>
          </div>
        </Grid>
        <Grid item xs={4}></Grid>
      </Grid>
    </Box>
  );
};

export default Lobby;
