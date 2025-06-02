import {
  Box3,
  Group,
  MathUtils,
  Mesh,
  MeshStandardMaterial,
  SphereGeometry,
  Vector3
} from 'three';
import { isPositionValid } from '../../controls/generateValidPosition';

const group = new Group();
const bushBoxes: Box3[] = [];

const bushMaterial = new MeshStandardMaterial({
  color: 0x228b22,
  roughness: 1,
  metalness: 0,
});

const createBush = (): Group => {
  const bush = new Group();
  const sphereCount = 3 + Math.floor(Math.random() * 2);

  for (let i = 0; i < sphereCount; i++) {
    const sphere = new Mesh(
      new SphereGeometry(0.5 + Math.random() * 0.2, 16, 16),
      bushMaterial
    );
    sphere.castShadow = true;
    sphere.receiveShadow = true;

    sphere.position.set(
      (Math.random() - 0.5) * 1,
      Math.random() * 0.5,
      (Math.random() - 0.5) * 1
    );

    bush.add(sphere);
  }

  bush.scale.setScalar(MathUtils.randFloat(0.8, 1.5));
  bush.rotation.y = Math.random() * Math.PI * 2;

  return bush;
};

const addBush = (position: Vector3, scale?: Vector3) => {
  const bush = createBush();
  bush.position.copy(position);
  if (scale) bush.scale.copy(scale);
  group.add(bush);
};

const distributeBushes = (count: number, areaSize: number) => {
  const placedBushes: Group[] = [];

  for (let i = 0; i < count; i++) {
    let position: Vector3;

    do {
      position = new Vector3(
        MathUtils.randFloatSpread(areaSize),
        MathUtils.randFloatSpread(areaSize),
        0
      );
    } while (!isPositionValid(position, placedBushes, 4) || position.distanceTo(new Vector3(0, 0, 0)) < 2);

    const bush = createBush();
    bush.position.copy(position);

    const bushBox = new Box3().setFromObject(bush);
    bushBoxes.push(bushBox);

    group.add(bush);
    placedBushes.push(bush);
  }
};

export const bushes = { group, bushBoxes, addBush, distributeBushes };