import { Mesh } from 'three';
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader.js";

const legNames = [
  "ANIM_LEG_R_TOP",
  "ANIM_LEG_R_BOT",
  "ANIM_LEG_L_TOP",
  "ANIM_LEG_L_BOT"
];

export const positionIdle = (gltf: GLTF) => {
  if (gltf.animations && gltf.animations.length > 0) {
    gltf.scene.traverse((child) => {
      if (legNames.includes(child.name)) {
        child.rotation.set(0, 0, 0);
        child.position.set(0, 0, 0);
        child.scale.set(1, 1, 1);
      }

      if (child instanceof Mesh) {
        child.castShadow = true;
        child.receiveShadow = false;
      }
    });
  }
}