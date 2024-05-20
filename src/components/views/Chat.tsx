import React, { useState, useEffect, useRef } from "react";
import styles from "styles/WebSocketChat.module.css";
import { StompClient } from "stompjs";
import {
  subscribeToChannel,
  sendMessage,
  unsubscribeFromChannel,
} from "helpers/WebsocketConnection";

const colors = [
  "#2196F3",
  "#32c787",
  "#00BCD4",
  "#ff5652",
  "#ffc107",
  "#ff85af",
  "#FF9800",
  "#39bbb0",
  "#4CAF50",
  "#e91e63",
  "#795548",
  "#9c27b0",
  "#03a9f4",
  "#4caf50",
];

type ChatProps = {
  stompClientRef: React.RefObject<StompClient>;
  messages: String[];
  setMessages: React.Dispatch<React.SetStateAction<String[]>>;
  connected: boolean;
  setConnected: React.Dispatch<React.SetStateAction<boolean>>;
  userColors: {};
  setUserColors: React.Dispatch<React.SetStateAction<{}>>;
};

const Chat: React.FC<ChatProps> = ({
  stompClientRef,
  messages = [],
  setMessages,
  connected,
  setConnected,
  userColors = {},
  setUserColors,
}) => {
  const storedUsername = localStorage.getItem("username");
  const [username, setUsername] = useState(storedUsername || "");
  const storedgameId = localStorage.getItem("gameId");
  const [roomId, setRoomId] = useState(storedgameId || "");
  const [messageContent, setMessageContent] = useState("");
  const [subscription, setSubscription] = useState(null);
  const messagesEndRef = useRef(null);
  const [activeUsers, setActiveUsers] = useState([]);

  useEffect(() => {
    if (username && !connected && stompClientRef.current) {
      console.log("Attempting to connect and subscribe");
      setConnected(true);
      const sub = subscribeToChannel(`/topic/${roomId}`, (message) => {
        const msgData = JSON.parse(message.body);
        console.log("Message received:", msgData);
        if (msgData.type === "STATE") {
          setActiveUsers(msgData.content.split(","));
          assignColorsToNewUsers(msgData.content.split(","));
        } else {
          onMessageReceived(msgData);
        }
      });
      setSubscription(sub);
      sendMessage(`/app/chat/${roomId}/addUser`, {
        sender: username,
        type: "JOIN",
      });
    }
  }, [username, connected, roomId, stompClientRef]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleDisconnect = () => {
    if (stompClientRef.current) {
      sendMessage(`/app/chat/${roomId}/addUser`, {
        sender: username,
        type: "LEAVE",
      });
      setConnected(false);
      if (subscription) {
        unsubscribeFromChannel(subscription);
      }
    }
  };

  const handleSendMessage = (event) => {
    if (stompClientRef.current) {
      event.preventDefault();
      if (messageContent.trim() && connected) {
        const chatMessage = {
          sender: username,
          content: messageContent,
          type: "CHAT",
        };
        sendMessage(`/app/chat/${roomId}/sendMessage`, chatMessage);
        setMessageContent("");
      }
    }
  };

  const onMessageReceived = (message) => {
    setMessages((messages) => [...messages, message]);
  };

  const assignColorsToNewUsers = (newUsers) => {
    setUserColors((prevColors) => {
      const updatedColors = { ...prevColors };
      newUsers.forEach((user) => {
        if (!updatedColors[user]) {
          updatedColors[user] = getUniqueColor(Object.values(updatedColors));
        }
      });

      return updatedColors;
    });
  };

  const getUniqueColor = (usedColors) => {
    let colorIndex = Math.floor(Math.random() * colors.length);
    let color = colors[colorIndex];
    while (usedColors.includes(color)) {
      colorIndex = (colorIndex + 1) % colors.length;
      color = colors[colorIndex];
    }

    return color;
  };

  return (
    <div className={styles.chatContainer}>
      {connected ? (
        <div>
          <div className={styles.chatRoomHeader}>
            <h2 className={styles.chatRoomTitle}>Gameroom - {roomId}</h2>
            <div className={styles.activeUsers}>
              {Object.keys(userColors).map((user, index) => (
                <div key={index} className={styles.activeUserContainer}>
                  <div
                    className={styles.userAvatar}
                    style={{ backgroundColor: userColors[user] }}
                  >
                    <span className={styles.avatarLetter}>
                      {user.charAt(0)}
                    </span>
                  </div>
                  <span className={styles.userName}>{user}</span>{" "}
                  {/* Display username */}
                </div>
              ))}
            </div>
          </div>
          <ul className={styles.messageList}>
            {messages.map((msg, i) => (
              <li
                key={i}
                className={
                  msg.type === "JOIN" || msg.type === "LEAVE"
                    ? styles.eventMessage
                    : msg.sender === username
                      ? styles.myMessage
                      : styles.otherMessage
                }
              >
                {msg.type === "JOIN" || msg.type === "LEAVE" ? (
                  `${msg.sender} ${msg.type === "JOIN" ? "joined" : "left"}`
                ) : (
                  <div className={styles.messageContent}>
                    <div
                      className={styles.userAvatar}
                      style={{ backgroundColor: userColors[msg.sender] }}
                    >
                      <span className={styles.avatarLetter}>
                        {msg.sender.charAt(0)}
                      </span>
                    </div>
                    <span style={{ color: userColors[msg.sender] }}>
                      {msg.content}
                    </span>
                  </div>
                )}
              </li>
            ))}
            <div ref={messagesEndRef} />
          </ul>
          <form onSubmit={handleSendMessage} className={styles.messageForm}>
            <input
              type="text"
              value={messageContent}
              onChange={(e) => setMessageContent(e.target.value)}
              placeholder="Write a message..."
              className={styles.formControl}
              required
            />
            <button type="submit" className={styles.primary}>
              Send
            </button>
          </form>
        </div>
      ) : (
        <span>Connecting...</span>
      )}
    </div>
  );
};

export default Chat;
