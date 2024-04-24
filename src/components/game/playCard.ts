export const playCard = (cardId, playerTurn, playerHand, setPlayerHand, setOpenDeck, openDeck, sendMessage) => {
    if (!playerTurn) {
        alert("It's not your turn!");
        return;
    }
    // Find the card in the player's hand
    const cardIndex = playerHand.findIndex((card) => card.internalCode === cardId);
    if (cardIndex !== -1) {
        const playedCard = playerHand[cardIndex];


        // Remove the card from the player's hand and add it to the open deck
        const newPlayerHand = [...playerHand];
        newPlayerHand.splice(cardIndex, 1); // Remove the card from the player's hand
        setPlayerHand(newPlayerHand);
        setOpenDeck([...openDeck, playedCard]); // Add the card to the open deck
        sendMessage(`/app/move/cards/${localStorage.getItem("gameId")}/${localStorage.getItem("id")}`, { cardId });
    }
};