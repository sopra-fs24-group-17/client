export const playCard = (cardId, cardName, cardCode, playerTurn, playerHand, setPlayerHand, setOpenDeck, openDeck, sendMessage) => {
    const gameId = localStorage.getItem("gameId");
    const userId = localStorage.getItem("id");
    let targetUserId = userId;
    let cardCodes = [cardCode]
    let cardIncidesToRemove = []

    if (!playerTurn) {
        alert("It's not your turn!");
        return;
    }
    // Find the card in the player's hand
    const cardIndex = playerHand.findIndex((card) => card.internalCode === cardId);
    cardIncidesToRemove.push(cardIndex)
    if (cardIndex !== -1) {
        if (cardName === "favor") {
            // If the card is a favor card, ask the player to choose a target
            targetUserId = prompt("Enter the ID of the player you want to target:");
        }

        if (["hairypotatocat", "tacocat", "beardcat", "cattermelon"].includes(cardName)) {
            // If the card is a palindrome card, check if the player has another card of the same type
            const otherCardIndex = playerHand.findIndex((card) => card.internalCode === cardId && card.code !== cardCode);
            if (otherCardIndex === -1) {
                alert("You need two cards of the same type to play this card.");
                return;
            } else {
                cardCodes.push(playerHand[otherCardIndex].code);
                cardIncidesToRemove.push(otherCardIndex);
            }
        }

        // Remove the card from the player's hand and add it to the open deck
        console.log(cardIndex)
        console.log(cardIncidesToRemove)
        const newPlayerHand = playerHand.filter((_, index) => !cardIncidesToRemove.includes(index));
        setPlayerHand(newPlayerHand);

        console.log(cardName)
        sendMessage(`/app/move/cards/${gameId}/${userId}`, {
            "gameId": gameId,
            "userId": userId,
            "cardIds": cardCodes,
            "targetUserId": targetUserId
        });
    }
};