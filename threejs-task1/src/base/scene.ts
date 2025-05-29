import { FogExp2, Scene } from "three";
import { ground } from "../environment/ground";
import { ambientLight, dirLight, hemLight } from "../environment/light";
import { backgroundTexture } from '../environment/sky';
import { footsteps } from "../objects/player/steps";
import { bushes } from "../objects/static/bush";
import { clouds } from "../objects/static/cloud";
import { coins } from "../objects/animated/coin/coin";
import { hearts } from "../objects/animated/hearts/hearts";

export const scene = new Scene();

// ADD ENVIRONMENT
scene.add(ambientLight, dirLight, dirLight.target, hemLight, ground, footsteps.group, clouds.group, bushes.group, coins.group, hearts.group);
scene.background = backgroundTexture;
scene.fog = new FogExp2(0x006400, 0.02);