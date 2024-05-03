import PropTypes from 'prop-types';
import React, { useEffect, useState , useRef } from "react";
import { useNavigate, useParams, useLocation  } from "react-router-dom";
import { api, handleError } from "helpers/api";
import {
  connectWebSocket,
  disconnectWebSocket,
  subscribeToChannel,
  sendMessage,
} from "./WebsocketConnection";
import { Button, Box } from "@mui/material";

const Lobby = () => {
  const [currentPlayers, setCurrentPlayers] = useState(1);
  const navigate = useNavigate();
  const [joinButtonDisabled, setJoinButtonDisabled] = useState(true);
  const [leaveButtonDisabled, setLeaveButtonDisabled] = useState(false);
  const [totalPlayersRequired, setTotalPlayersRequired] = useState(2);
  const { gameId } = useParams();
  const [message, setMessage] = useState(null);

  // for chat
  const [messages, setMessages] = useState([]); // Stores chat messages
  const [chatMessage, setChatMessage] = useState(""); // Stores the current message input
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    
    if (currentPlayers === totalPlayersRequired) {
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
          headers: { 'token': token } 
        });
        // This is to find the game we want from all the slots to take the info we want
        if (response.data && response.data.length > 0) {
          const game = response.data.find(game => game.gameId === parseInt(gameId, 10));
          
          if (game && game.maxPlayers !== undefined) {
            setTotalPlayersRequired(game.maxPlayers);
            setCurrentPlayers(game.currentPlayers);
            
          } else {
            console.error("Game with specified ID not found or lacks 'maxPlayers' data");
          }
        } else {
          console.error("Invalid or empty response data");
        }
        

        // Initialize WebSocket connection using @stomp/stompjs
        const initialiseWebsocketConnection = async () => {
          await connectWebSocket();
          const username = localStorage.getItem('username'); 
        addUserToChat(username);
        };
        await initialiseWebsocketConnection();
        await handleSubcribe();
        
        try {
          await handleJoinGame();
        } catch {
          console.error("Error joining game, did you try to join game with the initiator?")
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

  const sendChatMessage = async (event) => {
    event.preventDefault();
    if (chatMessage.trim().length === 0) {
      console.log("No message to send");
      return;  // Prevent sending an empty message
    }
    const username = localStorage.getItem('username'); // Fetch the username from localStorage or state
    const msg = { sender: username, content: chatMessage, type: "CHAT" };
    sendMessage("/chat.sendMessage", JSON.stringify(msg));
    setChatMessage(""); // Clear input after sending
  };
  
  


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
      navigate(-1);
    } catch (error) {
      console.error(
        "Error leaving game:",
        error.response ? error.response.data : error.message
      );
    }
  };
  const addUserToChat = (username) => {
    const msg = { sender: username, type: "JOIN" };
    sendMessage("/chat.addUser", JSON.stringify(msg));
  };
  
  const handleSubcribe = async () => {
    subscribeToChannel(
      `/game/${gameId}`,
      (message) => {
        console.log(message);
        console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
        setMessage(message);
        const messageBody = JSON.parse(message.body);
        if (messageBody.type === "join") {
          setCurrentPlayers((prevPlayers) => prevPlayers + 1);
        } else if (messageBody.type === "leave") {
          setCurrentPlayers((prevPlayers) => prevPlayers - 1);
        }

        if (messageBody === "lets all start together guys") {
          navigate(`/game`); 
        }
      },
      { id: `sub-${gameId}` }
    );

    subscribeToChannel("/topic/public", (message) => {
      console.log("Received public message:", message);
      try {
          const chatMsg = JSON.parse(message.body);
          setMessages(prevMessages => [...prevMessages, chatMsg]);
          console.log("dssssssssssssssssssssssssssssss", message.body);
          if (chatMsg.type === "JOIN") {
              console.log(`${chatMsg.sender} has joined the chat.`);
          }
      } catch (error) {
          console.error("Error parsing message:", error);
      }
  });
  
  };


  const handleStartGame = async () => {
    sendMessage(`/game/${gameId}`, "lets all start together guys");
    sendMessage(`/app/start/${gameId}`, {});
  }

  const chatContainerStyle:  React.CSSProperties =  {
    border: '1px solid #ccc',
    borderRadius: '5px',
    padding: '10px',
    width: '90%',  // Adjust width as needed
    height: '300px',
    overflowY: 'auto',
    margin: '10px auto'
  };
  
  const chatMessageStyle:  React.CSSProperties = {
    backgroundColor: '#f1f1f1',
    padding: '8px 15px',
    borderRadius: '12px',
    margin: '5px',
    textAlign: 'left',
    maxWidth: '80%',
  };
  
  const chatFormStyle:  React.CSSProperties ={
    display: 'flex',
    justifyContent: 'space-between',
    padding: '10px',
    borderTop: '1px solid #ccc'
  };
  
  const chatInputStyle :  React.CSSProperties ={
    flexGrow: 1,
    marginRight: '10px'
  };
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
      <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>  
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
        {/* Chat section */}
<div style={chatContainerStyle}>
    {messages.map((msg, index) => (
        <div key={index} style={chatMessageStyle}>
            <strong>{msg.sender}</strong>: {msg.content}
        </div>
    ))}
    <div ref={messagesEndRef} /> {/* This element is used to scroll into view after new messages are added */}
</div>
  <form onSubmit={sendChatMessage} style={chatFormStyle}>
    <input
      type="text"
      value={chatMessage}
      onChange={(e) => setChatMessage(e.target.value)}
      style={chatInputStyle}
      placeholder="Type a message..."
    />
    <Button type="submit" variant="contained" color="primary">
      Send
    </Button>
  </form>
  </div>
    
  );
};

export default Lobby;
