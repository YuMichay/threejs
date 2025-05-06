import {
  MathUtils,
  Mesh,
  MeshStandardMaterial,
  CylinderGeometry,
  Color,
  Vector3,
  Group,
} from 'three';
import { isPositionValid } from '../../controls/generateValidPosition';

const group = new Group();

const coinMaterial = new MeshStandardMaterial({
  color: 0xFFD700,
  emissive: new Color(0xFFFF00),
  emissiveIntensity: 0.5,
  metalness: 0.8,
  roughness: 0.1
});

const createCoin = (): Mesh => {
  const geometry = new CylinderGeometry(0.3, 0.3, 0.1, 32);
  const mesh = new Mesh(geometry, coinMaterial);
  mesh.rotation.x = Math.PI;

  return mesh;
};

const addCoin = (position: Vector3) => {
  const coin = createCoin();
  coin.position.copy(position);
  group.add(coin);
};

const addRandomCoin = (areaSize: number, excludedObjects: Group[]) => {
  let randomPosition = new Vector3();

  do {
    randomPosition.set(
      MathUtils.randFloatSpread(areaSize),
      MathUtils.randFloatSpread(areaSize),
      0.3
    );
  } while (!isPositionValid(randomPosition, excludedObjects, 2));

  addCoin(randomPosition);
};

const render = () => {
  group.children.forEach((coin) => {
    coin.rotation.z += 0.1;
  });
};

const generateNewCoins = (count: number, areaSize: number, excludedObjects: Group[]) => {
  group.clear();

  for (let i = 0; i < count; i++) {
    addRandomCoin(areaSize, excludedObjects);
  }
};

export const coins = { group, addRandomCoin, render, generateNewCoins };