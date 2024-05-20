import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import Badge from "@mui/material/Badge";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import placeholder from "components/game/profile_image_placeholder.webp";

interface EnemyPlayersProps {
  piles: { [key: string]: number };
  players: { [key: number]: string };
}

export default function EnemyPlayers({
  piles,
  players,
}: EnemyPlayersProps) {
  const userId = localStorage.getItem("id");
  const username = localStorage.getItem("username");
  delete players[userId];

  return (
    <Stack direction="row" spacing={2} marginBottom={"100px"}>
      {Object.entries(players).map(([playerId, playerData], i) => {
        const pileCount = piles[playerId]
        const { name: playerName, avatar: playerAvatar } = playerData;
        return (
          <Stack key={i} alignItems="center">
            <Badge badgeContent={pileCount} color="error">
              <Avatar alt={`EnemyCards${i + 1}`} src={playerAvatar || placeholder} />
            </Badge>
            <Box bgcolor="white" color="black" borderRadius="5px" marginTop="5px">
              <Typography variant="body1" margin="5px">
                {playerName}
              </Typography>
            </Box>
          </Stack>
        );
      })}
    </Stack>
  );
}
