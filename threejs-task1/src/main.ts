import './style.css';

import { loadPlayerModel, player } from './objects/player/player';
import { renderer } from './base/renderer';
import { camera } from './base/camera';
import { scene } from './base/scene';
import { clouds } from './objects/static/cloud';
import { bushes } from './objects/static/bush';
import { coins } from './objects/coin/coin';
import { sceneBounds } from './config/constants';

// GAME START
let isGameStarted = false;

document.querySelector('#start')?.addEventListener('click', () => {
  const modal = document.getElementById('modal');
  if (modal) modal.style.display = 'none';

  isGameStarted = true;

  // COIN
  coins.generateNewCoins(10, 298, [player.group, bushes.group]);
});

// CLOUDS
clouds.distributeClouds(30, 298, [60, 100]);

// BUSHES
bushes.distributeBushes(298, 298);

// ADD PLAYER
async function init() {
  await loadPlayerModel();
  scene.add(player.group, camera);
}
init();

function animate() {
  if (isGameStarted) {
    player.render();
    coins.render();
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