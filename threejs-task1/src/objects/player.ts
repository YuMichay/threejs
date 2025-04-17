import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { AnimationMixer, Clock, Group } from "three";

import { createArrowHelper } from './arrow';
import { keyboardControl } from '../controls/keyboard';
import { positionIdle } from './playerIdle';
import { Player } from '../types/player';

const loader = new GLTFLoader();
const group = new Group();
const clock = new Clock();

export const player: Player = {group, render() {},};

export async function loadPlayerModel(): Promise<void> {
  const gltf = await new Promise<GLTF>((resolve, reject) => {
    loader.load(
      '/models/repo.glb',
      resolve,
      undefined,
      reject
    );
  });

  initPlayerFromGLTF(gltf);
}

function initPlayerFromGLTF(gltf: GLTF) {
  const model = gltf.scene;
  model.position.z = -0.1;
  model.rotation.set(Math.PI / 2, Math.PI, 0);

  const group = new Group();
  const arrowHelper = createArrowHelper();
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
  };
}