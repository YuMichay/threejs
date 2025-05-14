import { Mesh, MeshBasicMaterial, Vector3 } from 'three';

export const updateCollectLine = (playerPos: Vector3, coinPos: Vector3, time: number, line: Mesh) => {
  const start = playerPos.clone();
  start.z += 1;
  const end = coinPos.clone();
  end.z += 0.3;
  const center = new Vector3().addVectors(start, end).multiplyScalar(0.5);

  line.position.copy(center);
  line.scale.set(3, 1.2, 1);
  line.rotation.set(0, 0, Math.PI / 2);
  line.visible = true;

  const pulse = Math.sin(time * 0.01) * 0.3 + 0.7;
  (line.material as MeshBasicMaterial).opacity = pulse;
};
