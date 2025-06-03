import { Sprite, SpriteMaterial, TextureLoader, Group, Vector3 } from "three";
import { HEART_COUNT, HEART_LIFETIME, HEART_SPAWN_INTERVAL } from "../../config/constants";

const textureLoader = new TextureLoader();
const heartTexture = textureLoader.load('/assets/heart.png');

let lastSpawnTime = 0;
let active = false;

export const group = new Group();

interface Heart {
  sprite: Sprite;
  birthTime: number;
  delay: number;
  basePosition: Vector3;
}

const activeHearts: Heart[] = [];

const spawn = (time: number, playerPos: Vector3) => {
  for (let i = 0; i < HEART_COUNT; i++) {
    const material = new SpriteMaterial({
      map: heartTexture,
      transparent: true,
      opacity: 0,
      depthTest: true,
    });

    const sprite = new Sprite(material);
    sprite.scale.set(0.4, 0.4, 1);
    sprite.position.copy(playerPos).add(new Vector3(0, 0, 1));
    group.add(sprite);

    activeHearts.push({
      sprite,
      birthTime: time,
      delay: i * HEART_SPAWN_INTERVAL,
      basePosition: sprite.position.clone(),
    });
  }
}

const setActive = (value: boolean) => {
  active = value;
  if (!active) lastSpawnTime = 0;
}

const update = (time: number, playerPos: Vector3) => {
  if (active && time - lastSpawnTime > HEART_SPAWN_INTERVAL) {
    hearts.spawn(time, playerPos);
    lastSpawnTime = time;
  }

  for (let i = activeHearts.length - 1; i >= 0; i--) {
    const { sprite, birthTime, delay, basePosition } = activeHearts[i];
    const age = time - birthTime;

    if (age < delay) continue;

    const localAge = age - delay;

    if (localAge >= HEART_LIFETIME) {
      group.remove(sprite);
      activeHearts.splice(i, 1);
      continue;
    }

    const progress = localAge / HEART_LIFETIME;
    const scale = 0.4 + 0.1 * Math.sin(localAge / 100);
    sprite.scale.set(scale, scale, 1);
    sprite.position.y = basePosition.y + progress * 0.5;
    const material = sprite.material as SpriteMaterial;
    material.opacity = 1 - progress;
  }
}

export const hearts = { group, spawn, setActive, update };