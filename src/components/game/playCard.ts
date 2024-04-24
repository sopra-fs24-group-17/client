export const playCard = (cardId, cardName, cardCode, playerTurn, playerHand, setPlayerHand, setOpenDeck, openDeck, sendMessage) => {
    const gameId = localStorage.getItem("gameId");
    const userId = localStorage.getItem("id");
    
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

        // const newOpenDeck = [...openDeck, playedCard]; // Add the card to the open deck
        // setOpenDeck(newOpenDeck);

       console.log(cardName)
        sendMessage(`/app/move/cards/${gameId}/${userId}`, { 
            "gameId": gameId,
            "userId": userId,
            "cardIds": [cardCode],
            "targetUserId": userId
         });
    }
};