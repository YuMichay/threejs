import { AmbientLight, DirectionalLight } from "three";

export const ambientLight = new AmbientLight(0xffffff, 1);
export const dirLight = new DirectionalLight(0xffffff, 1);
dirLight.position.set(10, 10, 5);
dirLight.castShadow = true;