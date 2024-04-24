import React, { useState, useEffect } from "react";
import { api, handleError } from "helpers/api";
import { useNavigate } from "react-router-dom";
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
  const [showTutorialPopup, setShowTutorialPopup] = useState(false);

  const [gameCreated, setGameCreated] = useState(false);

  const handlePrivateToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsPrivate(event.target.checked);

  };
    
    useEffect(() => {
      console.log("fetching user")

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


    useEffect(() => {

      const fetchPrivateCode = async () => {
        if (isPrivate) {
          // If the game is set to private, we set the game mode to 'PRIVATE'
          setMode('PRIVATE');
          
          const requestBody = JSON.stringify({
            mode: 'PRIVATE',
            maxPlayers: parseInt(totalPlayers, 10)
          });
      
          // Make the API request to create a new game
          try {
            const token = localStorage.getItem('token');
            if (!token) {
              throw new Error('No authentication token found');
            }
    
            const response = await api.post(`/dashboard/games/new`, requestBody, {
              headers: {
                token: token
              }
            });
            
            // Assuming the server sends back the game ID
            const newGameCode = response.data.gameId;
            setGameCode(newGameCode);
            localStorage.setItem("gameId", newGameCode);
          } catch (error) {
            handleError(error);
            console.error('Error creating new game:', error);
          }
        } else {
          // If the game is not set to private, we set the game mode to 'PUBLIC'
          const requestBody = JSON.stringify({
            mode: 'PUBLIC',
            maxPlayers: parseInt(totalPlayers, 10)
          });
      
          // Make the API request to create a new game
          try {
            const token = localStorage.getItem('token');
            if (!token) {
              throw new Error('No authentication token found');
            }
    
            const response = await api.post(`/dashboard/games/new`, requestBody, {
              headers: {
                token: token
              }
            });
            
            // Assuming the server sends back the game ID
            const newGameCode = response.data.gameId;
            setGameCode(newGameCode);
            localStorage.setItem("gameId", newGameCode);
          } catch (error) {
            handleError(error);
            console.error('Error creating new game:', error);
          }
        }
      };
      
      fetchPrivateCode();
    }, [isPrivate]); 

  const handleNumberOfPlayersChange = (event) => {
    setTotalPlayers(event.target.value); // Update state based on user input
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
      setGameCreated(true);
    } catch (error) {
      handleError(error);
      console.error("Error creating new game:", error);
    }
    };

    const startGame = () => {
      // navigate(`/dashboard/lobby/${gameCode}`, { state: { totalPlayersRequired: totalPlayers, from: 'CreateGame' } });
      navigate(`/dashboard/lobby/${gameCode}`)
    };
  
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start", // Aligns items to the start of the cross-axis (left side)
        width: "50%", // Set the width of the box to half of its parent
        marginRight: "auto", // Pushes the box to the left side
        maxWidth: "800px", // Optional: Ensure the box doesn't get too wide on large screens
        minHeight: "100vh", // Ensures the box takes up at least the full height of the viewport
        // Adjust the padding or margin here as needed to align with your design
      }}
    >
      <Typography
        variant="h6" // You can choose the variant that fits your design best
        sx={{
          fontWeight: "900", // Heaviest common weight
          color: "black", // Very dark text
          alignSelf: "flex-start",
          marginLeft: "1rem",
          fontSize: "1.25rem", // Or any other size that suits your needs
        }}
      >
        Play a new game
      </Typography>
      <FormGroup sx={{ mb: 2 }}>
        <FormControlLabel
          control={
            <Switch checked={isPrivate} onChange={handlePrivateToggle} />
          }
          label="Private Game"
          sx={{ alignSelf: "flex-start", ml: "1rem" }}
        />
      </FormGroup>
      {isPrivate && (
        <TextField
          fullWidth
          variant="outlined"
          value={`${gameCode}\n${"Give this code to your friends to allow them to join your private game"}`} // Using a template string to combine game code and additional text
          multiline // Allows the text field to accommodate multiple lines
          rows={2} // Sets the number of lines the text field initially presents
          InputProps={{
            readOnly: true, // Makes the text field read-only if the code shouldn't be edited
            startAdornment: (
              <InputAdornment position="start">
                <InfoIcon /> {/* Replace with the icon you want */}
              </InputAdornment>
            ),
            // Style the input to visually separate the game code from the additional text
            style: { lineHeight: "normal", whiteSpace: "pre-line" },
          }}
          sx={{ mb: 2 }}
        />
      )}
      <FormControl fullWidth sx={{ mb: 2 }}>
        <FormLabel
          htmlFor="number-of-players"
          sx={{ fontWeight: "900", color: "black" }}
        >
          Minimum number of players<span style={{ color: "red" }}>*</span>
        </FormLabel>
        <TextField
          select
          id="number-of-players"
          value={totalPlayers}
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
        Create Game
      </Button>
      <Button variant="contained" onClick={startGame} disabled={!gameCreated} sx={{ mb: 2 }}>
        Start Game
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
