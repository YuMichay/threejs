import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { AnimationMixer, ArrowHelper, Box3, Clock, Group, Raycaster, Vector3 } from "three";

import { keyboardControl } from '../../controls/keyboard';
import { positionIdle } from './playerIdle';
import { Player } from '../../types/player';
import { footsteps } from './steps';
import { bushes } from '../static/bush';
import { coins } from '../coin/coin';

const loader = new GLTFLoader();
const group = new Group();
const clock = new Clock();
const raycaster = new Raycaster();

export const player: Player = {group, render() {}};

export const loadPlayerModel = async(): Promise<void> => {
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

const initPlayerFromGLTF = (gltf: GLTF) => {
  const model = gltf.scene;
  model.rotation.set(Math.PI / 2, Math.PI, 0);

  const group = new Group();
  const arrowHelper = new ArrowHelper();
  group.add(model, arrowHelper);

  positionIdle(gltf);

  const mixer = new AnimationMixer(model);
  const walkClip = gltf.animations[0];
  const walkAction = mixer.clipAction(walkClip);

  player.group = group;
  player.mixer = mixer;
  player.walkAction = walkAction;

  let isMoving = false;

  player.render = () => {
    const delta = clock.getDelta();
    const time = clock.getElapsedTime() * 1000;

    const direction = keyboardControl.direction.clampLength(0.1, 0.1);
    const nextPosition = group.position.clone().add(direction);

    group.position.copy(nextPosition);
    const playerBox = new Box3().setFromObject(player.group);
    group.position.sub(direction);
    
    let collision = false;

    // const playerPosition = new Vector3(player.group.position.x, player.group.position.y, player.group.position.z - 0.5);
    // raycaster.set(playerPosition, direction.clone().normalize());
    // const intersectsBushes = raycaster.intersectObjects(bushes.group.children, true);

    for (const bush of bushes.group.children) {
      const bushBox = new Box3().setFromObject(bush);
      if (playerBox.intersectsBox(bushBox)) {
        collision = true;
        break;
      }
    }

    let nearCoin = false;
    for (const coin of coins.group.children) {
      const distance = coin.position.distanceTo(nextPosition);
      if (distance < 2) {
        nearCoin = true;
        const intersects = raycaster.intersectObjects(coins.group.children, false);
        console.log(intersects);
        break;
      }
    }

    const intersects = raycaster.intersectObjects(coins.group.children, false);
    console.log(intersects);
    
    if (!collision && !nearCoin) {
      group.position.add(direction);
    }

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

      footsteps.render(time, group.position, direction);
    }
    
    footsteps.update(time);
    mixer.update(delta);
  };
}