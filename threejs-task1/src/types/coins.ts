import { Mesh, Vector3 } from "three";

export type CoinData = {
  object: Mesh;
  position: Vector3;
  collected: boolean;
};