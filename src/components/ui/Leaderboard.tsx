import React from 'react';
import { Modal, Table, Button } from 'react-bootstrap';
import styles from './Leaderboard.module.css';

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
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
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
        <Button variant="secondary" onClick={onHide}>Close</Button>
        <Button variant="primary" onClick={onHide}>Go to Join Game</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default Leaderboard;
