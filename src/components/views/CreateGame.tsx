import React,{ useState } from 'react';
import { api, handleError } from 'helpers/api';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import InputAdornment from '@mui/material/InputAdornment';
import InfoIcon from '@mui/icons-material/Info'; 
import { Typography } from '@mui/material';

const CreateGame: React.FC = () => {
    const navigate = useNavigate();
    const [isPrivate, setIsPrivate] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    // const [gameCode, setGameCode] = useState('');
    const [numberOfPlayers, setNumberOfPlayers] = useState('2');
    const [gameMode, setGameMode] = useState('option1');
    const gameCode = '0934'
    const handlePrivateToggle = (event) => {
        setIsPrivate(event.target.checked);
        // Logic to handle when switch is toggled
        // Set game code and open dialog
      };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };
    const handleCreateGame = ()=>{}

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start', // Aligns items to the start of the cross-axis (left side)
            width: '50%', // Set the width of the box to half of its parent
            marginRight: 'auto', // Pushes the box to the left side
            maxWidth: '800px', // Optional: Ensure the box doesn't get too wide on large screens
            minHeight: '100vh', // Ensures the box takes up at least the full height of the viewport
            // Adjust the padding or margin here as needed to align with your design
          }}>
          <Typography
            variant="h6" // You can choose the variant that fits your design best
            sx={{
              fontWeight: '900', // Heaviest common weight
              color: 'black', // Very dark text
              alignSelf: 'flex-start',
              marginLeft: '1rem',
              fontSize: '1.25rem' // Or any other size that suits your needs
            }}
          >
            Play a new game
          </Typography>
          <FormGroup sx={{ mb: 2 }}>
            <FormControlLabel
              control={<Switch checked={isPrivate} onChange={handlePrivateToggle} />}
              label="Private Game"
              sx={{ alignSelf: 'flex-start', ml: '1rem' }}
            />
          </FormGroup >
          {isPrivate && (
              <TextField
              fullWidth
              variant="outlined"
              value={`${gameCode}\n${'Give this code to your friends to allow them to join your private game'}`} // Using a template string to combine game code and additional text
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
                style: { lineHeight: 'normal', whiteSpace: 'pre-line' }
              }}
              sx={{ mb: 2 }}
            />
          )}
        <FormControl fullWidth sx={{ mb: 2 }}>
        <FormLabel htmlFor="number-of-players" sx={{fontWeight: '900', color: 'black' }}>
          Minimum number of players<span style={{ color: 'red' }}>*</span>
        </FormLabel>
        <TextField
          select
          id="number-of-players"
          value={numberOfPlayers}
          onChange={(e) => setNumberOfPlayers(e.target.value)}
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
          <FormLabel component="legend" sx={{ fontWeight: '900', color: 'black' }}>
            Game Mode <span style={{ color: 'red' }}>*</span>
          </FormLabel>
            <RadioGroup
              row
              aria-label="game mode"
              name="gameMode"
              value={gameMode}
              onChange={(e) => setGameMode(e.target.value)}
            >
              <FormControlLabel value="option1" control={<Radio />} label="Option 1" />
              <FormControlLabel value="option2" control={<Radio />} label="Option 2" />
              <FormControlLabel value="option3" control={<Radio />} label="Option 3" />
              <FormControlLabel value="option4" control={<Radio />} label="Option 4" />
            </RadioGroup>
          </FormControl>
    
          <Button variant="contained" onClick={handleCreateGame} sx={{ mb: 2 }}>
            Create Game
          </Button>
    
          <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
            <DialogTitle>{"Activate Private Game"}</DialogTitle>
            <DialogContent>
              <DialogContentText>
                {gameCode ? `Your game code is ${gameCode}` : 'Retrieving game code...'}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenDialog(false)} color="primary">
                Close
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      );
    };
    
    export default CreateGame;