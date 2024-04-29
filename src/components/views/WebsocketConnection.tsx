// Websocket Connection
import { Client } from "@stomp/stompjs";
import { getDomainWS } from "../../helpers/getDomain"

let stompClient = null;

export const connectWebSocket = () => {
  return new Promise((resolve, reject) => {
    if (!stompClient) {
      const WS_URL = getDomainWS();
      stompClient = new Client({
        brokerURL: WS_URL,
        reconnectDelay: 5000,
        heartbeatIncoming: 20000,
        heartbeatOutgoing: 20000,
        debug: (str) => {
          console.log("STOMP: " + str);
        },
        onConnect: () => {
          console.log("Connected to WebSocket");
          resolve(stompClient);
        },
        onStompError: (frame) => {
          console.error("Broker reported error: ", frame.headers["message"]);
          console.error("Additional details: ", frame.body);
          reject(new Error("WebSocket connection failed"));
        },
      });
      stompClient.activate();
    } else {
      resolve(stompClient); // Resolve immediately if already connected
    }
  });
};

export const disconnectWebSocket = () => {
  if (stompClient) {
    stompClient.deactivate();
    stompClient = null;
    console.log("Disconnected from WebSocket");
  }
};

export const subscribeToChannel = (channel, callback, options = {}) => {
  if (stompClient && stompClient.connected) {
    const subscription = stompClient.subscribe(channel, callback, options);
    return subscription;
  } else {
    console.log("WebSocket is not connected.");
  }
};

export const unsubscribeFromChannel = (subscription) => {
  if (subscription) {
    subscription.unsubscribe();
  }
};

/**
 * Sends a message to a specified destination over the WebSocket connection.
 * @param {string} destination The destination endpoint on the server.
 * @param {Object} headers Optional headers for the message.
 * @param {string} body The message body to send.
 */
export const sendMessage = (destination, body, headers = {}) => {
  if (stompClient && stompClient.connected) {
    stompClient.publish({
      destination,
      headers,
      body: JSON.stringify(body),
    });
  } else {
    console.log("WebSocket is not connected. Unable to send message.");
  }
};

