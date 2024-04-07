import * as React from "react";
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import AppBar from "@mui/material/AppBar";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import GamesIcon from "@mui/icons-material/Games";
import VideogameAssetIcon from "@mui/icons-material/VideogameAsset";
import GroupIcon from "@mui/icons-material/Group";
import EmojiPeopleIcon from "@mui/icons-material/EmojiPeople";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Divider } from "@mui/material";

const drawerWidth = 240;

interface ClippedDrawerProps {
  selectedView: string;
  setSelectedView: (view: string) => void;
}

// add views to dashboard
export default function ClippedDrawer() {
  const navigate = useNavigate();
  const location = useLocation();
  const [openNestedList, setOpenNestedList] = React.useState(null);

  const isActive = (path) => location.pathname.includes(path);

  const handleNestedListToggle = (category) => {
    if (openNestedList === category) {
      setOpenNestedList(null); // If already open, close it
    } else {
      setOpenNestedList(category); // Open the clicked category's list
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
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
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: "auto", display: 'flex', flexDirection: 'column', flex: 1 }}>
          <List sx={{ flexGrow: 1 }}>
            <ListItem disablePadding>
              <ListItemButton onClick={() => handleNestedListToggle('Game')}>
                <ListItemIcon>
                  <VideogameAssetIcon />
                </ListItemIcon>
                <ListItemText primary="Game" />
              </ListItemButton>
            </ListItem>
            {openNestedList === 'Game' && (
              <List disablePadding>
                <ListItem sx={{ paddingLeft: 4 }}>
                  <ListItemButton
                    selected={isActive('/dashboard/join-game')}
                    onClick={() => navigate('/dashboard/join-game')}
                  >
                    <ListItemIcon>
                      <GroupIcon />
                    </ListItemIcon>
                    <ListItemText primary="Join Game" />
                  </ListItemButton>
                </ListItem>
                <ListItem sx={{ paddingLeft: 4 }}>
                  <ListItemButton
                    selected={isActive('/dashboard/create-game')}
                    onClick={() => navigate('/dashboard/create-game')}
                  >
                    <ListItemIcon>
                      <GamesIcon />
                    </ListItemIcon>
                    <ListItemText primary="Create Game" />
                  </ListItemButton>
                </ListItem>
                {/* Add more sub-items here */}
              </List>
            )}
            <ListItem disablePadding>
              <ListItemButton onClick={() => handleNestedListToggle('SocialTemp')}>
                <ListItemIcon>
                  <EmojiPeopleIcon />
                </ListItemIcon>
                <ListItemText primary="Social" />
              </ListItemButton>
            </ListItem>
            {openNestedList === 'SocialTemp' && (
              <List disablePadding>
                <ListItem sx={{ paddingLeft: 4 }}>
                  <ListItemButton
                    selected={isActive('/dashboard/all-players')}
                    onClick={() => navigate('/dashboard/all-players')}
                  >
                    <ListItemIcon>
                      <LeaderboardIcon />
                    </ListItemIcon>
                    <ListItemText primary="All Players" />
                  </ListItemButton>
                </ListItem>
                <ListItem sx={{ paddingLeft: 4 }}>
                  <ListItemButton
                    selected={isActive('/dashboard/friends')}
                    onClick={() => navigate("/dashboard/friends")}
                  >
                    <ListItemIcon>
                      <PersonAddIcon />
                    </ListItemIcon>
                    <ListItemText primary="Friends" />
                  </ListItemButton>
                </ListItem>
                {/* Add more sub-items here */}
              </List>
            )}
          </List>
          <Box sx={{ marginTop: "auto" }}>
            <Divider />
            <ListItemButton onClick={() => navigate("/dashboard/users/" + localStorage.getItem("id"))}>
              <ListItemIcon>
                <AccountCircleIcon />
              </ListItemIcon>
              <ListItemText primary="User Profile" />
            </ListItemButton>
          </Box>
        </Box>
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}
