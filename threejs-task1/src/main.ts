import './style.css';

import { loadPlayerModel, player } from './objects/player/player';
import { renderer } from './base/renderer';
import { camera } from './base/camera';
import { scene } from './base/scene';
import { clouds } from './objects/static/cloud';
import { bushes } from './objects/static/bush';
import { coins } from './objects/coin/coin';

// CLOUDS
clouds.distributeClouds(30, 300, [60, 100]);

// BUSHES
bushes.distributeBushes(300, 300);

// COIN
coins.generateNewCoins(10, 300, [player.group, bushes.group]);

// ADD PLAYER
async function init() {
  await loadPlayerModel();
  scene.add(player.group, camera);
}
init();

function animate() {
  player.render();
  coins.render();
  
  renderer.render(scene, camera);

  camera.position.x = player.group.position.x;
  camera.position.y = player.group.position.y - 6;
  camera.position.z = player.group.position.z + 2;
}
renderer.setAnimationLoop(animate);

// RESIZE
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});