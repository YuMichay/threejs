import { AmbientLight, DirectionalLight, HemisphereLight, Vector3 } from "three";

export const ambientLight = new AmbientLight(0xffffff, 1.5);
export const dirLight = new DirectionalLight(0xffffff, 1);
export const hemLight = new HemisphereLight(0x87CEEB, 0x000000, 1);

export const dirLightOffset = new Vector3(0, -15, 15);
dirLight.position.copy(dirLightOffset);

dirLight.target.position.set(0, 0, 0);
dirLight.castShadow = true;

dirLight.shadow.mapSize.set(2048, 2048);
dirLight.shadow.camera.near = 1;
dirLight.shadow.camera.far = 100;

dirLight.shadow.camera.left = -15;
dirLight.shadow.camera.right = 15;
dirLight.shadow.camera.top = 10;
dirLight.shadow.camera.bottom = -5;