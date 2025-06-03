import { Color, Mesh, MeshStandardMaterial, Object3D } from "three";

class CoinsManager {
  collectedCoins: number;
  collectStartTime: number | null;
  collectingCoin: Object3D | null;
  closestCoin: Object3D | null;
  closestDistance: number | null;

  constructor() {
    this.collectedCoins = 0;
    this.collectStartTime = null;
    this.collectingCoin = null;
    this.closestCoin = null;
    this.closestDistance = null;
  }

  getCoins() {
    return this.collectedCoins;
  }

  getCollectingCoin() {
    return this.collectingCoin;
  }

  setCollectingCoin(coin: Object3D | null) {
    this.collectingCoin = coin;
  }

  setClosestCoin(closestCoin: Object3D | null) {
    this.closestCoin = closestCoin;
  }

  setTime(time: number | null) {
    this.collectStartTime = time;
  }

  setCoinGlow(coin: Object3D, enable: boolean) {
    coin.traverse((child) => {
      if ((child as Mesh).isMesh) {
        const mesh = child as Mesh;
        const material = mesh.material as MeshStandardMaterial;
  
        if (enable) {
          material.emissive = new Color(0xFF0000);
          material.emissiveIntensity = 1.5;
        } else {
          material.emissive = new Color(0xFFFF00);
          material.emissiveIntensity = 0.5;
        }
      }
    });
  }

  collectCoins() {
    this.collectedCoins += 1;
  }

  reset() {
    this.collectedCoins = 0;
  }

  resetCollecting() {
    this.collectStartTime = null;
    this.collectingCoin = null;
    this.closestCoin = null;
    this.closestDistance = null;
  }
}

export const coinsManager = new CoinsManager();