import React from "react";
import { Modal, Table, Button } from "react-bootstrap";
import styles from "../../styles/Leaderboard.module.css";
import { useNavigate} from "react-router-dom";


interface LeaderboardEntry {
  username: string;
  position: number;
}

interface LeaderboardProps {
  show: boolean;
  onHide: () => void;
  leaderboard: LeaderboardEntry[];
}



const Leaderboard: React.FC<LeaderboardProps> = ({ show, onHide, leaderboard }) => {
  const navigate = useNavigate();

  const handleGoToJoinGame = () => {
    navigate("/dashboard/join-game");
  };

  return (
    <Modal show={show} onHide={onHide} centered backdrop="static" keyboard={false}>
      <Modal.Header>
        <Modal.Title>Leaderboard</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Table striped bordered hover className={styles.table}>
          <thead>
          <tr>
            <th>Position</th>
            <th>Username</th>
          </tr>
          </thead>
          <tbody>
          {leaderboard.map((entry, index) => (
            <tr key={index}>
              <td>{entry.position}</td>
              <td>{entry.username}</td>
            </tr>
          ))}
          </tbody>
        </Table>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={handleGoToJoinGame}>Home</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default Leaderboard;
