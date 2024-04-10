import PropTypes from 'prop-types';
import React, { useState } from "react";

const Lobby: React.FC = () => {
  // Mock data for display
  const currentPlayers = 2;
  const [totalPlayersRequired, setTotalPlayersRequired] = useState<number>(
    parseInt(localStorage.getItem('totalPlayersRequired') || '2', 10)
  );


  // Annotate style objects with React.CSSProperties
  const lobbyContainerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
  };

  const statusContainerStyle: React.CSSProperties = {
    textAlign: 'center',
    marginBottom: '30px',
  };

  const playersStatusStyle: React.CSSProperties = {
    fontSize: '1.5rem', 
    margin: '20px 0',
  };

  const checkIconStyle: React.CSSProperties = {
    color: 'green',
    fontSize: '3rem',
    marginTop: '10px',
  };

  const hintContainerStyle: React.CSSProperties = {
    backgroundColor: '#f0f0f0',
    padding: '20px',
    width: '300px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    textAlign: 'left',
  };

  const hintTitleStyle: React.CSSProperties = {
    marginBottom: '10px',
  };

  const hintListStyle: React.CSSProperties = {
    paddingLeft: '20px',
  };

  const hintListItemStyle: React.CSSProperties = {
    marginBottom: '5px',
  };

  return (
    <div style={lobbyContainerStyle}>
      <div style={statusContainerStyle}>
        <h2>Waiting for players to join...</h2>
        <div style={playersStatusStyle}>
          {currentPlayers} out of {totalPlayersRequired} players
        </div>
        {currentPlayers === totalPlayersRequired && (
          <div style={checkIconStyle}>✓</div>
        )}
      </div>
      <div style={hintContainerStyle}>
        <h3 style={hintTitleStyle}>Hint</h3>
        <p>In this game mode, the rules are...</p>
        <ul style={hintListStyle}>
          <li style={hintListItemStyle}>Try to do this.</li>
          <li style={hintListItemStyle}>You can also do this.</li>
        </ul>
      </div>
    </div>
  );
};

Lobby.propTypes = {
    totalPlayersRequired: PropTypes.number.isRequired
  };
  

export default Lobby;
