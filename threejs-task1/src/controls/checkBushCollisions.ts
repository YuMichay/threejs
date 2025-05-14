import { Box3, Object3D, Object3DEventMap } from 'three';

export const checkBushCollision = (playerBox: Box3, bushes: Object3D<Object3DEventMap>[]): boolean => {
  for (const bush of bushes) {
    const bushBox = new Box3().setFromObject(bush);
    if (playerBox.intersectsBox(bushBox)) {
      return true;
    }
  }
  return false;
};
