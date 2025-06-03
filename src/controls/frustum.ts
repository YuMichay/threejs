import { Box3, Camera, Frustum, Matrix4, Object3D } from "three";

const frustum = new Frustum();
const cameraViewProjectionMatrix = new Matrix4();

export const updateFrustum = (camera: Camera) => {
  camera.updateMatrixWorld();
  cameraViewProjectionMatrix.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
  frustum.setFromProjectionMatrix(cameraViewProjectionMatrix);
}

export const isInFrustum = (object: Object3D): boolean => {
  const boundingBox = new Box3().setFromObject(object);
  return frustum.intersectsBox(boundingBox);
}
