export const updateCoinsDisplay = (collectedCoins: number) => {
  const coinsDisplay = document.getElementById('coins-count');
  coinsDisplay ? coinsDisplay.textContent = `${collectedCoins}` : '';
  return;
}