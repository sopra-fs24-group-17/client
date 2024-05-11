import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import Badge from '@mui/material/Badge';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import placeholder from "components/game/profile_image_placeholder.webp";

interface EnemyPlayersProps {
    piles: { [key: string]: number };
    playerNames: string[];
}

export default function EnemyPlayers({ piles, playerNames }: EnemyPlayersProps) {
    const userId = localStorage.getItem("id");
    const username = localStorage.getItem("username");
    const pile = Object.entries(piles)
        .filter(([key]) => key !== "dealer" && key !== "play" && key !== userId)
        .map(([_, value]) => value);
    const names = playerNames.filter((name) => name !== username);


    return (
        <Stack direction="row" spacing={2} marginBottom={"100px"}>
            {pile.map((count, i) => (
                <Stack key={i} alignItems="center">
                    <Badge badgeContent={count} color="error">
                        <Avatar alt={`EnemyCards${i + 1}`} src={placeholder} />
                    </Badge>
                    <Box bgcolor="white" color="black" borderRadius="5px" marginTop="5px">
                        <Typography variant="body1" margin="5px">{names[i]}</Typography>
                    </Box>
                </Stack>
            ))}
        </Stack>
    );
}