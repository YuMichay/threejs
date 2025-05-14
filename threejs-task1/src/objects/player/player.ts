import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { AnimationMixer, Box3, Clock, Group } from "three";

import { keyboardControl } from '../../controls/keyboard';
import { positionIdle } from './playerIdle';
import { Player } from '../../types/player';
import { footsteps } from './steps';
import { bushes } from '../static/bush';
import { coins } from '../animated/coin/coin';
import { collectLine } from '../animated/coin/collectingLine';
import { checkBushCollision } from '../../controls/checkBushCollisions';
import { findClosestCoin } from '../../controls/findClosestCoin';
import { updateCollectLine } from '../animated/coin/animateCollectline';
import { COLLECT_TIME } from '../../config/constants';
import { updateCoinsDisplay } from '../../controls/updateCoinsDisplay';
import { coinsManager } from '../../controls/coinsState';

const loader = new GLTFLoader();
const group = new Group();
const clock = new Clock();

let collision = false;
let nearCoin = false;

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
    collision = checkBushCollision(playerBox, bushes.group.children);

    // COINS COLLECTING
    const collectingCoin = coinsManager.getCollectingCoin();
    nearCoin = !!coinsManager.closestCoin;

    if (!collectingCoin) {
      coinsManager.setClosestCoin(findClosestCoin(coins.group.children, nextPosition, 2))
    }

    if (keyboardControl.f && !!coinsManager.closestCoin && !collectingCoin) {
      coinsManager.setTime(time);
      coinsManager.setCollectingCoin(coinsManager.closestCoin);
    }

    if (collectingCoin) {
      if (!keyboardControl.f || coinsManager.closestCoin !== collectingCoin) {
        coinsManager.resetCollecting();
        collectLine.visible = false;
        coinsManager.setCoinGlow(collectingCoin, false);
      } else {
        const currentDistance = collectingCoin.position.distanceTo(nextPosition);
        if (currentDistance > 2) {
          nearCoin = false;
          coinsManager.resetCollecting();
          collectLine.visible = false;
          coinsManager.setCoinGlow(collectingCoin, false);
          return;
        } else {
          coinsManager.setCoinGlow(collectingCoin, true);
          updateCollectLine(group.position, collectingCoin.position, time, collectLine);
        }

        if (time - (coinsManager.collectStartTime ?? 0) >= COLLECT_TIME) {
          coins.group.remove(collectingCoin);
          coinsManager.collectCoins();
          
          const collectedCoins = coinsManager.getCoins();
          updateCoinsDisplay(collectedCoins);
          
          coinsManager.resetCollecting();
          coinsManager.setCoinGlow(collectingCoin, false);
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