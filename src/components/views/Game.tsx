import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import CardComponent from "components/ui/CardComponent";
import { Grid, Stack, Typography, Button } from "@mui/material";
import { cardTypes } from "components/models/cards";
import "../../styles/Style.css";
import { connectWebSocket, subscribeToChannel, sendMessage } from "components/views/WebsocketConnection";
import { drawCard } from "components/game/drawCard";
import { playCard } from "components/game/playCard";
import { GameAlert } from "components/ui/GameAlert";
import card_back from 'components/game/cards/card_back.png';

const Game = () => {
  const gameId = localStorage.getItem("gameId");
  const userId = localStorage.getItem("id");
  const [closedDeck, setClosedDeck] = useState(cardTypes);
  const [openDeck, setOpenDeck] = useState([]);
  const [playerHand, setPlayerHand] = useState([]);
  const [playerTurn, setPlayerTurn] = useState(false);
  const navigate = useNavigate();
  const numberOfPlayers = 2;

  const subscriptionRef = useRef(null);

  const handleIncomingMessageUser = useCallback((message) => {
    const gameState = JSON.parse(message.body);
    if (gameState.type === 'cards') {
      setPlayerHand((prevHand) => [...prevHand, ...enhanceCardDetails(gameState.cards)]);
      console.log("Received and enhanced cards:", enhanceCardDetails(gameState.cards));
      console.log("Player Hand: " + JSON.stringify(playerHand, null, 2));
    } else if (gameState.type === "startTurn") {
      setPlayerTurn(true);
    } else if (gameState.type === "endTurn") {
      setPlayerTurn(false);
    } else if (gameState.type === "peekIntoDeck") {
      peekIntoDeck(gameState.cards);
    } else if (gameState.type === "cardStolen") {
      cardStolen(gameState.cards);
    }
    // else if (gameState.type === "explosion") {
    //   handleExplosion(gameState.terminatingUser);
    // } 
    else if (gameState.type === "defuseCard") {
      handleDefuseCard();
    } else if (gameState.type === "gameState") {
      if (gameState.topCardInternalCode) {
        handleOpenDeck(gameState.topCardInternalCode);
      }
    } else if (gameState.type === "endGame") {
      alert("Game Over! The winner is: " + gameState.winningUser);
      navigate("/dashboard/join-game");
    }
  }, []);

  const handleIncomingMessageGame = useCallback((message) => {
    const gameState = JSON.parse(message.body);
    if (gameState.type === "explosion" && gameState.terminatingUser !== userId) {
      handleExplosion(gameState.terminatingUser);
    } else if (gameState.type === "gameState") {
      if (gameState.topCardInternalCode) {
        handleOpenDeck(gameState.topCardInternalCode);
      }
    } else if (gameState.type === "endGame") {
      alert("Game Over! The winner is: " + gameState.winningUser);
      navigate("/dashboard/join-game");
    }
  }, []);

  const peekIntoDeck = (cards) => {
    const cardsString = cards.map(card => `${card.internalCode}`).join('\n');
    GameAlert("Peek into Deck", "The next 3 cards in the deck are:\n" + cardsString);
  };

  const cardStolen = (cards) => {
    const stolenCard = cards[0].internalCode;
    setPlayerHand((prevHand) => prevHand.filter((card) => card.name !== stolenCard));
  };

  const handleExplosion = (userName) => {
    alert(`Player ${userName} drew an Exploding Chicken! Do they have a Defuse card?`);
  };

  const handleDefuseCard = () => {
    setPlayerHand(prevHand => {
      console.log("Player Hand: " + JSON.stringify(prevHand, null, 2));
      const indexOfFirstDefuse = prevHand.findIndex((card) => card.name === "defuse");
      if (indexOfFirstDefuse !== -1) {
        const newPlayerHand = [...prevHand];
        newPlayerHand.splice(indexOfFirstDefuse, 1);
        return newPlayerHand;
      }
      return prevHand;
    });
  };

  const handleOpenDeck = (topCardInternalCode) => {
    const topCard = cardTypes.find(card => card.name === topCardInternalCode);
    setOpenDeck((prevDeck) => [...prevDeck, topCard]);
  };

  const enhanceCardDetails = (cards) => {
    return cards.map((card) => {
      const cardType = cardTypes.find((type) => type.name === card.internalCode);
      if (cardType) {
        return { ...card, ...cardType };
      }
      return card;
    });
  };

  useEffect(() => {
    console.log("Player Hand updated: " + JSON.stringify(playerHand, null, 2));
  }, [playerHand]);

  useEffect(() => {
    let stompClient = null;
    connectWebSocket().then(client => {
      stompClient = client;
      subscriptionRef.current = subscribeToChannel(`/game/${gameId}/${userId}`, handleIncomingMessageUser);
      subscriptionRef.current = subscribeToChannel(`/game/${gameId}`, handleIncomingMessageGame);
      sendMessage(`/app/start/${gameId}`, {});
    });
  }, []);

  return (
    <Grid container spacing={2} style={{ height: "100vh", padding: "20px" }}>
      <Grid item xs={12}>
        <Typography variant="h4" align="center">
          {`Your turn: ${playerTurn}`}
        </Typography>
      </Grid>
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
                    transform: `translateX(${index * 2}px) translateY(${index * -2}px)`,
                  }}
                >
                  <CardComponent
                    key={index}
                    text={card.text}
                    description={card.description}
                    image={card_back}
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
                      transform: `translateX(${index * 2}px) translateY(${index * -2}px)`,
                    }}
                  >
                    <CardComponent
                      key={index}
                      text={card.text}
                      description={card.description}
                      image={card_back}
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
                      transform: `translateX(${index * 2}px) translateY(${index * -2}px)`,
                    }}
                  >
                    <CardComponent
                      key={index}
                      text={card.text}
                      description={card.description}
                      image={card_back}
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
                    transform: `translateX(${index * 2}px) translateY(${index * -2}px)`,
                  }}
                >
                  <CardComponent
                    key={index}
                    text={card.text}
                    description={card.description}
                    image={card_back}
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
              index
            ) => (
              <div
                key={card.id}
                className="card"
                style={{
                  zIndex: closedDeck.length - index,
                  transform: `translateX(${index * 2}px) translateY(${index * -2}px)`,
                }}
              >
                <CardComponent
                  text=""
                  description=""
                  image={card_back}
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
                  transform: `translateX(${index * 2}px) translateY(${index * -2}px)`,
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
                    transform: `translateX(${index * 2}px) translateY(${index * -2}px)`,
                  }}
                >
                  <CardComponent
                    key={`${card.internalCode}-${index}`}
                    text={card.text}
                    description={card.description}
                    image={card_back}
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
