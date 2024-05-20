import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import Tutorial from "./Tutorial"; // Adjust the import path

interface TutorialPopupProps {
  open: boolean;
  onClose: () => void;
}

const TutorialPopup: React.FC<TutorialPopupProps> = ({ open, onClose }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogContent>
        <Tutorial />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TutorialPopup;
