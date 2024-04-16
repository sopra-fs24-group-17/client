import React, { useState } from "react";
import { api, handleError } from "helpers/api";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import CardComponent from "components/ui/CardComponent";
import CardMovement from "components/ui/CardMovement";
import { Grid } from "@mui/material";
import { motion } from "framer-motion";

const Game = () => {
  const [cards, setCards] = useState([
    {
      id: 1,
      gridColumn: 1,
      gridRow: 2,
      text: "test1",
      description: "test description1",
      image: "test image 1",
    },
    {
      id: 2,
      gridColumn: 3,
      gridRow: 1,
      text: "test2",
      description: "test description2",
      image: "test image 2",
    },
    {
      id: 3,
      gridColumn: 5,
      gridRow: 2,
      text: "test3",
      description: "test description3",
      image: "test image 3",
    },
    {
      id: 4,
      gridColumn: 3,
      gridRow: 3,
      text: "test4",
      description: "test description4",
      image: "test image 4",
      isOpen: true,
    },
    {
      id: 5,
      gridColumn: 3,
      gridRow: 2,
      text: "closed",
      description: "closed card",
      image: "closedImage",
      isOpen: false,
    },
    {
      id: 6,
      gridColumn: 4,
      gridRow: 2,
      text: "open",
      description: "open card",
      image: "openImage",
      isOpen: true,
    },
  ]);

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
            <CardComponent text={card.text} description={card.description} image={card.image} />
          ) : (
            <div style={{ width: '100px', height: '150px', backgroundColor: 'gray' }}></div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Game;
