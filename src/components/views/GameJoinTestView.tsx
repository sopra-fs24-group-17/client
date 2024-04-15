import React, { useState, useEffect, useRef } from "react";
import { TextField } from "@mui/material";
import { api, handleError } from "helpers/api";
import {
  connectWebSocket,
  disconnectWebSocket,
  subscribeToChannel,
} from "./WebsocketConnection";

const GameJoinTestView = () => {
  const [messages, setMessages] = useState([]);
  const [gameId, setGameId] = useState(null);
  const stompClient = useRef(null);

  useEffect(() => {
    // Initialize WebSocket connection using @stomp/stompjs
    const initialiseWebsocketConnection = async () => {
      await connectWebSocket();
    };
    initialiseWebsocketConnection();

    return () => {
      disconnectWebSocket();
      console.log("Disconnected from WebSocket");
    };
  }, []);

  const joinGame = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.put(
        `/dashboard/games/join/${gameId}`,
        {},
        {
          headers: { token: token },
        }
      );
      const message = `Joined game with ID ${gameId}`;
      console.log(message);
      setMessages((prev) => [...prev, message]);
    } catch (error) {
      console.error(`Error joining game: ${error}`);
    }
  };

  const handleSubcribe = () => {
    subscribeToChannel(`/game/${gameId}`, (message) => {
      console.log(`Received message on /game/${gameId}`, message);
      const message2 = `A new player joined game with ID ${gameId}`;
      setMessages((prev) => [...prev, message2]);
    });
  };

  return (
    <div>
      <h1>Game Interaction Panel</h1>
      <TextField
        fullWidth
        label="gameId"
        value={gameId || ""}
        onChange={(event) => setGameId(event.target.value)}
        onFocus={(event) => event.target.select()}
        sx={{ width: "500px" }}
        InputLabelProps={{ shrink: true }}
      />
      <button onClick={handleSubcribe}>Subscribe to Game Channel</button>
      <button onClick={joinGame}>Join Game</button>
      <div>
        <h2>Messages</h2>
        <ul>
          {messages.map((msg, index) => (
            <li key={index}>{msg}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default GameJoinTestView;
