import PropTypes from 'prop-types';
import React, { useEffect, useState , useRef } from "react";
import { useNavigate, useParams, useLocation  } from "react-router-dom";
import { api, handleError } from "helpers/api";
import {
  connectWebSocket,
  disconnectWebSocket,
  subscribeToChannel,
} from "./WebsocketConnection";
import { Button } from "@mui/material";

const Lobby = () => {
  const [currentPlayers, setCurrentPlayers] = useState(1);
  const navigate = useNavigate();
  const [joinButtonDisabled, setJoinButtonDisabled] = useState(false);
  const [leaveButtonDisabled, setLeaveButtonDisabled] = useState(false);
  const [totalPlayersRequired, setTotalPlayersRequired] = useState(2);
  const { gameId } = useParams();
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const fetchGameData = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await api.get(`dashboard/games`, {
          headers: { 'token': token } 
        });
console.log(response.data)
    if (response.data && response.data.length > 0) {
      const game = response.data.find(game => game.gameId === parseInt(gameId, 10));
      if (game && game.maxPlayers !== undefined) {
        setTotalPlayersRequired(game.maxPlayers);
      } else {
        console.error("Game with specified ID not found or lacks 'maxPlayers' data");
      }
    } else {
      console.error("Invalid or empty response data");
    }
      } catch (error) {
        console.error("Failed to fetch game data:", error);
      }
    };

    // Initialize WebSocket connection using @stomp/stompjs
    const initialiseWebsocketConnection = async () => {
      await connectWebSocket();
    };

    fetchGameData();
    initialiseWebsocketConnection();

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
      console.log("Joined left successfully", response.data);
    } catch (error) {
      console.error(
        "Error leaving game:",
        error.response ? error.response.data : error.message
      );
    }
  };

  const handleSubcribe = () => {
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
        }
      },
      { id: `sub-${gameId}` }
    );
  };

  // Annotate style objects with React.CSSProperties
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
    width: "300px",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    textAlign: "left",
  };

  const hintTitleStyle: React.CSSProperties = {
    marginBottom: "10px",
  };

  const hintListStyle: React.CSSProperties = {
    paddingLeft: "20px",
  };

  const hintListItemStyle: React.CSSProperties = {
    marginBottom: "5px",
  };

  return (
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
        <h3 style={hintTitleStyle}>Hint</h3>
        <p>In this game mode, the rules are...</p>
        <ul style={hintListStyle}>
          <li style={hintListItemStyle}>Try to do this.</li>
          <li style={hintListItemStyle}>You can also do this.</li>
        </ul>
      </div>
      {/* Adding a Join Game button */}
      <Button
        onClick={handleJoinGame}
        disabled={joinButtonDisabled}
        variant="outlined"
      >
        Join Game
      </Button>
      <Button
        onClick={handleLeaveGame}
        disabled={leaveButtonDisabled}
        variant="outlined"
      >
        Leave Game
      </Button>
      <Button onClick={handleSubcribe} variant="outlined">
        Subscribe to Game Channel
      </Button>
    </div>
  );
};

export default Lobby;
