
export const drawCard = (playerTurn: boolean, sendMessage, setGameAlertOpen, setGameAlertTitle, setGameAlertDescription) => {
    const gameId = localStorage.getItem("gameId");
    const playerId = localStorage.getItem("id");

    if (!playerTurn) {
        setGameAlertTitle("It's not your turn!");
        setGameAlertDescription("You can only play a card when it's your turn. You can see that it is your turn by the alert at the top of the screen.");
        setGameAlertOpen(true);
        return;
    }

    sendMessage(`/app/terminateMove/${gameId}/${playerId}`, {});
};