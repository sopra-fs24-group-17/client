import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import CardComponent from "components/ui/CardComponent";
import { Grid, Stack, Typography, Button } from "@mui/material";
import { cardTypes } from "components/models/cards";
import "../../styles/Style.css";
import { connectWebSocket, subscribeToChannel, sendMessage } from "components/views/WebsocketConnection";
import { drawCard } from "components/game/drawCard";
import { playCard } from "components/game/playCard";

const Game = () => {
  const gameId = localStorage.getItem("gameId");
  const userId = localStorage.getItem("id");
  const [closedDeck, setClosedDeck] = useState(cardTypes); // The deck that players will draw from
  const [openDeck, setOpenDeck] = useState([]); // The deck that shows the played cards
  const [playerHand, setPlayerHand] = useState([]); // The current player's hand
  const [playerTurn, setPlayerTurn] = useState(false);
  const navigate = useNavigate();
  const numberOfPlayers = 2;

  // Stomp subscription reference
  const subscriptionRef = useRef(null);

  const handleIncomingMessage = useCallback((message) => {
    // Parse the incoming message and update state accordingly
    const gameState = JSON.parse(message.body);
    // Check if the type of the message is 'cards'
    if (gameState.type === 'cards') {
      // Update the player's hand with the received and enhanced cards
      setPlayerHand((prevHand) => [...prevHand, ...enhanceCardDetails(gameState.cards)]);
      console.log("Received and enhanced cards:", enhanceCardDetails(gameState.cards));
    } else if (gameState.type === "startTurn") {
      setPlayerTurn(true);
    } else if (gameState.type === "endTurn") {
      setPlayerTurn(false);
    }
    else if (gameState.type === "peekIntoDeck") {
      peekIntoDeck(gameState.cards);
    } else if (gameState.type === "gameState") {
      if (gameState.topCardInternalCode) {
        handleOpenDeck(gameState.topCardInternalCode);
      } else {

      }
    } else if (gameState.type === "endGame") {
      alert("Game Over! The winner is: " + gameState.winningUser);
      navigate("/dashboard/join-game");
    }

  }, []);

  const peekIntoDeck = (cards) => {
    const cardsString = cards.map(card => `${card.internalCode}`).join('\n');
    alert(`The next 3 cards are:\n${cardsString}`);
  };

  const handleOpenDeck = (topCardInternalCode) => {
    const topCard = cardTypes.find(card => card.name === topCardInternalCode);
    setOpenDeck((prevDeck) => [...prevDeck, topCard]);
  };

  const enhanceCardDetails = (cards) => {
    return cards.map((card) => {
      // Find the matching card type by internalCode
      const cardType = cardTypes.find((type) => type.name === card.internalCode);
      if (cardType) {
        // Return a new object combining the card info from the server and the cardType details
        return { ...card, ...cardType };
      }
      return card; // Return the original card if no match is found
    });
  };

  useEffect(() => {
    let stompClient = null;
    // Establish the WebSocket connection and subscribe to the channel
    connectWebSocket().then(client => {
      stompClient = client;
      subscriptionRef.current = subscribeToChannel(`/game/${gameId}/${userId}`, handleIncomingMessage);
      subscriptionRef.current = subscribeToChannel(`/game/${gameId}`, handleIncomingMessage);
    });
  }, []);

  const startGame = () => {
    // Send a message to the server that the game is starting
    sendMessage(`/app/start/${gameId}`, {});
  };


  return (
    <Grid container spacing={2} style={{ height: "100vh", padding: "20px" }}>
      <Grid item xs={12}>
        <Typography variant="h4" align="center">
          {`Your turn: ${playerTurn}`}
        </Typography>
      </Grid>
      <Button onClick={startGame}>Start Game</Button>
      {numberOfPlayers <= 2 && (
        <Grid
          item
          xs={12}
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          {/* Enemy's Hand 1 */}
          <div className="card-stack">
            {playerHand.slice(0, 5).map(
              (
                card,
                index
              ) => (
                <div
                  key={card.id}
                  className="card"
                  style={{
                    transform: `translateX(${index * 2}px) translateY(${index * -2}px)`, // Offset each card slightly
                  }}
                >
                  <CardComponent
                    key={index}
                    text={card.text}
                    description={card.description}
                    image="cards/card_back.png"
                  />
                </div>
              ))}
          </div>
        </Grid>
      )}
      {numberOfPlayers >= 3 && (
        <>
          <Grid
            item
            xs={6}
            style={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            {/* Enemy's Hand 1 */}
            <div className="card-stack">
              {playerHand.slice(0, 5).map(
                (
                  card,
                  index
                ) => (
                  <div
                    key={card.id}
                    className="card"
                    style={{
                      transform: `translateX(${index * 2}px) translateY(${index * -2}px)`, // Offset each card slightly
                    }}
                  >
                    <CardComponent
                      key={index}
                      text={card.text}
                      description={card.description}
                      image="cards/card_back.png"
                    />
                  </div>
                ))}
            </div>
          </Grid>
          <Grid
            item
            xs={6}
            style={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            {/* Enemy's Hand 1 */}
            <div className="card-stack">
              {playerHand.slice(0, 5).map(
                (
                  card,
                  index
                ) => (
                  <div
                    key={card.id}
                    className="card"
                    style={{
                      transform: `translateX(${index * 2}px) translateY(${index * -2}px)`, // Offset each card slightly
                    }}
                  >
                    <CardComponent
                      key={index}
                      text={card.text}
                      description={card.description}
                      image="cards/card_back.png"
                    />
                  </div>
                ))}
            </div>
          </Grid>
        </>

      )}
      <Grid
        item
        xs={4}
        style={{ display: "flex", justifyContent: "center" }}
      >
        {/* Enemy's Hand 2 */}
        {numberOfPlayers >= 4 && (
          <div className="card-stack">
            {playerHand.slice(0, 5).map(
              (
                card,
                index
              ) => (
                <div
                  key={card.id}
                  className="card"
                  style={{
                    transform: `translateX(${index * 2}px) translateY(${index * -2}px)`, // Offset each card slightly
                  }}
                >
                  <CardComponent
                    key={index}
                    text={card.text}
                    description={card.description}
                    image="cards/card_back.png"
                  />
                </div>
              ))}
          </div>
        )}
      </Grid>
      <Grid item xs={2} style={{ display: "flex", justifyContent: "center" }}>
        {/* Closed Deck */}
        <div className="card-stack">
          {closedDeck.slice(0, 5).map(
            (
              card,
              index // Display only the top 5 cards for visual effect
            ) => (
              <div
                key={card.id}
                className="card"
                style={{
                  zIndex: closedDeck.length - index, // Ensure the top card is clickable
                  transform: `translateX(${index * 2}px) translateY(${index * -2}px)`, // Offset each card slightly
                }}
              >
                <CardComponent
                  text=""
                  description=""
                  image="cards/card_back.png"
                  onClick={() => drawCard(playerTurn, closedDeck, playerHand, setPlayerHand, setClosedDeck, setPlayerTurn, sendMessage, navigate)}
                />
              </div>
            )
          )}
        </div>
      </Grid>
      <Grid item xs={2} style={{ display: "flex", justifyContent: "center" }}>
        {/* Open Deck */}
        <div className="card-stack">
          <Stack spacing={1} direction="column">
            {openDeck.slice(-5).map((card, index) => (
              <div
                key={card.id}
                className="card"
                style={{
                  transform: `translateX(${index * 2}px) translateY(${index * -2}px)`, // Offset each card slightly
                }}
              >
                <CardComponent
                  key={index}
                  text={card.text}
                  description={card.description}
                  image={card.imageUrl}
                />
              </div>
            ))}
          </Stack>
        </div>
      </Grid>
      {/* Enemy's Hand 3 */}
      <Grid
        item
        xs={4}
        style={{ display: "flex", justifyContent: "center" }}
      >
        {numberOfPlayers >= 5 && (
          <div className="card-stack">
            {playerHand.slice(0, 5).map(
              (
                card,
                index
              ) => (
                <div
                  key={card.id}
                  className="card"
                  style={{
                    transform: `translateX(${index * 2}px) translateY(${index * -2}px)`, // Offset each card slightly
                  }}
                >
                  <CardComponent
                    key={`${card.internalCode}-${index}`}
                    text={card.text}
                    description={card.description}
                    image="cards/card_back.png"
                  />
                </div>
              ))}
          </div>
        )}
      </Grid>
      <Grid
        item
        xs={12}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* Player's Hand */}
        <Stack spacing={1} direction="row">
          {playerHand.map((card, index) => (
            <CardComponent
              key={`${card.internalCode}-${index}`}
              text={card.text}
              description={card.description}
              image={card.imageUrl}
              onClick={() => playCard(card.internalCode, card.name, card.code, playerTurn, playerHand, setPlayerHand, setOpenDeck, openDeck, sendMessage)}
            />
          ))}
        </Stack>
      </Grid>
    </Grid >
  );
};

export default Game;
