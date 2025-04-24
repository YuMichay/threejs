import {
  Group,
  MathUtils,
  Mesh,
  MeshStandardMaterial,
  SphereGeometry,
  Vector3
} from 'three';

const group = new Group();

const cloudMaterial = new MeshStandardMaterial({
  color: 0xffffff,
  roughness: 1,
  metalness: 0
});

const createCloud = (): Group => {
  const cloud = new Group();
  const baseCount = 3 + Math.floor(Math.random() * 3);

  for (let i = 0; i < baseCount; i++) {
    const radius = 1 + Math.random() * 0.5;
    const geo = new SphereGeometry(radius, 16, 16);
    const mesh = new Mesh(geo, cloudMaterial);

    mesh.position.set(
      (Math.random() - 0.5) * 3,
      (Math.random() - 0.5) * 1.5,
      (Math.random() - 0.5) * 2
    );

    mesh.scale.set(
      1 + Math.random() * 0.4,
      0.7 + Math.random() * 0.4,
      1 + Math.random() * 0.4
    );

    cloud.add(mesh);
  }

  cloud.scale.set(3, 3, 3);
  return cloud;
};

const addCloud = (position: Vector3, scale?: Vector3) => {
  const cloud = createCloud();
  cloud.position.copy(position);
  if (scale) cloud.scale.copy(scale);
  group.add(cloud);
};

const distributeClouds = (
  count: number,
  radius: number,
  heightRange: [number, number]
) => {
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * radius;

    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance;
    const z = MathUtils.randFloat(heightRange[0], heightRange[1]);

    const cloudGroup = new Group();
    const sphereCount = MathUtils.randInt(2, 3);
    for (let j = 0; j < sphereCount; j++) {
      const offset = new Vector3(
        MathUtils.randFloatSpread(3),
        MathUtils.randFloatSpread(3),
        MathUtils.randFloatSpread(1)
      );

      const scale = new Vector3(
        MathUtils.randFloat(6, 12),
        MathUtils.randFloat(6, 12),
        MathUtils.randFloat(2, 4)
      );

      const mesh = createCloud();
      mesh.position.copy(offset);
      mesh.scale.copy(scale);

      cloudGroup.add(mesh);
    }

    cloudGroup.position.set(x, y, z);
    clouds.group.add(cloudGroup);
  }
};

export const clouds = { group, addCloud, distributeClouds };
