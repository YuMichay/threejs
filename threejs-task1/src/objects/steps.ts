import { CircleGeometry, Group, Mesh, MeshBasicMaterial, TextureLoader, Vector3 } from "three";

import { FADE_DURATION, STEPS_MS } from "../config/constants";
import { Step } from "../types/step";

const group = new Group();

const textureLoader = new TextureLoader();
const texture = textureLoader.load('/assets/footstep.png');

let prevTime = 0;
let flipStep = false;

const activeSteps: Step[] = [];

const render = (time: number, position: Vector3, direction: Vector3) => {
  if (prevTime + STEPS_MS > time) {
    return;
  }
  prevTime = time;

  const side = new Vector3(-direction.y, direction.x, 0).normalize();
  const stepOffset = 0.15;
  if (flipStep) side.multiplyScalar(stepOffset);
  else side.multiplyScalar(-stepOffset);

  const footPosition = position.clone().add(side);
  
  const material = new MeshBasicMaterial({
    map: texture,
    transparent: true,
    opacity: 1,
  });
  const newMesh = new Mesh(new CircleGeometry(0.05), material);
  newMesh.material.map = texture;
  newMesh.material.needsUpdate = true;
  newMesh.position.copy(footPosition);
  newMesh.position.z = 0.1;

  group.add(newMesh);
  activeSteps.push({ mesh: newMesh, birthTime: time });
  flipStep = !flipStep;
}

const update = (time: number) => {
  for (let i = activeSteps.length - 1; i >= 0; i--) {
    const step = activeSteps[i];
    const age = time - step.birthTime;

    if (age >= FADE_DURATION) {
      group.remove(step.mesh);
      activeSteps.splice(i, 1);
    } else {
      const opacity = 1 - age / FADE_DURATION;
      const material = step.mesh.material as MeshBasicMaterial;
      material.opacity = opacity;
    }
  }
};

export const footsteps = { group, render, update };