import { ACESFilmicToneMapping, PCFSoftShadowMap, WebGLRenderer } from "three";

export const renderer = new WebGLRenderer({ antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.toneMapping = ACESFilmicToneMapping;
renderer.toneMappingExposure = 1;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = PCFSoftShadowMap;

document.body.appendChild(renderer.domElement);