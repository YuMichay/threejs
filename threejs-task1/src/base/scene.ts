import { Scene } from "three";
import { ground } from "../environment/ground";
import { ambientLight, dirLight } from "../environment/light";
import { sky } from "../environment/sky";
import { footsteps } from "../objects/player/steps";
import { bushes } from "../objects/static/bush";
import { clouds } from "../objects/static/cloud";

export const scene = new Scene();
scene.rotation.x = -Math.PI / 2;

// ADD ENVIRONMENT
scene.add(ambientLight, dirLight, ground, sky, footsteps.group, clouds.group, bushes.group);