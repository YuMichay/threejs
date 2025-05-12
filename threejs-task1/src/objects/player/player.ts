import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { AnimationMixer, Box3, Clock, Group, MeshBasicMaterial, Object3D, Vector3 } from "three";

import { keyboardControl } from '../../controls/keyboard';
import { positionIdle } from './playerIdle';
import { Player } from '../../types/player';
import { footsteps } from './steps';
import { bushes } from '../static/bush';
import { coins } from '../animated/coin/coin';
import { collectLine } from '../animated/coin/collectingLine';

const loader = new GLTFLoader();
const group = new Group();
const clock = new Clock();

let collectStartTime: number | null = null;
let collectingCoin: Object3D | null = null;
let closestCoin: Object3D | null = null;
let closestDistance: number | null = null;

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
  group.add(model);

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
    
    // BUSHES COLLISION
    let collision = false;
    for (const bush of bushes.group.children) {
      const bushBox = new Box3().setFromObject(bush);
      if (playerBox.intersectsBox(bushBox)) {
        collision = true;
        break;
      }
    }

    // COINS COLLECTING
    let nearCoin = false;

    for (const coin of coins.group.children) {
      const distance = coin.position.distanceTo(nextPosition);
      if (distance < 2) {
        nearCoin = true;
        closestDistance = distance;
        closestCoin = coin;
        break;
      }
    }

    if (keyboardControl.f && !!closestCoin && !collectingCoin) {
      collectStartTime = time;
      collectingCoin = closestCoin;
    }

    if (collectingCoin) {
      if (!keyboardControl.f || closestCoin !== collectingCoin) {
        collectStartTime = null;
        collectingCoin = null;
        closestCoin = null;
        closestDistance = null;
      } else {
        const currentDistance = collectingCoin.position.distanceTo(group.position);
        if (currentDistance > 3) {
          collectStartTime = null;
          collectingCoin = null;
          closestCoin = null;
          closestDistance = null;
          collectLine.visible = false;
          return;
        }

        const start = group.position.clone();
        start.z += 1;
        const end = collectingCoin.position.clone();
        end.z += 0.3;
        const center = new Vector3().addVectors(start, end).multiplyScalar(0.5);
        const dir = new Vector3().subVectors(end, start);
        const length = dir.length();
  
        collectLine.position.copy(center);
        collectLine.scale.set(length, 1.2, 1);
        collectLine.rotation.set(0, 0, Math.PI / 2);
        collectLine.visible = true;

        const pulse = Math.sin(time * 0.01) * 0.3 + 0.7;
        (collectLine.material as MeshBasicMaterial).opacity = pulse;
    
        if (time - (collectStartTime ?? 0) >= 3000) {
          coins.group.remove(collectingCoin);
    
          collectStartTime = null;
          collectingCoin = null;
          closestCoin = null;
          closestDistance = null;
          collectLine.visible = false;
        }
      }
    }

    // LIMIT MOVING
    if (!collision && !nearCoin) {
      group.position.add(direction);
    }

    // MOVING
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