import { PerspectiveCamera } from "three";

export const camera = new PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 1);
camera.lookAt(0, 6, 0);