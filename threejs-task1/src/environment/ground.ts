import { PlaneGeometry, Mesh, MeshStandardMaterial } from 'three';

const groundGeometry = new PlaneGeometry(100, 100);
const groundMaterial = new MeshStandardMaterial({ color: 0x55aa55 });
export const ground = new Mesh(groundGeometry, groundMaterial);

ground.receiveShadow = true;