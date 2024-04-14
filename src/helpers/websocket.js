import { createContext, useEffect, useState } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { getDomainWS } from './getDomain';

export const WebSocketContext = createContext();

export const WebSocketProvider = ({ children }) => {
    const WS_URL = getDomainWS();
    const { sendJsonMessage, lastMessage, readyState } = useWebSocket(WS_URL, {
        share: false,
        shouldReconnect: () => true,
    });

    const [lastJsonMessage, setLastJsonMessage] = useState(null);

    useEffect(() => {
        if (lastMessage?.data) {
            setLastJsonMessage(JSON.parse(lastMessage.data));
        }
    }, [lastMessage]);

    return (
        <WebSocketContext.Provider value={{ sendJsonMessage, lastJsonMessage, readyState }}>
            {children}
        </WebSocketContext.Provider>
    );
};