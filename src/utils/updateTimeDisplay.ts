export const updateTimeDisplay = (time: number) => {
  const minutes = Math.floor(time / 60);
  const minutesToDisplay = minutes < 10 ? `0${minutes}` : minutes;
  const seconds = time - minutes * 60;
  const secondsToDisplay = seconds < 10 ? `0${seconds}` : seconds;

  const timeDisplay = document.getElementById('time');
  timeDisplay ? timeDisplay.textContent = `${minutesToDisplay}:${secondsToDisplay}` : '';
  return
}