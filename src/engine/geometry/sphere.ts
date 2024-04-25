import { vec2, vec3, mat4 } from "@external/glmatrix/index";
import Mesh from "./mesh";

export default class Sphere extends Mesh {
  constructor(device: GPUDevice, radius: number) {
    super(device, "sphere");

    const numOfSlices = 2;
    const numOfStacks = 2;

    const dTheta = (-2 * Math.PI) / numOfSlices;
    const dPhi = (-1 * Math.PI) / numOfStacks;

    for (let j = 0; j <= numOfStacks; j++) {
      const rotationMatrix = mat4.create();
      mat4.rotate(
        rotationMatrix,
        mat4.create(),
        dPhi * j,
        vec3.fromValues(0, 0, 1)
      );

      const stackStartPoint = vec3.create();
      vec3.transformMat4(
        stackStartPoint,
        vec3.fromValues(0, -radius, 0),
        rotationMatrix
      );

      for (let i = 0; i <= numOfSlices; i++) {
        const rotationMatrix = mat4.create();
        mat4.rotate(
          rotationMatrix,
          mat4.create(),
          dTheta * i,
          vec3.fromValues(0, 1, 0)
        );

        const position = vec3.create();
        vec3.transformMat4(position, stackStartPoint, rotationMatrix);

        const texCoord = vec2.fromValues(
          1 - i / numOfSlices,
          1 - j / numOfStacks
        );

        this._vertices.push({
          position,
          velocity: vec3.fromValues(0, 0, 0),
          texCoord,
          radius: 0,
        });
      }
    }

    for (let j = 0; j < numOfStacks; j++) {
      const offset = (numOfSlices + 1) * j;

      for (let i = 0; i < numOfSlices; i++) {
        const index1 = offset + i;
        const index2 = offset + i + 1;
        const index3 =
          offset + ((i + 1) % (numOfSlices + 1)) + (numOfSlices + 1);
        const index4 = index3 - 1;

        this._indices.push(index1);
        this._indices.push(index3);
        this._indices.push(index2);

        this._indices.push(index1);
        this._indices.push(index4);
        this._indices.push(index3);
      }
    }
    console.log(this._vertices);
    this.initialize();
  }
}
