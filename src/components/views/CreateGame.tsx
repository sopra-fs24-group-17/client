import React, { useState, useEffect } from "react";
import { api, handleError } from "helpers/api";
import { useNavigate,useLocation } from "react-router-dom";
import Button from "@mui/material/Button";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import InputAdornment from "@mui/material/InputAdornment";
import InfoIcon from "@mui/icons-material/Info";
import { Typography } from "@mui/material";
import PopupNotification from "components/ui/TutorialPopup";
 
const CreateGame: React.FC = () => {
  const navigate = useNavigate();
  const [isPrivate, setIsPrivate] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [totalPlayers, setTotalPlayers] = useState('2');
  const [gameCode, setGameCode] = useState("");
  const [gameMode, setGameMode] = useState('');//option 1 or option2 .....
  const [mode, setMode] = useState('PUBLIC') //public or private
  const [gameCreated, setGameCreated] = useState(false);
  const [showTutorialPopup, setShowTutorialPopup] = useState(false);
  const [copySuccess, setCopySuccess] = useState('');

  

  useEffect(() => {
    console.log("fetching user")
    const prevpath = localStorage.getItem('previousPath');
    const gameid = localStorage.getItem('gameId');
    if (prevpath === "dashboard/tutorial") {
      const storedGameSetup = localStorage.getItem('gameSetup');
      if (storedGameSetup) {
        const { mode, maxPlayers, selectedMode } = JSON.parse(storedGameSetup);
        setIsPrivate(mode === 'PRIVATE');
        setTotalPlayers(maxPlayers);
        setGameMode(selectedMode);
        setGameCode(gameid)
        setGameCreated(true);
        localStorage.removeItem('previousPath');

      }
    }
    const fetchUser = async () => {
      const response = await api.get(`/dashboard/${localStorage.getItem('id')}/profile`, {
        headers: { token: localStorage.getItem("token") },
      });
      console.log(response.data)
      if (response.data.tutorialflag === "TRUE") {
        setShowTutorialPopup(true);
      } else {
        setShowTutorialPopup(false);
      }
    };
    fetchUser();
  }, []);



  const handlePrivateToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsPrivate(event.target.checked);

  };

  const handleNumberOfPlayersChange = (event) => {
    setTotalPlayers(event.target.value); 
};

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(gameCode);
      setCopySuccess('');
    } catch (error) {
      setCopySuccess('Failed to copy!');
      console.error("Could not copy to clipboard: ", error);
    }
  };



  const createGame = async () => {

    const mode = isPrivate ? "PRIVATE" : "PUBLIC";
    const requestBody = JSON.stringify({
      mode: mode,
      maxPlayers: parseInt(totalPlayers, 10),
    });

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await api.post(`/dashboard/games/new`, requestBody, {
        headers: {
          'token': token
        },
      });

      const newGameCode = response.data.gameId;
      setGameCode(newGameCode);
      localStorage.setItem("gameId", newGameCode);
      localStorage.setItem('gameSetup', JSON.stringify({ mode, maxPlayers: totalPlayers }));
      setGameCreated(true);
      // localStorage.setItem('gameSetup', JSON.stringify({ mode, maxPlayers: totalPlayers, selectedMode: gameMode }));
      

    } catch (error) {
      handleError(error);
      console.error("Error creating new game:", error);
    }
    };

    const startGame = () => {
      localStorage.removeItem('gameSetup');
      localStorage.setItem("createflag", "true");
      navigate(`/lobby/${gameCode}`)
    };
  
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start", 
        width: "50%", 
        marginRight: "auto", 
        maxWidth: "800px", 
        minHeight: "100vh", 
        
      }}
    >
      <Typography
        variant="h6" 
        sx={{
          fontWeight: "900", 
          color: "black", 
          alignSelf: "flex-start",
          marginLeft: "1rem",
          fontSize: "1.25rem", 
        }}
      >
        Play a new game
      </Typography>
      
      <FormGroup sx={{ mb: 2 }}>
        <FormControlLabel
          control={
            <Switch checked={isPrivate} disabled={gameCreated} onChange={handlePrivateToggle} />
          }
          label="Private Game"
          sx={{ alignSelf: "flex-start", ml: "1rem" }}
        />
      </FormGroup>

      {isPrivate && (
        <>
          <TextField
            fullWidth
            variant="outlined"
            // disabled={gameCreated}
            value={`${gameCode}\n${"Give this code to your friends to allow them to join your private game"}`}
            multiline
            rows={2}
            InputProps={{
              readOnly: true,
              startAdornment: (
                <InputAdornment position="start">
                  <InfoIcon />
                </InputAdornment>
              ),
              style: { lineHeight: "normal", whiteSpace: "pre-line" },
            }}
            sx={{ mb: 2 }}
          />
          <Button onClick={copyToClipboard} variant="contained" sx={{ mb: 2 }}>
            Copy Game Code
          </Button>
          {copySuccess && <Typography variant="body2" color="primary">{copySuccess}</Typography>}
        </>
      )}
      <FormControl fullWidth sx={{ mb: 2 }}>
        <FormLabel
          htmlFor="number-of-players"
          sx={{ fontWeight: "900", color: "black" }}
        >
          Number of players<span style={{ color: "red" }}>*</span>
        </FormLabel>
        <TextField
          select
          id="number-of-players"
          value={totalPlayers}
          disabled={gameCreated}
          onChange={handleNumberOfPlayersChange}
          variant="outlined"
          sx={{ mb: 2 }}
          helperText="This is a description"
        >
          {[2, 3, 4, 5].map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
      </FormControl>

      <FormControl component="fieldset" fullWidth sx={{ mb: 2 }}>
        <FormLabel
          component="legend"
          sx={{ fontWeight: "900", color: "black" }}
        >
          Game Mode <span style={{ color: "red" }}>*</span>
        </FormLabel>
        <RadioGroup
          row
          aria-label="game mode"
          name="gameMode"
          value={gameMode}
          onChange={(e) => setGameMode(e.target.value)}
        >
          <FormControlLabel
            value="option1"
            control={<Radio />}
            label="Option 1"
          />
          <FormControlLabel
            value="option2"
            control={<Radio />}
            label="Option 2"
          />
          <FormControlLabel
            value="option3"
            control={<Radio />}
            label="Option 3"
          />
          <FormControlLabel
            value="option4"
            control={<Radio />}
            label="Option 4"
          />
        </RadioGroup>
      </FormControl>

      <Button variant="contained" onClick={createGame} sx={{ mb: 2 }}>
        Setup Game
      </Button>
      <Button variant="contained" onClick={startGame} disabled={!gameCreated} sx={{ mb: 2 }}>
        Start Lobby
      </Button>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>{"Activate Private Game"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {gameCode
              ? `Your game code is ${gameCode}`
              : "Retrieving game code..."}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
      
      <PopupNotification
        open={showTutorialPopup}
        message="It looks like you have a tutorial available. Would you like to start the tutorial now?"
        onClose={() => setShowTutorialPopup(false)}
      />

    </Box>
  );
};

export default CreateGame;
