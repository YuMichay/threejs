import './style.css';

import { Clock } from 'three';

import { renderer } from './base/renderer';
import { camera } from './base/camera';
import { scene } from './base/scene';

import { loadPlayerModel, player } from './objects/player/player';
import { clouds } from './objects/static/cloud';
import { bushes } from './objects/static/bush';
import { coins } from './objects/animated/coin/coin';

import { COINS_AMOUNT, GAME_TIME, sceneBounds } from './config/constants';

import { updateCoinsDisplay } from './controls/updateCoinsDisplay';
import { updateTimeDisplay } from './controls/updateTimeDisplay';
import { gameEnd } from './controls/gameEnd';
import { coinsManager } from './controls/coinsState';
import { keyboardControl } from './controls/keyboard';
import { gamePaused } from './controls/gamePaused';
import { loadingManager } from './controls/loadingManager';
import { listener, isMusicOn, startMusic, stopMusic, pauseMusic, resumeMusic } from './controls/listener';
import { dirLight, dirLightOffset } from './environment/light';

// CLOUDS
clouds.distributeClouds(50, 298, [50, 100]);

// BUSHES
bushes.distributeBushes(300, 290);

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

// DOM ELEMENTS
const soundControl = document.getElementById('music');
const modal = document.getElementById('modal');
const field = document.getElementById('field');

document.querySelector('#start')?.addEventListener('click', () => {  
  if (modal) modal.style.display = 'none';
  if (field) field.style.display = 'block';

  isGameStarted = true;
  coinsManager.reset();
  timeLeft = GAME_TIME;
  lastTimeUpdate = 0;
  clock.start();
  updateCoinsDisplay(coinsManager.getCoins());
  updateTimeDisplay(timeLeft);

  // RESET PAUSE MODE
  keyboardControl.esc = false;

  // ADD MUSIC
  camera.add(listener);
  if (isMusicOn) startMusic();
  
  // RESET PLAYER POSITIONS
  player.group.position.set(0, 0, 0);
  player.group.rotation.set(0, 0, 0);

  // COIN
  coins.generateNewCoins(COINS_AMOUNT, 290, [player.group, bushes.group]);
});

function animate() {
  const delta = clock.getDelta();

  if (isGameStarted) {
    if (keyboardControl.esc && !isGamePaused) {
      isGamePaused = true;
      clock.stop();
      gamePaused(true);

      if (isMusicOn) pauseMusic();
    } else if (!keyboardControl.esc && isGamePaused) {
      isGamePaused = false;
      clock.start();
      gamePaused(false);

      if (isMusicOn) resumeMusic();
    }
  }

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

          if (isMusicOn) {
            stopMusic();
            if (soundControl) soundControl.style.opacity = '0.5';
          }
        }
      } else {
        gameEnd(false);
        clock.stop();
        isGameStarted = false;

        if (isMusicOn) {
          stopMusic();
          if (soundControl) soundControl.style.opacity = '0.5';
        }
      }
    }
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

  dirLight.position.copy(playerPosition.clone().add(dirLightOffset));
  dirLight.target = player.group;
}

renderer.setAnimationLoop(animate);

// SOUND ON/OFF
document.querySelector('#music')?.addEventListener('click', () => {
  if (isMusicOn) {
    stopMusic();
    if (soundControl) soundControl.style.opacity = '0.5';
  } else {
    startMusic();
    if (soundControl) soundControl.style.opacity = '1';
  }
});

// RESIZE
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// LOADING
loadingManager.onLoad = () => {
  requestAnimationFrame(() => {
    const loader = document.getElementById('loader');
    if (loader) loader.style.display = 'none';

    const app = document.getElementById('app');
    if (app) app.style.display = 'block';  

    renderer.setAnimationLoop(animate);
  });
};