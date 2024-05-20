import React, { useState, useEffect } from "react";
import { hints, getRandomHint } from "components/lobby/hints.js";


const HintsLobby = () => {
    const [currentHint, setCurrentHint] = useState(getRandomHint());

    useEffect(() => {
        let lastHint = currentHint.hint;

        const updateHint = () => {
            let newHintObject = getRandomHint();
            let attemptCount = 0;

            while (newHintObject.hint === lastHint && attemptCount < 10) {
                newHintObject = getRandomHint();
                attemptCount++;
            }

            setCurrentHint(newHintObject);
            lastHint = newHintObject.hint;
        };

        updateHint();
        const intervalId = setInterval(updateHint, 10000);

        return () => clearInterval(intervalId);
    }, []);

    const hintContainerStyle: React.CSSProperties = {
        backgroundColor: "#f0f0f0",
        padding: "20px",
        width: "600px",
        borderRadius: "8px",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        marginTop: "20px",
    };

    const hintListStyle: React.CSSProperties = {
        listStyleType: "none",
        padding: 0,
        margin: 0,
        width: "100%",
    };

    return (
        <div style={hintContainerStyle}>
            <ul style={hintListStyle}>
                <li>{currentHint.hint}</li>
                {currentHint.image ? (
                    <img
                        src={currentHint.image}
                        alt="Card Image"
                        style={{ maxWidth: "100px", marginTop: "10px" }}
                    />
                ) : null}
            </ul>
        </div>
    );
}

export default HintsLobby;