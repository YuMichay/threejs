import { AxesHelper } from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';

import './style.css';

import { loadPlayerModel, player } from './objects/player';
import { renderer } from './base/renderer';
import { camera } from './base/camera';
import { scene } from './base/scene';

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0, 0);
controls.update();

// ADD PLAYER
async function init() {
  await loadPlayerModel();
  scene.add(player.group);
}
init();
scene.add(new AxesHelper(5));

function animate() {
  controls.update();
  player.render();
  renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);

// RESIZE
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});