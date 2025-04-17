import { AnimationAction, AnimationMixer, Group, Scene } from "three";

export interface Player {
  group: Group;
  render: (scene: Scene) => void;
  mixer?: AnimationMixer;
  walkAction?: AnimationAction;
}
