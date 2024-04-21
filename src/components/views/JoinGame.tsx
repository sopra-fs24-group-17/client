import React, { useState, useEffect } from "react";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Button from '@mui/material/Button';
import { useNavigate } from "react-router-dom";
import { api, handleError } from "helpers/api";

const JoinGame = () => {
  const navigate = useNavigate();
  const [games, setGames] = useState([]);
  const [gameId, setGameId] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [totalPlayers, setTotalPlayers] = useState(localStorage.getItem('totalPlayersRequired') || '2');
  // const [totalPlayersRequired, setTotalPlayersRequired] = useState(1);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }
        // Fetch only public games if not looking for a private game
        if (!isPrivate) {
          const response = await api.get('dashboard/games', {
            headers: { token }
          });
          setGames(response.data);
        }
      } catch (error) {
        handleError(error);
      }
    };

    fetchGames();
  }, [isPrivate]);

  const handleJoinGame = async (gameId) => {
    navigate(`/dashboard/lobby/${gameId}`);
  };


  return (
    <Box component="form" sx={{ display: 'flex', flexDirection: 'column', width: '50%', maxWidth: '800px' }}>
      <Typography variant="h5" sx={{ fontWeight: 'bold', ml: '1rem', mb: '1rem' }}>Join a game</Typography>
      
      <FormControl component="fieldset" sx={{ mb: 2 }}>
        <RadioGroup
          row
          aria-label="game type"
          name="gameType"
          value={isPrivate ? "private" : "public"}
          onChange={(e) => setIsPrivate(e.target.value === "private")}
        >
          <FormControlLabel value="public" control={<Radio />} label="Public Game" />
          <FormControlLabel value="private" control={<Radio />} label="Private Game" />
        </RadioGroup>
      </FormControl>
  
      {isPrivate ? (
        <TextField
          fullWidth
          label="Enter Private Game ID"
          variant="outlined"
          value={gameId}
          onChange={e => setGameId(e.target.value)}
          sx={{ mb: 2 }}
        />
      ) : (
        games.map(game => (
          <Button
            key={game.gameId}
            onClick={() => handleJoinGame(game.gameId)}
            sx={{
              mb: 1,
              color: 'white', // Set text color to white
              bgcolor: 'black', // Set background color to black
              '&:hover': {
                bgcolor: 'darkgrey' // Darken the button a bit when hovered for a visual effect
              }
            }}
          >
            Join Game {game.gameId}
          </Button>
        ))
      )}
  
      {isPrivate && (
        <Button variant="contained" onClick={() => handleJoinGame(gameId)} sx={{ mb: 2 }}>
          Join Private Game
        </Button>
      )}
    </Box>
  );
}
export default JoinGame;
