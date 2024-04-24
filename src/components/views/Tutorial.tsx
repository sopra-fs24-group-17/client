import React from "react";
import { Typography, Container, Grid, Box } from "@mui/material";

const Tutorial = () => {
    return (
        <Container maxWidth={false} sx={{ mt: 2 }}>
            <Grid container direction="column" spacing={2}>
                <Typography variant="h4" component="h1" sx={{ mb: 2 }}>
                    Tutorial
                </Typography>
                <Typography variant="h5" sx={{ mt: 3, mb: 2 }}>General Overview</Typography>
                <Typography variant="body1">
                    This is a card game of risk, strategy, and luck, designed for 2-5 players. 
                    Each player draws cards until someone draws an explosion card, which knocks them out of the game unless they have a defuse card. 
                    Before drawing a card, players can choose to play any number of their cards to manipulate the deck or affect other players. Drawing a card ends a player&#39;s turn.
                    The goal is to win the game by being the last player standing.
                </Typography>

                <Typography variant="h5" sx={{ mt: 3, mb: 2 }}>Setup</Typography>
                <Typography variant="body1">
                    Five random cards (out of all cards except explosion and defuse cards) as well as one defuse card are dealt to each player.
                    The remaining defuse and explosion cards are inserted back into the deck such that there&#39;s one fewer explosion card than the number of players.
                    The deck is then shuffled and placed face-down in the center.
                </Typography>

                <Typography variant="h5" sx={{ mt: 3, mb: 2 }}>Cards</Typography>
                <Grid container spacing={2}>
                    {[
                        { src: "/cards/attack-1.png", alt: "attack-1", text: "Playing this card forces the next player to take two turns in a row. It also instantly ends your turn without having to draw a card. Attacks can be avoided by also playing an attack card, in which case the attacks (remaining turns) are stacked." },
                        { src: "/cards/chicken.png", alt: "explosion", text: "If you draw this card, you are out! The only way to counteract this is by playing a defuse card (see below)." },
                        { src: "/cards/defuse-1.png", alt: "defuse-1", text: "Play a defuse card to stop yourself from exploding upon drawing an explosion card. These cards are extremely valuable. After playing a defuse card, the explosion card must be placed back anywhere in the deck. Playing this card instantly ends a player's turn." },
                        { src: "/cards/nope.png", alt: "nope", text: "Playing a nope card will stop any action (exceptions are explosion cards and defuse cards, which cannot be noped)." },
                        { src: "/cards/seethefuture-1.png", alt: "seethefuture-1", text: "Play this card to peek at the top two cards from the deck." },
                        { src: "/cards/shuffle-1.png", alt: "shuffle-1", text: "The shuffle card simply shuffles the deck once." },
                        { src: "/cards/skip-1.png", alt: "skip-1", text: "This card instantly ends your turn without having to draw a card. Other than that, it has no additional functionality." },
                        { src: "/cards/favor-1.png", alt: "favor-1", text: "Force a player of your choice to give you a random card." }
                    ].map((card, index) => (
                        <Grid item xs={6} key={card.alt}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <img src={card.src} alt={card.alt} style={{ width: '100%', height: 'auto', maxWidth: '100px' }} />
                                <Typography variant="body1" sx={{ flexGrow: 1 }}>
                                    {card.text}
                                </Typography>
                            </Box>
                        </Grid>
                    ))}
                    <Grid item xs={12}>
                        <Typography variant="body1" sx={{ mt: 2, mb: 2 }}>
                            The following &#34;chicken cards&#34; are similar to the favor card. Play two chicken cards simultaneously to steal a random card from a player of your choice:
                        </Typography>
                    </Grid>
                    {[
                        { src: "/cards/randchick-1.png", alt: "randchick-1" },
                        { src: "/cards/randchick-2.png", alt: "randchick-2" },
                        { src: "/cards/randchick-3.png", alt: "randchick-3" },
                        { src: "/cards/randchick-4.png", alt: "randchick-4" }
                    ].map((card, index) => (
                        <Grid item xs={6} sm={3} md={3} lg={3} key={card.alt}>
                            <img src={card.src} alt={card.alt} style={{ width: '100%', maxWidth: '100px', height: 'auto', display: 'block', marginLeft: 'auto', marginRight: 'auto' }} />
                        </Grid>
                    ))}
                </Grid>
            </Grid>
        </Container>
    );
};

export default Tutorial;