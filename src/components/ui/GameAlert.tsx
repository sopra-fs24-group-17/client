import * as React from "react";
import {
  Typography,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
} from "@mui/material";
import DialogTitle from "@mui/material/DialogTitle";

interface GameAlertProps {
  open: boolean;
  handleClose: () => void;
  title: string;
  description: string;
  cardDetails?: { name: string; imageUrl: string }[];
}

export default function GameAlert({
  open,
  handleClose,
  title,
  description,
  cardDetails = [],
}: Readonly<GameAlertProps>) {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogContent>
        <DialogTitle>{title}</DialogTitle>
        <Typography
          paddingLeft={"16px"}
          variant="body1"
          id="alert-dialog-description"
        >
          {description}
        </Typography>
        {cardDetails.length > 0 && (
          <Box
            mt={2}
            display="flex"
            flexDirection="row"
            justifyContent="center"
          >
            {cardDetails.map((card, index) => (
              <Box key={index} display="flex" alignItems="center" mb={2}>
                <img
                  src={card.imageUrl}
                  alt={card.name}
                  style={{ width: 125, height: 175, marginRight: 10 }}
                />
              </Box>
            ))}
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} autoFocus>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
