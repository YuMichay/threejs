export const gamePaused = (isPaused: boolean) => {
  const modal = document.getElementById('modal-pause');
  const message = document.getElementById('pause-message');

  if (modal) modal.style.display = isPaused ? 'flex' : 'none';
  if (message) message.style.display = isPaused ? 'block' : 'none';
}
