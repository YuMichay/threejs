import { coinsManager } from "./coinsState";
import { loseEffect, winEffect } from "./listener";

export const gameEnd = (isWon: boolean) => {
  const modal = document.getElementById('modal');
  const result = document.getElementById('game-message');
  const field = document.getElementById('field');

  if (field) field.style.display = 'none';
  if (modal) modal.style.display = 'flex';

  if (result) {
    result.style.display = 'flex';
    result.textContent = isWon
      ? `You won! Collected all coins!`
      : `Time's up! Collected ${coinsManager.getCoins()} coins. Let's try again!`;
  }

  if (isWon) winEffect.play();
  else loseEffect.play();
}
