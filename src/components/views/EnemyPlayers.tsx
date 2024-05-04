import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import Badge from '@mui/material/Badge';
import placeholder from "components/game/profile_image_placeholder.webp";

interface EnemyPlayersProps {
    piles: { [key: string]: number };
}

export default function EnemyPlayers({ piles }: EnemyPlayersProps) {
    const userId = localStorage.getItem("id");
    console.log("Piles: ", piles);
    const pile = Object.entries(piles)
        .filter(([key]) => key !== "dealer" && key !== "play" && key !== userId)
        .map(([_, value]) => value);

    return (
        <Stack direction="row" spacing={2}>
            {pile.map((count, i) => (
                <Badge badgeContent={count} color="error" key={i}>
                    <Avatar alt={`EnemyCards${i + 1}`} src={placeholder} />
                </Badge>
            ))}
        </Stack>
    );
}