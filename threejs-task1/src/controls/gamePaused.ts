export const gamePaused = (isPaused: boolean) => {
  const modal = document.getElementById('modal');
  const message = document.getElementById('game-message');
  const startButton = document.getElementById('start');
  const field = document.getElementById('field');

  if (field) field.style.display = isPaused ? 'none' : 'block';
  if (modal) modal.style.display = isPaused ? 'flex' : 'none';
  if (startButton) startButton.style.display = isPaused ? 'none' : 'block';
  if (message) {
    message.style.display = isPaused ? 'flex' : 'none';
    message.textContent = 'Game is paused';
  }
}
