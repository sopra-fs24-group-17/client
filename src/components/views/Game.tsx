import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import CardComponent from "components/ui/CardComponent";
import { Grid, Stack, Typography, Button, Box } from "@mui/material";
import { cardTypes } from "components/models/cards";
import {
  connectWebSocket,
  subscribeToChannel,
  sendMessage,
} from "components/views/WebsocketConnection";
import { drawCard } from "components/game/drawCard";
// import { playCard } from "components/game/playCard";
import GameAlert from "components/ui/GameAlert";
import GameAlertWithInput from "components/ui/GameAlertWithInput";
import EnemyPlayers from "components/views/EnemyPlayers";
import FilledAlert from "./Alert";
import card_back from "components/game/cards/card_back.png";
import game_background from "components/game/game_background.png";
import explosionGif from "components/game/explosionGif.gif";
import explosionSound from "components/game/explosionSound.wav";
import "../../styles/Style.css";

const Game = () => {
  const gameId = localStorage.getItem("gameId");
  const userId = localStorage.getItem("id");
  const username = localStorage.getItem("username");
  const [closedDeck, setClosedDeck] = useState(cardTypes);
  const [openDeck, setOpenDeck] = useState([]);
  const [playerHand, setPlayerHand] = useState([]);
  const [playerTurn, setPlayerTurn] = useState(false);
  const [gameAlertOpen, setGameAlertOpen] = useState(false);
  const [gameAlertTitle, setGameAlertTitle] = useState("");
  const [gameAlertDescription, setGameAlertDescription] = useState("");
  const [postAlertAction, setPostAlertAction] = useState(null);
  const [gameAlertWithInputOpen, setGameAlertWithInputOpen] = useState(false);
  const [gameAlertWithInputTitle, setGameAlertWithInputTitle] = useState("");
  const [gameAlertWithInputDescription, setGameAlertWithInputDescription] =
    useState("");
  const [piles, setPiles] = useState([]);
  const [names, setNames] = useState([]);
  const [cardCodeFavor, setCardCodeFavor] = useState([]);
  const [explode, setExplode] = useState(false);


  const navigate = useNavigate();

  const subscriptionRef = useRef(null);

  const handleIncomingMessageUser = useCallback((message) => {
    const gameState = JSON.parse(message.body);
    if (gameState.type === "cards") {
      setPlayerHand((prevHand) => [
        ...prevHand,
        ...enhanceCardDetails(gameState.cards),
      ]);
      console.log(
        "Received and enhanced cards:",
        enhanceCardDetails(gameState.cards)
      );
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
    } else if (gameState.type === "placementRequest") {
      handlePlacementRequest();
    }
  }, []);

  const handleIncomingMessageGame = useCallback((message) => {
    const gameState = JSON.parse(message.body);
    if (
      gameState.type === "explosion" &&
      gameState.terminatingUser !== userId
    ) {
      handleExplosion(gameState.terminatingUser);
    } else if (gameState.type === "gameState") {
      if (gameState.topCardInternalCode) {
        handleOpenDeck(gameState.topCardInternalCode);
      }
      if (gameState.piles) {
        setPiles(gameState.piles);
        if (gameState.piles.dealer === 0) {
          setClosedDeck([]);
        }
      }
      if (gameState.playerNames) {
        setNames(gameState.playerNames);
        console.log(names);
      }
    } else if (gameState.type === "endGame") {
      gameAlertHandleOpen(
        "Game Over!",
        "Game Over! The winner is: " + gameState.winningUser
      );
      setPostAlertAction(() => () => navigate("/dashboard/join-game"));
    } else if (
      gameState.type === "cardPlayed" &&
      gameState.userName === username
    ) {
      handleCardPlayed(gameState.externalCode);
    }
  }, []);

  const handleCardPlayed = (externalCode) => {
    setPlayerHand((prevHand) => {
      console.log("Player Hand: " + JSON.stringify(prevHand, null, 2));
      const index = prevHand.findIndex((card) => card.code === externalCode);
      console.log("Index of card played: " + index);
      if (index !== -1) {
        const newPlayerHand = [...prevHand];
        newPlayerHand.splice(index, 1);
        return newPlayerHand;
      }
      return prevHand;
    });
  };

  const peekIntoDeck = (cards) => {
    const cardsString = cards.map((card) => `${card.internalCode}`).join("\n");
    gameAlertHandleOpen(
      "See the Future",
      "The next 3 cards in the deck are:\n" + cardsString
    );
  };

  const cardStolen = (cards) => {
    const stolenCard = cards[0].internalCode;
    setPlayerHand((prevHand) =>
      prevHand.filter((card) => card.name !== stolenCard)
    );
  };

  const handleExplosion = (userName) => {
    setExplode(true);
    setTimeout(() => {
      setExplode(false);
      gameAlertHandleOpen("EXPLOSION!!", `Player ${userName} drew an Exploding Chicken! Do they have a Defuse card?`);
    }, 3000); 
  };

  const explosionAudioRef = useRef(new Audio(explosionSound));

  useEffect(() => {
    if (explode) {
      explosionAudioRef.current.play();
      setTimeout(() => {
        explosionAudioRef.current.pause();
        explosionAudioRef.current.currentTime = 0; 
      }, 3000); // Stop the audio after 3 seconds (same as GIF duration)
    }
  }, [explode]);
  

  const handleDefuseCard = () => {
    setPlayerHand((prevHand) => {
      console.log("Player Hand: " + JSON.stringify(prevHand, null, 2));
      const indexOfFirstDefuse = prevHand.findIndex(
        (card) => card.name === "defuse"
      );
      console.log("Index of first defuse: " + indexOfFirstDefuse);
      if (indexOfFirstDefuse !== -1) {
        const newPlayerHand = [...prevHand];
        newPlayerHand.splice(indexOfFirstDefuse, 1);
        return newPlayerHand;
      }
      return prevHand;
    });
  };

  const handlePlacementRequest = () => {
    gameAlertWithInputHandleOpen(
      "Explosion Time",
      "Choose where on the dealer deck you want to place the explosion."
    );
  };

  const handleOpenDeck = (topCardInternalCode) => {
    const topCard = cardTypes.find((card) => card.name === topCardInternalCode);
    setOpenDeck((prevDeck) => [...prevDeck, topCard]);
  };

  const enhanceCardDetails = (cards) => {
    return cards.map((card) => {
      const cardType = cardTypes.find(
        (type) => type.name === card.internalCode
      );
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

  const gameAlertWithInputHandleOpen = (title, description) => {
    setGameAlertWithInputTitle(title);
    setGameAlertWithInputDescription(description);
    setGameAlertWithInputOpen(true);
  };

  const gameAlertWithInputHandleClose = () => {
    setGameAlertWithInputOpen(false);
  };

  const playCard = (cardId, cardName, cardCode) => {
    let cardCodes = [cardCode];
    let cardIncidesToRemove = [];

    if (!playerTurn) {
      setGameAlertTitle("It's not your turn!");
      setGameAlertDescription(
        "You can only play a card when it's your turn. You can see that it is your turn by the alert at the top of the screen."
      );
      setGameAlertOpen(true);
      return;
    }

    const cardIndex = playerHand.findIndex((card) => card.code === cardCode);
    // cardIncidesToRemove.push(cardIndex)
    if (cardIndex !== -1) {
      if (cardName === "favor") {
        gameAlertWithInputHandleOpen(
          "Favor",
          "Choose a player to take a card from."
        );
        setCardCodeFavor(cardCode);
      } else if (
        ["hairypotatocat", "tacocat", "beardcat", "cattermelon"].includes(
          cardName
        )
      ) {
        // If the card is a palindrome card, check if the player has another card of the same type
        const otherCardIndex = playerHand.findIndex(
          (card, index) =>
            card.internalCode === cardId &&
            card.code !== cardCode &&
            index !== cardIndex
        );
        if (otherCardIndex === -1) {
          setGameAlertTitle("Where is your second card?");
          setGameAlertDescription(
            "You need two cards of the same type to play this card."
          );
          setGameAlertOpen(true);
          return;
        } else {
          cardCodes.push(playerHand[otherCardIndex].code);
          // cardIncidesToRemove.push(otherCardIndex);
        }
        sendMessageCardPlayed(cardCodes);
      } else {
        sendMessageCardPlayed(cardCodes);
      }

      // const newPlayerHand = playerHand.filter((_, index) => !cardIncidesToRemove.includes(index));
      // setPlayerHand(newPlayerHand);
    }
  };

  const sendMessageCardPlayed = (cardCodes, targetUsername?) => {
    sendMessage(`/app/move/cards/${gameId}/${userId}`, {
      gameId: gameId,
      userId: userId,
      cardIds: cardCodes,
      targetUsername: targetUsername,
    });
    // setTargetUsername(null);
  };

  // useEffect(() => {
  //   if (targetUsername) {
  //     sendMessageCardPlayed([cardCodeFavor]);
  //   }
  // }, [targetUsername]);

  // useEffect(() => {
  //   if (placementIndex) {
  //     sendMessage(`/app/handleExplosion/${gameId}/${userId}/${placementIndex}`, {});
  //   }
  // }, [placementIndex]);

  useEffect(() => {
    console.log("Player Hand updated: " + JSON.stringify(playerHand, null, 2));
  }, [playerHand]);

  useEffect(() => {
    let stompClient = null;
    connectWebSocket().then((client) => {
      stompClient = client;
      subscriptionRef.current = subscribeToChannel(
        `/game/${gameId}/${userId}`,
        handleIncomingMessageUser
      );
      subscriptionRef.current = subscribeToChannel(
        `/game/${gameId}`,
        handleIncomingMessageGame
      );
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
      {explode && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          backgroundColor: 'rgba(0, 0, 0, 0.5)' 
        }}>
          <img src={explosionGif} alt="Explosion" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      )}
      <audio ref={explosionAudioRef} src={explosionSound} />
      {playerTurn && <FilledAlert />}
      <GameAlert
        open={gameAlertOpen}
        handleClose={gameAlertHandleClose}
        title={gameAlertTitle}
        description={gameAlertDescription}
      />
      <GameAlertWithInput
        open={gameAlertWithInputOpen}
        handleClose={gameAlertWithInputHandleClose}
        title={gameAlertWithInputTitle}
        description={gameAlertWithInputDescription}
        playerNames={names}
        onSubmit={(value) => {
          console.log("Submitted value: " + value);
          if (gameAlertWithInputTitle === "Favor") {
            // setTargetUsername(value);
            sendMessageCardPlayed([cardCodeFavor], value);
          } else if (gameAlertWithInputTitle === "Explosion Time") {
            sendMessage(
              `/app/handleExplosion/${gameId}/${userId}/${value}`,
              {}
            );
          }
          gameAlertHandleClose();
        }}
      />
      <Grid
        item
        xs={12}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <EnemyPlayers piles={piles} playerNames={names} />
      </Grid>
      <Grid item xs={6} style={{ display: "flex", justifyContent: "center" }}>
        {/* Closed Deck */}
        <div className="card-stack">
          {closedDeck.map((card) => (
            <div key={card.id} className="card">
              <CardComponent
                text=""
                description=""
                image={card_back}
                onClick={() =>
                  drawCard(
                    playerTurn,
                    sendMessage,
                    setGameAlertOpen,
                    setGameAlertTitle,
                    setGameAlertDescription
                  )
                }
              />
            </div>
          ))}
        </div>
      </Grid>
      <Grid item xs={6} style={{ display: "flex", justifyContent: "center" }}>
        {/* Open Deck */}
        <div className="card-stack">
          <Stack spacing={1} direction="column">
            {openDeck.slice(-1).map((card, index) => (
              <div key={card.id} className="card">
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
        <Box
          sx={{
            overflowX: "auto",
            whiteSpace: "nowrap",
            margin: "10px",
          }}
        >
          <Stack spacing={1} direction="row" margin={"10px"}>
            {playerHand.map((card, index) => (
              <CardComponent
                key={`${card.internalCode}-${index}`}
                text={card.text}
                description={card.description}
                image={card.imageUrl}
                onClick={() =>
                  playCard(card.internalCode, card.name, card.code)
                }
              />
            ))}
          </Stack>
        </Box>
      </Grid>
    </Grid>
  );
};

export default Game;
