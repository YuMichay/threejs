import { Group, Object3DEventMap, Vector3 } from "three";

export interface IBush {
  group: Group<Object3DEventMap>;
  addBush: (position: Vector3, scale?: Vector3) => void;
  distributeBushes: (count: number, areaSize: number) => void;
}