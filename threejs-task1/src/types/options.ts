import { Object3D } from "three";

export type Options = {
  action?: (object: Object3D) => void;
  distance?: number;
  once?: boolean;
}