import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import CardComponent from "components/ui/CardComponent";
import {
  Grid,
  Stack,
  Dialog,
  IconButton,
  Box,
  DialogContent,
  Button,
  DialogActions,
} from "@mui/material";
import { Chat as ChatIcon, Logout as LogoutIcon, Help as HelpIcon } from "@mui/icons-material";
import { cardTypes } from "components/models/cards";
import {
  connectWebSocket,
  disconnectWebSocket,
  subscribeToChannel,
  sendMessage,
} from "helpers/WebsocketConnection";
import { drawCard } from "components/game/drawCard";
import GameAlert from "components/ui/GameAlert";
import GameAlertWithInput from "components/ui/GameAlertWithInput";
import EnemyPlayers from "components/views/EnemyPlayers";
import FilledAlert from "./Alert";
import Chat from "./Chat";
import TutorialPopup from "./TutorialPopup"; 
import card_back from "components/game/cards/card_back.png";
import game_background from "components/game/game_background.png";
import explosionGif from "components/game/explosionGif.gif";
import explosionSound from "components/game/explosionSound.wav";
import winnerGif from "components/game/confetti.gif";
import winnerSound from "components/game/cheer.wav";
import loserGif from "components/game/rain.gif";
import loserSound from "components/game/wahwahwah.wav";
import Leaderboard from "components/ui/Leaderboard";
import "../../styles/Style.css";

const Game = () => {
  const gameId = localStorage.getItem("gameId");
  const userId = localStorage.getItem("id");
  const username = localStorage.getItem("username");

  const stompClientRef = useRef(null);
  const [isWebSocketConnected, setIsWebSocketConnected] = useState(false);

  const [closedDeck, setClosedDeck] = useState(cardTypes);
  const [openDeck, setOpenDeck] = useState([]);
  const [playerHand, setPlayerHand] = useState([]);
  const [playerTurn, setPlayerTurn] = useState(false);
  const [gameAlertOpen, setGameAlertOpen] = useState(false);
  const [gameAlertTitle, setGameAlertTitle] = useState("");
  const [gameAlertDescription, setGameAlertDescription] = useState("");
  const [gameAlertCardDetails, setGameAlertCardDetails] = useState([]);
  const [postAlertAction, setPostAlertAction] = useState(null);
  const [gameAlertWithInputOpen, setGameAlertWithInputOpen] = useState(false);
  const [gameAlertWithInputTitle, setGameAlertWithInputTitle] = useState("");
  const [gameAlertWithInputDescription, setGameAlertWithInputDescription] =
    useState("");
  const [piles, setPiles] = useState([]);
  const [names, setNames] = useState([]);
  const [players, setPlayers] = useState({});
  const [cardCodeFavor, setCardCodeFavor] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  const [explode, setExplode] = useState(false);
  const [winner, setWinner] = useState(null);
  const [loser, setLoser] = useState(null);
  const [explosionCompleted, setExplosionCompleted] = useState(false);
  const explosionAudioRef = useRef(new Audio(explosionSound));
  const winnerAudioRef = useRef(new Audio(winnerSound));
  const loserAudioRef = useRef(new Audio(loserSound));

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [connected, setConnected] = useState(false);
  const [userColors, setUserColors] = useState({});

  const [isTutorialOpen, setIsTutorialOpen] = useState(false);
  const handleOpenTutorial = () => {setIsTutorialOpen(true);};
  const handleCloseTutorial = () => {setIsTutorialOpen(false);};

  const navigate = useNavigate();

  const subscriptionRef = useRef(null);

  const handleIncomingMessageUser = useCallback((message) => {
    const gameState = JSON.parse(message.body);
    if (gameState.type === "cards") {
      setPlayerHand((prevHand) => [
        ...prevHand,
        ...enhanceCardDetails(gameState.cards),
      ]);
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
    if (gameState.type === "explosion") {
      handleExplosion(gameState.terminatingUser);
    } else if (gameState.type === "gameState") {
      if (gameState.topCardInternalCode) {
        handleOpenDeck(gameState.topCardInternalCode);
      }
      if (gameState.piles) {
        setPiles(gameState.piles);
      }
      if (gameState.playerNames) {
        setNames(gameState.playerNames);
      }
      if (gameState.players) {
        setPlayers(gameState.players);
      }
    } else if (gameState.type === "loss" && gameState.userName === username) {
      setLoser(true);
    } else if (gameState.type === "endGame") {
      if (gameState.winningUser === username) {
        setWinner(true);
      } else {
        setLoser(true);
      }
      // obtain leaderboard
      setLeaderboard(gameState.leaderboard);

      gameAlertHandleOpen(
        "Game Over!",
        "Game Over! The winner is: " + gameState.winningUser
      );
      setPostAlertAction(() => () => setShowLeaderboard(true));
    } else if (
      gameState.type === "cardPlayed" &&
      gameState.userName === username
    ) {
      handleCardPlayed(gameState.externalCode);
    }
  }, []);

  const handleCardPlayed = (externalCode) => {
    setPlayerHand((prevHand) => {
      const index = prevHand.findIndex((card) => card.code === externalCode);
      if (index !== -1) {
        const newPlayerHand = [...prevHand];
        newPlayerHand.splice(index, 1);
        return newPlayerHand;
      }
      return prevHand;
    });
  };

  const peekIntoDeck = (cards) => {
    const enhancedCards = cards.map((card) => {
      const cardType = cardTypes.find(
        (type) => type.name === card.internalCode
      );
      return {
        name: cardType.name,
        imageUrl: cardType.imageUrl,
      };
    });

    gameAlertHandleOpen(
      "See the Future",
      "The next 3 cards in the deck are:",
      enhancedCards.reverse()
    );
  };

  const cardStolen = (cards) => {
    const stolenCard = cards[0].internalCode;
    setPlayerHand((prevHand) =>
      prevHand.filter((card) => card.name !== stolenCard)
    );
  };

  const handleExplosion = (userName: string) => {
    setExplode(true);
    setTimeout(() => {
      setExplode(false);
      if (userName !== username) {
        gameAlertHandleOpen(
          "EXPLOSION!!",
          `Player ${userName} drew an Exploding Chicken! Do they have a Defuse card?`
        );
      }
    }, 3000);
  };

  useEffect(() => {
    if (explode) {
      explosionAudioRef.current.play();
      const timer = setTimeout(() => {
        if (explosionAudioRef.current) {
          explosionAudioRef.current.pause();
          explosionAudioRef.current.currentTime = 0;
        }
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [explode]);

  useEffect(() => {
    if (winner) {
      const timer = setTimeout(() => {
        setExplosionCompleted(true);
        console.log("Playing winner sound");
        winnerAudioRef.current.play();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [winner]);

  useEffect(() => {
    if (loser) {
      const timer = setTimeout(() => {
        setExplosionCompleted(true);
        console.log("Playing loser sound");
        loserAudioRef.current.play();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [loser]);

  const handleDefuseCard = () => {
    setPlayerHand((prevHand) => {
      const indexOfFirstDefuse = prevHand.findIndex(
        (card) => card.name === "defuse"
      );
      if (indexOfFirstDefuse !== -1) {
        const newPlayerHand = [...prevHand];
        newPlayerHand.splice(indexOfFirstDefuse, 1);
        return newPlayerHand;
      }
      return prevHand;
    });
  };

  const handlePlacementRequest = () => {
    setTimeout(() => {
      gameAlertWithInputHandleOpen(
        "Explosion Time",
        "Choose where on the dealer deck you want to place the explosion."
      );
    }, 3000);
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

  const gameAlertHandleOpen = (
    title: string,
    description: string,
    cardDetails?: Array<string>
  ) => {
    setGameAlertTitle(title);
    setGameAlertDescription(description);
    setGameAlertCardDetails(cardDetails);
    setGameAlertOpen(true);
  };

  const gameAlertHandleClose = () => {
    setGameAlertOpen(false);
    setGameAlertCardDetails([]);
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

    if (!playerTurn) {
      setGameAlertTitle("It's not your turn!");
      setGameAlertDescription(
        "You can only play a card when it's your turn. You can see that it is your turn by the alert at the top of the screen."
      );
      setGameAlertOpen(true);
      return;
    }

    const cardIndex = playerHand.findIndex((card) => card.code === cardCode);
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
        }
        sendMessageCardPlayed(cardCodes);
      } else {
        sendMessageCardPlayed(cardCodes);
      }
    }
  };

  const sendMessageCardPlayed = (cardCodes, targetUsername?) => {
    sendMessage(`/app/move/cards/${gameId}/${userId}`, {
      gameId: gameId,
      userId: userId,
      cardIds: cardCodes,
      targetUsername: targetUsername,
    });
  };

  useEffect(() => {
    if (isWebSocketConnected) {
      console.log("trying to send message for relaod");
      sendMessage(`/app/reload/${gameId}/${userId}`, {});
    }
  }, [stompClientRef.current]);

  useEffect(() => {
    const connectAndSubscribe = async () => {
      try {
        const client = await connectWebSocket();
        stompClientRef.current = client;

        if (stompClientRef.current) {
          console.log("WebSocket connected.");
          subscribeToChannel(
            `/game/${gameId}/${userId}`,
            handleIncomingMessageUser
          );
          subscribeToChannel(`/game/${gameId}`, handleIncomingMessageGame);
          setIsWebSocketConnected(true);
        } else {
          console.error("WebSocket client is not defined.");
        }
      } catch (error) {
        console.error("Error connecting to WebSocket:", error);
      }
    };

    connectAndSubscribe();
  }, []);

  const handleLeave = () => {
    if (stompClientRef.current) {
      sendMessage(`/app/leaving/${gameId}/${userId}`, {});
      disconnectWebSocket();
    }
    localStorage.removeItem("gameId");
    navigate("/dashboard/join-game");
  };

  return (
    <Grid
      container
      spacing={2}
      style={{
        minHeight: "100vh",
        backgroundImage: `url(${game_background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        marginTop: 0,
      }}
    >
      {explode && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
        >
          <img
            src={explosionGif}
            alt="Explosion"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
      )}
      {winner && explosionCompleted && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
        >
          <img
            src={winnerGif}
            alt="Winner"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
      )}
      {loser && explosionCompleted && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
        >
          <img
            src={loserGif}
            alt="Loser"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
      )}
      <audio ref={explosionAudioRef} src={explosionSound} />
      <audio ref={winnerAudioRef} src={winnerSound} />
      <audio ref={loserAudioRef} src={loserSound} />
      {playerTurn && <FilledAlert />}
      <IconButton
        onClick={() => handleLeave()}
        style={{ position: "absolute", top: 0, left: 0 }}
      >
        <LogoutIcon />
      </IconButton>
      <IconButton
        onClick={() => setIsChatOpen(!isChatOpen)}
        style={{ position: "absolute", top: 0, right: 0 }}
      >
        <ChatIcon />
      </IconButton>
      <IconButton
        onClick={handleOpenTutorial}
        style={{ position: "absolute", top: 0, right: 40 }}
      >
        <HelpIcon />
      </IconButton>
      <TutorialPopup open={isTutorialOpen} onClose={handleCloseTutorial} />
      <Dialog
        open={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        PaperProps={{
          style: { minWidth: "600px" },
        }}
      >
        <DialogContent>
          <Chat
            stompClientRef={stompClientRef}
            messages={messages}
            setMessages={setMessages}
            connected={connected}
            setConnected={setConnected}
            userColors={userColors}
            setUserColors={setUserColors}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsChatOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
      <GameAlert
        open={gameAlertOpen}
        handleClose={gameAlertHandleClose}
        title={gameAlertTitle}
        description={gameAlertDescription}
        cardDetails={gameAlertCardDetails}
      />
      <GameAlertWithInput
        open={gameAlertWithInputOpen}
        handleClose={gameAlertWithInputHandleClose}
        title={gameAlertWithInputTitle}
        description={gameAlertWithInputDescription}
        playerNames={names}
        onSubmit={(value) => {
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
        <EnemyPlayers piles={piles} players={players} />
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
      {showLeaderboard && (
        <Leaderboard
          show={showLeaderboard}
          onHide={() => setShowLeaderboard(false)}
          leaderboard={leaderboard}
        />
      )}
    </Grid>
  );
};

export default Game;
