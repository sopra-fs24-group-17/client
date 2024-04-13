import React, { useState, useEffect, useRef } from 'react';
import { TextField } from "@mui/material";
import { Client } from '@stomp/stompjs';
import { api, handleError } from "helpers/api";


const GameJoinTestView = () => {
    const [messages, setMessages] = useState([]);
    const [gameId, setGameId] = useState(null);
    const stompClient = useRef(null);

    useEffect(() => {
        // Initialize WebSocket connection using @stomp/stompjs
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

    const subscribeToChannel = () => {
        if (stompClient.current && gameId) {
            const subscription = stompClient.current.subscribe(`/game/${gameId}`, (message) => {
                console.log(`Received message on /game/${gameId}`, message);
                const message2 = `A new player joined game with ID ${gameId}`;
                setMessages(prev => [...prev, message2]);

        }, { id: `sub-${gameId}` });
            console.log(`Subscribed to game ID ${gameId}`);
        } else {
            console.log('WebSocket is not connected or Game ID is not set.');
        }
    };

    const joinGame = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await api.put(`/dashboard/games/join/${gameId}`, {}, { 
              headers: {token: token}
            });            
            const message = `Joined game with ID ${gameId}`;
            console.log(message);
            setMessages(prev => [...prev, message]);
        } catch (error) {
            console.error(`Error joining game: ${error}`);
        }
    };

    return (
        <div>
            <h1>Game Interaction Panel</h1>
            <TextField
                fullWidth
                label="gameId"
                value={gameId || ''}
                onChange={(event) => setGameId(event.target.value)}
                onFocus={(event) => event.target.select()}
                sx={{ width: "500px" }}
                InputLabelProps={{ shrink: true }}
            />
            <button onClick={subscribeToChannel}>Subscribe to Game Channel</button>
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
