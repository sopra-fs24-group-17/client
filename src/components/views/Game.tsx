import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import CardComponent from "components/ui/CardComponent";
import { Grid, Stack, Typography, Button } from "@mui/material";
import { cardTypes } from "components/models/cards";
import { connectWebSocket, subscribeToChannel, sendMessage } from "components/views/WebsocketConnection";
import { drawCard } from "components/game/drawCard";
import { playCard } from "components/game/playCard";
import GameAlert from "components/ui/GameAlert";
import EnemyPlayers from "components/views/EnemyPlayers";
import FilledAlert from "./Alert";
import card_back from "components/game/cards/card_back.png";
import game_background from "components/game/game_background.png";
import "../../styles/Style.css";

/* 
TODO: 
  Fix bugs:
    - certain random chickens not both are taken away when playing a palindrome card
    - wrong alert is shown when not your turn
    - if i play favor and click on cancel, the card is still removed from my hand
  
  Features: 
    - If I play defuse, I want to be able to choose where to put the explosion card

*/

const Game = () => {
  const gameId = localStorage.getItem("gameId");
  const userId = localStorage.getItem("id");
  const [closedDeck, setClosedDeck] = useState(cardTypes);
  const [openDeck, setOpenDeck] = useState([]);
  const [playerHand, setPlayerHand] = useState([]);
  const [playerTurn, setPlayerTurn] = useState(false);
  const [gameAlertOpen, setGameAlertOpen] = useState(false);
  const [gameAlertTitle, setGameAlertTitle] = useState("");
  const [gameAlertDescription, setGameAlertDescription] = useState("");
  const [postAlertAction, setPostAlertAction] = useState(null);
  const [numberOfPlayers, setNumberOfPlayers] = useState(2);
  const [piles, setPiles] = useState([]);

  const navigate = useNavigate();

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
    } else if (gameState.type === "defuseCard") {
      handleDefuseCard();
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
      if (gameState.numberOfPlayers) {
        setNumberOfPlayers(gameState.numberOfPlayers);
      }
      if (gameState.piles) {
        setPiles(gameState.piles);
      }
    } else if (gameState.type === "endGame") {
      gameAlertHandleOpen("Game Over!", "Game Over! The winner is: " + gameState.winningUser);
      setPostAlertAction(() => () => navigate("/dashboard/join-game"));
    }
  }, []);

  const peekIntoDeck = (cards) => {
    const cardsString = cards.map(card => `${card.internalCode}`).join('\n');
    gameAlertHandleOpen("See the Future", "The next 3 cards in the deck are:\n" + cardsString);
  };

  const cardStolen = (cards) => {
    const stolenCard = cards[0].internalCode;
    setPlayerHand((prevHand) => prevHand.filter((card) => card.name !== stolenCard));
  };

  const handleExplosion = (userName) => {
    gameAlertHandleOpen("EXPLOSION!!", `Player ${userName} drew an Exploding Chicken! Do they have a Defuse card?`);
  };

  const handleDefuseCard = () => {
    setPlayerHand(prevHand => {
      console.log("Player Hand: " + JSON.stringify(prevHand, null, 2));
      const indexOfFirstDefuse = prevHand.findIndex((card) => card.name === "defuse");
      console.log("Index of first defuse: " + indexOfFirstDefuse)
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

  const gameAlertHandleOpen = (title, description) => {
    setGameAlertTitle(title);
    setGameAlertDescription(description);
    setGameAlertOpen(true);
  };

  const gameAlertHandleClose = () => {
    setGameAlertOpen(false);
    if (postAlertAction) {
      postAlertAction();
      setPostAlertAction(null);
    }
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
    });
  }, []);

  return (
    <Grid container spacing={2} style={{
      minHeight: "100vh",
      backgroundImage: `url(${game_background})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      marginTop: 0,
    }}>
      {playerTurn && <FilledAlert />}
      <GameAlert
        open={gameAlertOpen}
        handleClose={gameAlertHandleClose}
        title={gameAlertTitle}
        description={gameAlertDescription}
      />
      <Grid item xs={12} style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        <EnemyPlayers piles={piles} />
      </Grid>
      <Grid item xs={6} style={{ display: "flex", justifyContent: "center" }}>
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
      <Grid item xs={6} style={{ display: "flex", justifyContent: "center" }}>
        {/* Open Deck */}
        <div className="card-stack">
          <Stack spacing={1} direction="column">
            {openDeck.slice(-1).map((card, index) => (
              <div
                key={card.id}
                className="card"
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
      <Grid item xs={12} style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
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
