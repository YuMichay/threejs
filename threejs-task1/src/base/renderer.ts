import { ACESFilmicToneMapping, WebGLRenderer } from "three";

export const renderer = new WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.toneMapping = ACESFilmicToneMapping;
renderer.toneMappingExposure = 1;

document.body.appendChild(renderer.domElement);