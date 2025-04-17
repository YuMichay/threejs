import { ACESFilmicToneMapping, WebGLRenderer } from "three";

export const renderer = new WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.toneMapping = ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.5;

document.body.appendChild(renderer.domElement);