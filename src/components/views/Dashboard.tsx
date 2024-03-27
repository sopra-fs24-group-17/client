import * as React from 'react';
import Game from 'components/views/Game';
import SocialTemp from 'components/views/SocialTemp';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import AppBar from '@mui/material/AppBar';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import GamesIcon from '@mui/icons-material/Games';
import VideogameAssetIcon from '@mui/icons-material/VideogameAsset';
import GroupIcon from '@mui/icons-material/Group';
import EmojiPeopleIcon from '@mui/icons-material/EmojiPeople';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

const drawerWidth = 240;

interface ClippedDrawerProps {
    selectedView: string;
    setSelectedView: (view: string) => void;
}

// add views to dashboard
export default function ClippedDrawer() {
    const [selectedView, setSelectedView] = React.useState('Game');


    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <Toolbar>
                    <Typography variant="h6" noWrap component="div">
                        Group 17
                    </Typography>
                </Toolbar>
            </AppBar>
            <Drawer
                variant="permanent"
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
                }}
            >
                <Toolbar />
                <Box sx={{ overflow: 'auto' }}>
                    <List>
                        {['Game', 'SocialTemp'].map((text, index) => (
                            <React.Fragment key={text}>
                                <ListItem disablePadding>
                                    <ListItemButton onClick={() => setSelectedView(text)} selected={selectedView === text}>
                                        <ListItemIcon>
                                            {text === 'Game' ? <VideogameAssetIcon /> : <EmojiPeopleIcon />}
                                        </ListItemIcon>
                                        <ListItemText primary={text} />
                                    </ListItemButton>
                                </ListItem>
                                {selectedView === 'Game' && text === 'Game' && (
                                    <List disablePadding>
                                        <ListItem sx={{ paddingLeft: 4 }}>
                                            <ListItemButton onClick={() => setSelectedView('Game')}>
                                                <ListItemIcon>
                                                    <GroupIcon />
                                                </ListItemIcon>
                                                <ListItemText primary="Join Game" />
                                            </ListItemButton>
                                        </ListItem>
                                        <ListItem sx={{ paddingLeft: 4 }}>
                                            <ListItemButton onClick={() => setSelectedView('Game')}>
                                                <ListItemIcon>
                                                    <GamesIcon />
                                                </ListItemIcon>
                                                <ListItemText primary="Create Game" />
                                            </ListItemButton>
                                        </ListItem>
                                        {/* Add more sub-items here */}
                                    </List>
                                )}
                                {selectedView === 'SocialTemp' && text === 'SocialTemp' && (
                                    <List disablePadding>
                                        <ListItem sx={{ paddingLeft: 4 }}>
                                            <ListItemButton onClick={() => setSelectedView('SocialTemp')}>
                                                <ListItemIcon>
                                                    <LeaderboardIcon />
                                                </ListItemIcon>
                                                <ListItemText primary="All Players" />
                                            </ListItemButton>
                                        </ListItem>
                                        <ListItem sx={{ paddingLeft: 4 }}>
                                            <ListItemButton onClick={() => setSelectedView('SocialTemp')}>
                                                <ListItemIcon>
                                                    <PersonAddIcon />
                                                </ListItemIcon>
                                                <ListItemText primary="Friends" />
                                            </ListItemButton>
                                        </ListItem>
                                        {/* Add more sub-items here */}
                                    </List>
                                )}
                            </React.Fragment>
                        ))}
                    </List>
                </Box>
            </Drawer>
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <Toolbar />
                {selectedView === 'Game' && <Game />}
                {selectedView === 'SocialTemp' && <SocialTemp />}
            </Box>
        </Box>
    );
}
