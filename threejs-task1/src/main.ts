import { Scene, PerspectiveCamera, WebGLRenderer } from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';

import './style.css';

import { ambientLight, dirLight } from './environment/light';
import { player } from './objects/player';
import { ground } from './environment/ground';
import { sky } from './environment/sky';

const scene = new Scene();
const camera = new PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);

const renderer = new WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, document.body.querySelector('canvas'));
controls.target.set(0, 0, 0);
controls.update();

// ADD LIGHT
scene.add(ambientLight, dirLight);

// ADD GROUND
scene.add(ground);

// ADD SKY
scene.add(sky);

// ADD PLAYER
scene.add(player.group);

camera.position.z = 5;

function animate() {
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