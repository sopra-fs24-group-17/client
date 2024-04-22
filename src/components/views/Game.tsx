import React, { useState, useEffect, useCallback, useRef } from "react";
import { api, handleError } from "helpers/api";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import CardComponent from "components/ui/CardComponent";
import CardMovement from "components/ui/CardMovement";
import { Grid, Stack, Paper } from "@mui/material";
import { motion } from "framer-motion";
import { cardTypes } from "components/models/cards";
import "../../styles/Style.css";
import { connectWebSocket, disconnectWebSocket, subscribeToChannel, unsubscribeFromChannel, sendMessage } from "components/views/WebsocketConnection";

const Game = () => {
  const [closedDeck, setClosedDeck] = useState(cardTypes); // The deck that players will draw from
  const [openDeck, setOpenDeck] = useState([]); // The deck that shows the played cards
  const [playerHand, setPlayerHand] = useState([]); // The current player's hand
  const numberOfPlayers = 5;

  // Stomp subscription reference
  const subscriptionRef = useRef(null);

  const handleIncomingMessage = useCallback((message) => {
    // Parse the incoming message and update state accordingly
    const gameState = JSON.parse(message.body);
    setClosedDeck(gameState.closedDeck);
    setOpenDeck(gameState.openDeck);
    setPlayerHand(gameState.playerHand);
  }, []);

  useEffect(() => {
    let stompClient = null;
    const gameId = localStorage.getItem("gameId");

    // Establish the WebSocket connection and subscribe to the channel
    connectWebSocket().then(client => {
      stompClient = client;
      subscriptionRef.current = subscribeToChannel(`/game/${gameId}`, handleIncomingMessage);

      // Send a message to the server that the game is starting
      sendMessage(`/app/game/${gameId}/start`, {});
    });

    // Clean up on unmount
    return () => {
      if (subscriptionRef.current) {
        unsubscribeFromChannel(subscriptionRef.current);
      }
      disconnectWebSocket();
    };
  }, [handleIncomingMessage]);


  const drawCard = () => {
    if (closedDeck.length > 0) {
      // Remove the top card from the closed deck
      const drawnCard = closedDeck.shift();

      // If the card is an Exploding Kitten and the player has no defuse card, the player loses
      if (drawnCard.id === 1 && !playerHand.some((card) => card.id === 2)) {
        alert(
          "You drew an Exploding Kitten and have no Defuse card! You lose!"
        );
      } else {
        // Add the drawn card to the player's hand and open deck if necessary
        setPlayerHand((prevHand) => [...prevHand, drawnCard]);

        // Handle other card effects...
      }

      // Update the closed deck state
      setClosedDeck([...closedDeck]);
    } else {
      // Handle the situation where there are no more cards to draw, if applicable
    }
  };

  const playCard = (cardId) => {
    // Find the card in the player's hand
    const cardIndex = playerHand.findIndex((card) => card.id === cardId);
    if (cardIndex !== -1) {
      const playedCard = playerHand[cardIndex];

      // Apply the card's effect here (you'll need to flesh this out based on the card's abilities)
      handleCardEffect(playedCard);

      // Remove the card from the player's hand and add it to the open deck
      const newPlayerHand = [...playerHand];
      newPlayerHand.splice(cardIndex, 1); // Remove the card from the player's hand
      setPlayerHand(newPlayerHand);
      setOpenDeck([...openDeck, playedCard]); // Add the card to the open deck

      // End the player's turn, move to the next player, etc.
      // endTurn(); // This is a placeholder for ending the player's turn
    }
  };

  const handleCardEffect = (card) => {
    switch (card.type) {
      case "attack":
        // Handle attack card effect
        break;
      case "skip":
        // Handle skip card effect
        break;
      case "favor":
        // Handle favor card effect
        break;
      // ... handle other card types
      default:
        // Handle default case, if any
        break;
    }
  };

  return (
    <Grid container spacing={2} style={{ height: "100vh", padding: "20px" }}>
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
        xs={3}
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
      <Grid item xs={3} style={{ display: "flex", justifyContent: "center" }}>
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
                  onClick={drawCard}
                />
              </div>
            )
          )}
        </div>
      </Grid>
      <Grid item xs={3} style={{ display: "flex", justifyContent: "center" }}>
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
        xs={3}
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
              key={index}
              text={card.text}
              description={card.description}
              image={card.imageUrl}
              onClick={() => playCard(card.id)}
            />
          ))}
        </Stack>
      </Grid>
    </Grid >
  );
};

export default Game;
