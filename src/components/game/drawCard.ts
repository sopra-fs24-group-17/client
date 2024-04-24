
export const drawCard = (playerTurn: boolean, closedDeck, playerHand, setPlayerHand, setClosedDeck, setPlayerTurn, sendMessage, navigate) => {
    const gameId = localStorage.getItem("gameId");
    const playerId = localStorage.getItem("id");

    if (!playerTurn) {
        alert("It's not your turn!");
        return;
    }
    if (closedDeck.length > 0) {
        // Remove the top card from the closed deck
        const drawnCard = closedDeck.shift();

        // If the card is an Exploding Kitten and the player has no defuse card, the player loses
        if (drawnCard.internalCode === "explosion" && !playerHand.some((card) => card.internalCode === "defuse")) {
            sendMessage(`/app/leaving/${gameId}/${playerId}`, {});
            alert(
                "You drew an Exploding Kitten and have no Defuse card! You lose!"
            );
            navigate("/dashboard/join-game");

        } else if (drawnCard.internalCode === "explosion" && playerHand.some((card) => card.internalCode === "defuse")) {
            // If the card is an Exploding Kitten and the player has a defuse card, the player can play the defuse card
            // Find the defuse card in the player's hand
            const defuseIndex = playerHand.findIndex(
                (card) => card.internalCode === "defuse"
            );
            // Remove the defuse card from the player's hand
            const newPlayerHand = [...playerHand];
            newPlayerHand.splice(defuseIndex, 1);
            setPlayerHand(newPlayerHand);
            // Add the Exploding Kitten card to the open deck
            setClosedDeck([...closedDeck]);
            setPlayerTurn(false);
            sendMessage(`/app/terminateMove/${gameId}/${playerId}`, {});
        } else {
            // Add the drawn card to the player's hand and open deck if necessary
            setPlayerHand((prevHand) => [...prevHand, drawnCard]);
            // Update the closed deck state
            setClosedDeck([...closedDeck]);
            setPlayerTurn(false);
            sendMessage(`/app/terminateMove/${gameId}/${playerId}`, {});
            // Handle other card effects...
        }

    } else {
        // Handle the situation where there are no more cards to draw, if applicable

    }
};