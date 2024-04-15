import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { api, handleError } from "helpers/api";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Container,
  Grid,
  Paper,
  TableContainer
} from '@mui/material';

// Sample data
// const friends = [
//   {
//     username: 'panos',
//     status: 'Online',
//     avatar: '/path/to/avatar1.jpg',
//     score: 'np.inf',
//     countryFlag: '/path/to/gr-flag.jpg',
//     email: 'ko1.patsias@uzh.ch',
//   },
//   {
//     username: 'liamk',
//     status: 'Online',
//     avatar: '/path/to/avatar2.jpg',
//     score: 'np.inf',
//     countryFlag: '/path/to/uk-flag.jpg',
//     email: 'ko2.kane@uzh.ch',
//   },
//   // ... other friends
// ];

const FriendsList = () => {
    const navigate = useNavigate();
    const { userId } = useParams();
    // State for the search query
    const [searchQuery, setSearchQuery] = useState('');
    const [friends, setFriends] = useState([]);
    // State for the filtered list of friends
    const [filteredFriends, setFilteredFriends] = useState([]);
  
    // Function to handle search query change
    const handleSearchChange = (event) => {
      const query = event.target.value.toLowerCase();
      setSearchQuery(query);
  
      const filtered = friends.filter(friend =>
        friend.username.toLowerCase().includes(query) ||
        friend.status.toLowerCase().includes(query) ||
        friend.email.toLowerCase().includes(query)
      );
      setFilteredFriends(filtered);
    };

      useEffect(() => {
        const fetchFriends = async () => {
          try {
            // Assuming the token is stored in local storage or context
            const token = localStorage.getItem("token") 
            
            const response = await api.get(`dashboard/${userId}/friends`, {
              headers: {
                'token': token // Include the token in request headers
              }
            }); 
            const transformedFriends = response.data.map(friend => ({
              ...friend,
              username: friend.friendName, // Assuming the friendName is the username
              avatar: friend.friendAvatar, // Direct mapping
              status: friend.status // Assuming status is provided by the backend
            }));
            setFriends(transformedFriends);
            setFilteredFriends(transformedFriends); // Initialize with fetched data
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        };
        
        fetchFriends(); // Call the async function
      }, [userId]);


      const handleFriendClick = (userid) => {
        navigate(`../users/${userid}`);
      }


  return (
    <Container maxWidth={false} sx={{ mt: 2 }}>
      <Grid container justifyContent="space-between" alignItems="flex-start">
        <Grid item>
          <Typography variant="h4" component="h1" sx={{ mb: 2 }}>
            Friends
          </Typography>
        </Grid>
        <Grid item>
          <TextField
            id="search"
            label="Search for a player"
            variant="outlined"
            size="small"
            sx={{ mb: 2 }}
            value={searchQuery}
            onChange={handleSearchChange} // Add onChange handler
          />
        </Grid>
      </Grid>
      <Paper sx={{ width: '100%', mb: 2, overflowX: 'auto' }}>
        <TableContainer>
          <Table stickyHeader aria-label="simple table" sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                <TableCell>Username</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Avatar</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredFriends.map((friend) => (
                <TableRow 
                  key={friend.username}
                  hover
                  onClick={() => handleFriendClick(friend.userid)}
                >
                  <TableCell>{friend.username}</TableCell>
                  <TableCell>{friend.status}</TableCell>
                  <TableCell>
                    <Avatar src={friend.avatar} />
                  </TableCell>
                  <TableCell>{friend.score}</TableCell>
                  <TableCell>
                    <Avatar src={friend.countryFlag} variant="square" />
                  </TableCell>
                  <TableCell>{friend.email}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
};

export default FriendsList;
