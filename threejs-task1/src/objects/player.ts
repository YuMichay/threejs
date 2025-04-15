import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { AnimationMixer, Clock, Group } from "three";

import { createArrowHelper } from './arrow';
import { keyboardControl } from '../controls/keyboard';
import { positionIdle } from './playerIdle';
import { Player } from '../types/player';

const loader = new GLTFLoader();
const group = new Group();
const arrowHelper = createArrowHelper();
const clock = new Clock();

export const player: Player = {group, render() {},};

loader.load( '/models/repo.glb', function ( gltf ) {
  const model = gltf.scene;
  model.rotation.set(Math.PI / 2, Math.PI, 0);
  group.add(model, arrowHelper.arrowHelper);
  
  positionIdle(gltf);

  const mixer = new AnimationMixer(model);
  const walkClip = gltf.animations[0];
  const walkAction = mixer.clipAction(walkClip);

  player.group = group;
  player.mixer = mixer;
  player.walkAction = walkAction;

  let isMoving = false;

  player.render = () => {
    const direction = keyboardControl.direction.clampLength(0.1, 0.1);
    group.position.add(direction);

    const movingNow = direction.lengthSq() > 0.0001;

    if (movingNow && !isMoving) {
      walkAction.paused = false;
      isMoving = true;
    }

    if (!movingNow && isMoving) {
      walkAction.paused = true;
      isMoving = false;
      positionIdle(gltf);
    }

    if (isMoving) {
      walkAction.play();
      const targetAngle = Math.atan2(direction.y, direction.x) - Math.PI / 2;
      group.rotation.z += (targetAngle - group.rotation.z) * 0.2;
    }

    const delta = clock.getDelta();
    mixer.update(delta);
  }
},
(xhr) => {
  console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
},
(error) => {
  console.error( error );
} );