export const playCard = (
  cardId,
  cardName,
  cardCode,
  playerTurn,
  playerHand,
  setPlayerHand,
  sendMessage,
  setGameAlertOpen,
  setGameAlertTitle,
  setGameAlertDescription
) => {
  const gameId = localStorage.getItem("gameId");
  const userId = localStorage.getItem("id");
  let targetUserId = userId;
  let cardCodes = [cardCode];
  let cardIncidesToRemove = [];

  if (!playerTurn) {
    setGameAlertTitle("It's not your turn!");
    setGameAlertDescription(
      "You can only play a card when it's your turn. You can see that it is your turn by the alert at the top of the screen."
    );
    setGameAlertOpen(true);
    return;
  }
  // Find the card in the player's hand
  const cardIndex = playerHand.findIndex((card) => card.code === cardCode);
  cardIncidesToRemove.push(cardIndex);
  if (cardIndex !== -1) {
    if (cardName === "favor") {
      // If the card is a favor card, ask the player to choose a target
      targetUserId = prompt("Enter the ID of the player you want to target:");
    } else if (
      ["hairypotatocat", "tacocat", "beardcat", "cattermelon"].includes(
        cardName
      )
    ) {
      // If the card is a palindrome card, check if the player has another card of the same type
      const otherCardIndex = playerHand.findIndex(
        (card, index) =>
          card.internalCode === cardId &&
          card.code !== cardCode &&
          index !== cardIndex
      );
      if (otherCardIndex === -1) {
        alert("You need two cards of the same type to play this card.");
        return;
      } else {
        cardCodes.push(playerHand[otherCardIndex].code);
        cardIncidesToRemove.push(otherCardIndex);
      }
    } else if (cardName === "nope") {
    }

    // Remove the card from the player's hand and add it to the open deck
    console.log(cardIndex);
    console.log(cardIncidesToRemove);
    const newPlayerHand = playerHand.filter(
      (_, index) => !cardIncidesToRemove.includes(index)
    );
    setPlayerHand(newPlayerHand);

    console.log(cardName);
    sendMessage(`/app/move/cards/${gameId}/${userId}`, {
      gameId: gameId,
      userId: userId,
      cardIds: cardCodes,
      targetUserId: targetUserId,
      negationUsers: "",
    });
  }
};
