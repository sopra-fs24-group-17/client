import PropTypes from 'prop-types';
import React, { useEffect, useState , useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SockJS from 'sockjs-client';
import Stomp from 'webstomp-client';
import { Client } from '@stomp/stompjs';
import { api, handleError } from "helpers/api";

const Lobby = () => {
  const [currentPlayers, setCurrentPlayers] = useState(1);
  const navigate = useNavigate();
  const [joinButtonDisabled, setJoinButtonDisabled] = useState(false);
  const [totalPlayersRequired, setTotalPlayersRequired] = useState(
    parseInt(localStorage.getItem('totalPlayersRequired') || '2', 10)
  );
  const [messages, setMessages] = useState([]);
  const stompClient = useRef(null);
  const { gameId } = useParams();
  useEffect(() => {
    stompClient.current = new Client({
      brokerURL: 'ws://localhost:8080/ws',
      debug: function (str) {
        console.log('STOMP: ' + str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 20000,
      heartbeatOutgoing: 20000,
      onConnect: function () {
        console.log('Connected to WebSocket');
        // Do not place join game logic here
      },
      onStompError: function (frame) {
        console.error('Broker reported error: ' + frame.headers['message']);
        console.error('Additional details: ' + frame.body);
      },
    });
  
    stompClient.current.activate();
  
    return () => {
      stompClient.current.deactivate();
      console.log('Disconnected from WebSocket');
    };
  }, []);

  const handleJoinGame = async () => {
    const token = localStorage.getItem('token');
  
    try {
      const response = await api.put(`/dashboard/games/join/${gameId}`, {}, {
        headers: {
          'token': token,
        }
      });
      
      console.log('Joined game successfully', response.data);
      setCurrentPlayers(currentPlayers + 1); // Update the number of players
      // Additional logic for subscribing to WebSocket updates
    } catch (error) {
      console.error('Error joining game:', error.response ? error.response.data : error.message);
    }
  }
  const subscribeToChannel = () => {
    if (stompClient.current && gameId) {
      stompClient.current.subscribe(`/game/${gameId}`, (message) => {
        const messageBody = message.body
        if (messageBody.type === 'PLAYER_JOINED') {
          setCurrentPlayers(prev => prev + 1);
        } else if (messageBody.type === 'PLAYER_LEFT') {
          setCurrentPlayers(prev => Math.max(prev - 1, 0));
        }
      }, { id: `sub-${gameId}` });console.log(currentPlayers)
    }
  };
  // Annotate style objects with React.CSSProperties
  const lobbyContainerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
  };

  const statusContainerStyle: React.CSSProperties = {
    textAlign: 'center',
    marginBottom: '30px',
  };

  const playersStatusStyle: React.CSSProperties = {
    fontSize: '1.5rem', 
    margin: '20px 0',
  };

  const checkIconStyle: React.CSSProperties = {
    color: 'green',
    fontSize: '3rem',
    marginTop: '10px',
  };

  const hintContainerStyle: React.CSSProperties = {
    backgroundColor: '#f0f0f0',
    padding: '20px',
    width: '300px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    textAlign: 'left',
  };

  const hintTitleStyle: React.CSSProperties = {
    marginBottom: '10px',
  };

  const hintListStyle: React.CSSProperties = {
    paddingLeft: '20px',
  };

  const hintListItemStyle: React.CSSProperties = {
    marginBottom: '5px',
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
      <button onClick={handleJoinGame} disabled={joinButtonDisabled}>Join Game</button>
<button onClick={subscribeToChannel}>Subscribe to Game Channel</button>

    </div>
  );
};

  

export default Lobby;
