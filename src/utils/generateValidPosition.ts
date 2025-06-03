import { Vector3, Object3D } from 'three';

export function getRandomPosition(range = 20): Vector3 {
  return new Vector3(
    (Math.random() - 0.5) * range,
    (Math.random() - 0.5) * range,
    0
  );
}

export function isPositionValid(position: Vector3, objects: Object3D[], minDistance = 2): boolean {
  for (const obj of objects) {
    const objPos = new Vector3();
    obj.getWorldPosition(objPos);

    const dx = position.x - objPos.x;
    const dy = position.y - objPos.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < minDistance) {
      return false;
    }
  }

  return true;
}

export function generateValidPosition(staticObjects: Object3D[], range = 20, minDistance = 2): Vector3 {
  let position: Vector3;

  do {
    position = getRandomPosition(range);
  } while (!isPositionValid(position, staticObjects, minDistance));

  return position;
}