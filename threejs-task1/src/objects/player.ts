import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { Group } from "three";

import { createArrowHelper } from './arrow';
import { keyboardControl } from '../controls/keyboard';
import { positionIdle } from './playerIdle';

const loader = new GLTFLoader();
const group = new Group();
const render = () => {};
const arrowHelper = createArrowHelper();

export const player = {group, render};

loader.load( '/models/repo.glb', function ( gltf ) {
  const model = gltf.scene;
  model.rotation.set(Math.PI / 2, Math.PI, 0);
  group.add(model, arrowHelper.arrowHelper);
  player.group = group;
  positionIdle(gltf);

  player.render = () => {
    const direction = keyboardControl.direction.clampLength(0.1, 0.1);
    group.position.add(direction);

    if (direction.lengthSq() > 0.0001) {
      const targetAngle = Math.atan2(direction.y, direction.x) - Math.PI / 2;
      group.rotation.z += (targetAngle - group.rotation.z) * 0.2;
    }

    arrowHelper.render(keyboardControl.direction);
  }
},
(xhr) => {
  console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
},
(error) => {
  console.error( error );
} );