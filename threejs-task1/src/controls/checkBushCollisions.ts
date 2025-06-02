import { Box3 } from 'three';

export const checkBushCollision = (playerBox: Box3, bushBoxes: Box3[]): boolean => {
  for (const bushBox of bushBoxes) {
    if (playerBox.intersectsBox(bushBox)) {
      return true;
    }
  }
  return false;
};
