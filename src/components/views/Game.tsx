import React from 'react';
import { api, handleError } from 'helpers/api';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';



const Game: React.FC = () => {
    const navigate = useNavigate();

    const doLogout = async () => {
        try {
            const id = localStorage.getItem("id");
            const token = localStorage.getItem("token");
            api
                .post(`dashboard/${id}/logout`, null, {
                    headers: { token: token }
                })
                .then(() => {
                    localStorage.removeItem("token");
                    localStorage.removeItem("id");
                    navigate("/login");
                })
                .catch((error) => {
                    console.error("Logout failed: ", error);
                });
        } catch (error) {
            alert(
                `Something went wrong during the login: \n${handleError(error)}`
            );
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: "column", justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <h1>Game View Placeholder</h1>
            <Button variant="contained" color="primary" onClick={doLogout}>
                Logout
            </Button>
        </div>
    );
};

export default Game;