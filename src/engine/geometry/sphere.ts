import { vec2, vec3, mat4 } from "@external/glmatrix/index";
import Mesh from "./mesh";

export default class Sphere extends Mesh {
  constructor(device: GPUDevice, radius: number) {
    super(device, "sphere");

    const numOfSlices = 500;
    const numOfStacks = 500;

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

        const normal = vec3.create();
        vec3.normalize(normal, position);

        const texCoord = vec2.fromValues(
          1 - i / numOfSlices,
          1 - j / numOfStacks
        );

        this._vertices.push({
          position,
          normal,
          texCoord,
          tangent: vec3.create(),
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

        // Calculate tangents
        const v1 = this._vertices[index1].position;
        const v2 = this._vertices[index2].position;
        const v3 = this._vertices[index3].position;
        const v4 = this._vertices[index4].position;

        const tangent1 = this.calculateTangent(
          v1,
          v2,
          v3,
          this._vertices[index1].texCoord,
          this._vertices[index2].texCoord,
          this._vertices[index3].texCoord
        );
        const tangent2 = this.calculateTangent(
          v1,
          v3,
          v4,
          this._vertices[index1].texCoord,
          this._vertices[index3].texCoord,
          this._vertices[index4].texCoord
        );

        this._vertices[index1].tangent = tangent1;
        this._vertices[index2].tangent = tangent1;
        this._vertices[index3].tangent = tangent1;

        this._vertices[index1].tangent = tangent2;
        this._vertices[index3].tangent = tangent2;
        this._vertices[index4].tangent = tangent2;
      }
    }

    this.initialize();
  }

  private calculateTangent(
    pos1: vec3,
    pos2: vec3,
    pos3: vec3,
    uv1: vec2,
    uv2: vec2,
    uv3: vec2
  ): vec3 {
    const edge1 = vec3.create();
    vec3.subtract(edge1, pos2, pos1);
    const edge2 = vec3.create();
    vec3.subtract(edge2, pos3, pos1);

    const deltaUV1 = vec2.create();
    vec2.subtract(deltaUV1, uv2, uv1);
    const deltaUV2 = vec2.create();
    vec2.subtract(deltaUV2, uv3, uv1);

    const f = 1.0 / (deltaUV1[0] * deltaUV2[1] - deltaUV2[0] * deltaUV1[1]);

    const tangent = vec3.create();
    tangent[0] = f * (deltaUV2[1] * edge1[0] - deltaUV1[1] * edge2[0]);
    tangent[1] = f * (deltaUV2[1] * edge1[1] - deltaUV1[1] * edge2[1]);
    tangent[2] = f * (deltaUV2[1] * edge1[2] - deltaUV1[1] * edge2[2]);

    return tangent;
  }
}
