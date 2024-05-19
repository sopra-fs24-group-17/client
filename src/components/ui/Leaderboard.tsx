import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Button
} from "@mui/material";
import styles from "../../styles/Leaderboard.module.css";
import { useNavigate} from "react-router-dom";


interface LeaderboardEntry {
  username: string;
  position: number;
}

interface LeaderboardProps {
  show: boolean;
  handleClose: () => void;
  leaderboard: LeaderboardEntry[];
}



const Leaderboard: React.FC<LeaderboardProps> = ({ show, handleClose, leaderboard }) => {
  const navigate = useNavigate();

  const handleGoToJoinGame = () => {
    navigate("/dashboard/join-game");
  };

  return (
    <Dialog
      open={show}
      onClose={(event, reason) => {
      if (reason !== "backdropClick") {
        handleClose();
      }
    }}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>Leaderboard</DialogTitle>
      <DialogContent>
        <Table className={styles.table}>
          <TableHead>
            <TableRow>
              <TableCell>Position</TableCell>
              <TableCell>Username</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {leaderboard.map((entry, index) => (
              <TableRow key={index}>
                <TableCell>{entry.position}</TableCell>
                <TableCell>{entry.username}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" color="primary" onClick={handleGoToJoinGame}>
          Home
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Leaderboard;
