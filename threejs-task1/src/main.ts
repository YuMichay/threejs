import './style.css';

import { loadPlayerModel, player } from './objects/player/player';
import { renderer } from './base/renderer';
import { camera } from './base/camera';
import { scene } from './base/scene';
import { clouds } from './objects/static/cloud';
import { bushes } from './objects/static/bush';
import { coins } from './objects/animated/coin/coin';
import { COINS_AMOUNT, GAME_TIME, sceneBounds } from './config/constants';
import { Clock } from 'three';
import { updateCoinsDisplay } from './controls/updateCoinsDisplay';
import { updateTimeDisplay } from './controls/updateTimeDisplay';
import { gameEnd } from './controls/gameEnd';
import { coinsManager } from './controls/coinsState';
import { keyboardControl } from './controls/keyboard';
import { gamePaused } from './controls/gamePaused';

// CLOUDS
clouds.distributeClouds(50, 298, [50, 100]);

// BUSHES
bushes.distributeBushes(298, 298);

// ADD PLAYER
async function init() {
  await loadPlayerModel();
  scene.add(player.group, camera);
}
init();

// GAME START
const clock = new Clock();
let timeLeft = GAME_TIME;
let isGameStarted = false;
let isGamePaused = false;
let lastTimeUpdate = 0;
let totalElapsed = 0;

document.querySelector('#start')?.addEventListener('click', () => {
  const modal = document.getElementById('modal');
  if (modal) modal.style.display = 'none';

  const field = document.getElementById('field');
  if (field) field.style.display = 'block';

  isGameStarted = true;
  coinsManager.reset();
  timeLeft = GAME_TIME;
  lastTimeUpdate = 0;
  clock.start();
  updateCoinsDisplay(coinsManager.getCoins());
  updateTimeDisplay(timeLeft);
  
  // RESET PLAYER POSITIONS
  player.group.position.set(0, 0, 0);
  player.group.rotation.set(0, 0, 0);

  // COIN
  coins.generateNewCoins(COINS_AMOUNT, 290, [player.group, bushes.group]);
});

function animate() {
  const delta = clock.getDelta();

  if (isGameStarted && !isGamePaused) {
    player.render();
    coins.render();

    totalElapsed += delta;

    if (Math.floor(totalElapsed) > lastTimeUpdate) {
      if (timeLeft > 0) {
        timeLeft--;
        updateTimeDisplay(timeLeft);
        lastTimeUpdate = Math.floor(totalElapsed);

        if (coinsManager.getCoins() === 10) {
          gameEnd(true);
          clock.stop();
          isGameStarted = false;
        }
      } else if (timeLeft <= 0) {
        gameEnd(false);
        clock.stop();
        isGameStarted = false;
      }
    }
  }

  if (keyboardControl.esc) {
    isGamePaused = true;
    isGameStarted = false;
    gamePaused(isGamePaused);
    clock.stop();
  } else if (isGamePaused && !keyboardControl.esc) {
    isGamePaused = false;
    isGameStarted = true;
    gamePaused(isGamePaused);
    clock.start();
  }

  renderer.render(scene, camera);

  const playerPosition = player.group.position;
  
  // AREA LIMITS FOR PLAYER
  if (playerPosition.x < sceneBounds.minX) playerPosition.x = sceneBounds.minX;
  if (playerPosition.x > sceneBounds.maxX) playerPosition.x = sceneBounds.maxX;
  if (playerPosition.y < sceneBounds.minY) playerPosition.y = sceneBounds.minY;
  if (playerPosition.y > sceneBounds.maxY) playerPosition.y = sceneBounds.maxY;

  // PLAYER VIEW
  camera.position.x = playerPosition.x;
  camera.position.y = playerPosition.y - 6;
  camera.position.z = playerPosition.z + 2;
}

renderer.setAnimationLoop(animate);

// RESIZE
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// LOADING
window.addEventListener('DOMContentLoaded', () => {
  const loader = document.getElementById('loader');
  const app = document.getElementById('app');

  if (loader) loader.style.display = 'none';
  if (app) app.style.display = 'block';
});