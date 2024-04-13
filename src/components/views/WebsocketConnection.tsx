// WebsocketConnection.js
import { Client } from '@stomp/stompjs';

let stompClient = null;

export const connectWebSocket = () => {
    return new Promise((resolve, reject) => {
        if (!stompClient) {
            stompClient = new Client({
                brokerURL: 'ws://localhost:8080/ws',
                reconnectDelay: 5000,
                heartbeatIncoming: 20000,
                heartbeatOutgoing: 20000,
                debug: (str) => {
                    console.log('STOMP: ' + str);
                },
                onConnect: () => {
                    console.log('Connected to WebSocket');
                    resolve(stompClient);
                },
                onStompError: (frame) => {
                    console.error('Broker reported error: ', frame.headers['message']);
                    console.error('Additional details: ', frame.body);
                    reject(new Error('WebSocket connection failed'));
                },
            });
            stompClient.activate();
        } else {
            resolve(stompClient);  // Resolve immediately if already connected
        }
    });
};


export const disconnectWebSocket = () => {
    if (stompClient) {
        stompClient.deactivate();
        stompClient = null;
        console.log('Disconnected from WebSocket');
    }
};

export const subscribeToChannel = (channel, callback) => {
    if (stompClient) {
        return stompClient.subscribe(channel, (message) => {
            console.log(`Received message on ${channel}:`, message);
            callback(message);
        });
    }
};

export const unsubscribeFromChannel = (subscription) => {
    if (subscription) {
        subscription.unsubscribe();
    }
};
