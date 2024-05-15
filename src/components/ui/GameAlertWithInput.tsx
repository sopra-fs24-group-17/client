import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { TextField, Typography } from "@mui/material";

interface GameAlertWithInputProps {
  open: boolean;
  handleClose: () => void;
  title: string;
  description: string;
  playerNames: string[];
  onSubmit: (value: string) => void;
  piles?: { [key: string]: number };
}

export default function GameAlertWithInput({
  open,
  handleClose,
  title,
  description,
  playerNames,
  onSubmit,
  piles,
}: GameAlertWithInputProps) {
  const [selectedPlayer, setSelectedPlayer] = React.useState(null);
  const [placementIndex, setPlacementIndex] = React.useState(null);
  const [dealerDeckCount, setDealerDeckCount] = React.useState(0);

  if (piles) {
    setDealerDeckCount(piles["dealer"]);
  }

  const names = playerNames.filter(
    (name) => name !== localStorage.getItem("username")
  );

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedPlayer(event.target.value as string);
  };

  const handleChangeExplosion = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    setPlacementIndex(event.target.value as number);
  };

  const handleSubmit = () => {
    if (selectedPlayer) {
      onSubmit(selectedPlayer);
      setSelectedPlayer(null);
      handleClose();
    } else if (placementIndex) {
      onSubmit(placementIndex.toString());
      setPlacementIndex(null);
      handleClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={(event, reason) => {
        if (reason !== "backdropClick") {
          handleClose();
        }
      }}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {description}
        </DialogContentText>
        {title === "Favor" && (
          <Select
            value={selectedPlayer}
            onChange={handleChange}
            sx={{ width: "50%", marginTop: "10px" }}
          >
            {names.map((name, index) => (
              <MenuItem value={name} key={index}>
                {name}
              </MenuItem>
            ))}
          </Select>
        )}
        {title === "Explosion Time" && (
          <>
            <Typography variant="body1">
              Currently the dealer deck has {dealerDeckCount} cards.
            </Typography>
            <TextField
              type="number"
              value={placementIndex}
              onChange={handleChangeExplosion}
            />
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleSubmit}
          autoFocus
          disabled={!placementIndex && !selectedPlayer}
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
}
