import { Mesh, Vector3 } from 'three';
import { CoinData } from '../types/coins';

export const findClosestCoin = (coinData: CoinData[], position: Vector3, radius: number): Mesh | null => {
  let closest: Mesh | null = null;
  let minDist = radius;

  for (const coin of coinData) {
    if (coin.collected) continue;

    const dist = coin.position.distanceTo(position);
    if (dist < minDist) {
      minDist = dist;
      closest = coin.object;
    }
  }

  return closest;
};