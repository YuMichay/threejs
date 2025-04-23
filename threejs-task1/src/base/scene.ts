import { Scene } from "three";
import { ambientLight, dirLight } from "../environment/light";
import { ground } from "../environment/ground";
import { sky } from "../environment/sky";
import { footsteps } from "../objects/steps";

export const scene = new Scene();
scene.rotation.x = -Math.PI / 2;

// ADD ENVIRONMENT
scene.add(ambientLight, dirLight, ground, sky, footsteps.group);