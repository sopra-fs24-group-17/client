import React, { useState } from "react";
import { api, handleError } from "helpers/api";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import CardComponent from "components/ui/CardComponent";
import CardMovement from "components/ui/CardMovement";
import { Grid } from "@mui/material";
import { motion } from "framer-motion";
import { cardTypes } from "components/models/cards";

const Game = () => {
  const [cards, setCards] = useState(cardTypes)

  const [player, setPlayer] = useState({ id: 4, cards: [] });

  const moveToCenter = (id) => {
    setCards(
      cards.map((card) =>
        card.id === id ? { ...card, gridColumn: 4, gridRow: 2 } : card
      )
    );
  };

  const takeCard = (id) => {
    setCards(cards.map(card => card.id === id ? { ...card, gridColumn: 2, gridRow: 3 } : card));
    setPlayer({ ...player, cards: [...player.cards, cards.find(card => card.id === id)] });
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gridTemplateRows: 'repeat(3, 1fr)', width: "100vw", height: "100vh" }}>
      {cards.map(card => (
        <div key={card.id} style={{ gridColumn: card.gridColumn, gridRow: card.gridRow, display: 'flex', justifyContent: 'center', alignItems: 'center' }} onClick={() => card.gridColumn === 2 && card.gridRow === '2 / span 2' ? takeCard(card.id) : moveToCenter(card.id)}>
          {card.isOpen ? (
            <CardComponent text={card.name} description={card.effect} image={card.imageUrl} />
          ) : (
            <div style={{ width: '100px', height: '150px', backgroundColor: 'gray' }}></div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Game;
