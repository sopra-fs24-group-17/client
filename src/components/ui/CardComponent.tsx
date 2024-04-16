import React, { useState } from "react";
import { Card, CardContent, CardMedia, Typography } from "@mui/material";
import { motion } from "framer-motion";

interface CardProps {
  text: string;
  description: string;
  image: string;
  onClick?: () => void;
}

const CardComponent: React.FC<CardProps> = ({
  text,
  description,
  image,
  onClick,
}) => {
  return (
    <Card sx={{ width: 125, height: 175 }} onClick={onClick}>
      <CardContent>
        <Typography variant="h5" component="div">
          {text}
          {image}
          {description}
        </Typography>
        {/* Add more content here as needed */}
      </CardContent>
    </Card>
  );
};

export default CardComponent;
