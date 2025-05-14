import { Object3D, Vector3 } from 'three';

export const findClosestCoin = (coins: Object3D[], position: Vector3, radius: number): Object3D | null => {
  for (const coin of coins) {
    const distance = coin.position.distanceTo(position);
    if (distance < radius) {
      return coin;
    }
  }
  return null;
};