const SCORE_SEQUENCE = ['0', '15', '30', '40', 'Ventaja', 'Juego'];

export function tennisScore(playerPoints, aiPoints) {
  // Basic tennis scoring logic to display traditional tennis scoreboard
  const scores = ['0', '15', '30', '40', 'Game'];
  const playerScore = playerPoints >= 5 ? 'Game' : scores[playerPoints];
  const aiScore = aiPoints >= 5 ? 'Game' : scores[aiPoints];
  
  return `${playerScore} - ${aiScore}`;
}

export function isSetWon(playerGames, aiGames, gamesToWin = 6) {
  // Check if a set is won with at least 2 games difference
  return (
    (playerGames >= gamesToWin || aiGames >= gamesToWin) &&
    Math.abs(playerGames - aiGames) >= 2
  );
}

export function getGameWinner(playerPoints, aiPoints) {
  // First to 5 points wins the game
  if (playerPoints >= 5 && playerPoints - aiPoints >= 2) {
    return 'Player';
  }
  if (aiPoints >= 5 && aiPoints - playerPoints >= 2) {
    return 'AI';
  }
  return null;
}
