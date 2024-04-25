import { vec2, vec3 } from "@external/glmatrix/index";
import Mesh from "./mesh";

export default class Skybox extends Mesh {
  constructor(device: GPUDevice) {
    super(device, "skybox");

    this._vertices.push({
      position: vec3.fromValues(-1, 1, -1),
      velocity: vec3.fromValues(0, 0, 0),
      texCoord: vec2.fromValues(0, 0),
      radius: 0,
    });
    this._vertices.push({
      position: vec3.fromValues(-1, -1, -1),
      velocity: vec3.fromValues(0, 0, 0),
      texCoord: vec2.fromValues(0, 0),
      radius: 0,
    });
    this._vertices.push({
      position: vec3.fromValues(1, 1, -1),
      velocity: vec3.fromValues(0, 0, 0),
      texCoord: vec2.fromValues(0, 0),
      radius: 0,
    });
    this._vertices.push({
      position: vec3.fromValues(1, -1, -1),
      velocity: vec3.fromValues(0, 0, 0),
      texCoord: vec2.fromValues(0, 0),
      radius: 0,
    });

    this._vertices.push({
      position: vec3.fromValues(-1, 1, 1),
      velocity: vec3.fromValues(0, 0, 0),
      texCoord: vec2.fromValues(0, 0),
      radius: 0,
    });
    this._vertices.push({
      position: vec3.fromValues(1, 1, 1),
      velocity: vec3.fromValues(0, 0, 0),
      texCoord: vec2.fromValues(0, 0),
      radius: 0,
    });
    this._vertices.push({
      position: vec3.fromValues(-1, -1, 1),
      velocity: vec3.fromValues(0, 0, 0),
      texCoord: vec2.fromValues(0, 0),
      radius: 0,
    });
    this._vertices.push({
      position: vec3.fromValues(1, -1, 1),
      velocity: vec3.fromValues(0, 0, 0),
      texCoord: vec2.fromValues(0, 0),
      radius: 0,
    });

    this._indices.push(
      0,
      1,
      2,
      2,
      1,
      3, // Front
      2,
      3,
      5,
      5,
      3,
      7, // Right
      5,
      7,
      4,
      4,
      7,
      6, // Back
      4,
      6,
      0,
      0,
      6,
      1, // Left
      4,
      0,
      5,
      5,
      0,
      2, // Top
      1,
      6,
      3,
      3,
      6,
      7 // Bottom
    );

    this.initialize();
  }
}
