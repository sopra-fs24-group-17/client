import React, { useState } from "react";
import { Card, CardContent, CardMedia, Typography } from "@mui/material";
import { motion } from "framer-motion";

interface CardProps {
  text: string;
  image: string;
  onClick?: () => void;
}

const CardComponent: React.FC<CardProps> = ({ text, image, onClick }) => {
  return (
    <motion.div whileHover={{ scale: 1.1 }}>
      <Card sx={{ width: 125, height: 175 }} onClick={onClick}>
        <CardMedia
          component="img"
          height="175" // Adjust height as needed
          image={image}
          alt={text}
        />
      </Card>
    </motion.div>
  );
};

export default CardComponent;
