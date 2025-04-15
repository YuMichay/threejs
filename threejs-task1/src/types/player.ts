import { AnimationAction, AnimationMixer, Group } from "three";

export interface Player {
  group: Group;
  render: () => void;
  mixer?: AnimationMixer;
  walkAction?: AnimationAction;
}
