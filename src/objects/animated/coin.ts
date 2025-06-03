import {
  MathUtils,
  Mesh,
  MeshStandardMaterial,
  CylinderGeometry,
  Color,
  Vector3,
  Group,
} from 'three';
import { isPositionValid } from '../../utils/generateValidPosition';
import { CoinData } from '../../types/coins';

const group = new Group();
const coinData: CoinData[] = [];

const coinMaterial = new MeshStandardMaterial({
  color: 0xFFD700,
  emissive: new Color(0xFFFF00),
  emissiveIntensity: 0.5,
  metalness: 0.8,
  roughness: 0.1
});

const createCoin = (): Mesh => {
  const geometry = new CylinderGeometry(0.3, 0.3, 0.1, 32);
  const mesh = new Mesh(geometry, coinMaterial.clone());
  mesh.rotation.x = Math.PI;
  mesh.castShadow = true;
  mesh.receiveShadow = true;

  return mesh;
};

const addCoin = (position: Vector3) => {
  const coin = createCoin();
  coin.position.copy(position);
  group.add(coin);

  coinData.push({
    object: coin,
    position: coin.position.clone(),
    collected: false,
  });
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
  coinData.length = 0;

  for (let i = 0; i < count; i++) {
    addRandomCoin(areaSize, excludedObjects);
  }
};

export const coins = { group, coinData, addRandomCoin, render, generateNewCoins };