import { Vertex } from "@/engine/utils";
import { vec2, vec3 } from "gl-matrix";

export default function skybox() {
  const vertices: Vertex[] = [];
  const indices: number[] = [];

  vertices.push({
    position: vec3.fromValues(-1, 1, -1),
    velocity: vec3.fromValues(0, 0, 0),
    color: vec3.fromValues(0, 0, 0),
    texCoord: vec2.fromValues(0, 0),
    radius: 0,
    mass: 0,
  });
  vertices.push({
    position: vec3.fromValues(-1, -1, -1),
    velocity: vec3.fromValues(0, 0, 0),
    color: vec3.fromValues(0, 0, 0),
    texCoord: vec2.fromValues(0, 0),
    radius: 0,
    mass: 0,
  });
  vertices.push({
    position: vec3.fromValues(1, 1, -1),
    velocity: vec3.fromValues(0, 0, 0),
    color: vec3.fromValues(0, 0, 0),
    texCoord: vec2.fromValues(0, 0),
    radius: 0,
    mass: 0,
  });
  vertices.push({
    position: vec3.fromValues(1, -1, -1),
    velocity: vec3.fromValues(0, 0, 0),
    color: vec3.fromValues(0, 0, 0),
    texCoord: vec2.fromValues(0, 0),
    radius: 0,
    mass: 0,
  });

  vertices.push({
    position: vec3.fromValues(-1, 1, 1),
    velocity: vec3.fromValues(0, 0, 0),
    color: vec3.fromValues(0, 0, 0),
    texCoord: vec2.fromValues(0, 0),
    radius: 0,
    mass: 0,
  });
  vertices.push({
    position: vec3.fromValues(1, 1, 1),
    velocity: vec3.fromValues(0, 0, 0),
    color: vec3.fromValues(0, 0, 0),
    texCoord: vec2.fromValues(0, 0),
    radius: 0,
    mass: 0,
  });
  vertices.push({
    position: vec3.fromValues(-1, -1, 1),
    velocity: vec3.fromValues(0, 0, 0),
    color: vec3.fromValues(0, 0, 0),
    texCoord: vec2.fromValues(0, 0),
    radius: 0,
    mass: 0,
  });
  vertices.push({
    position: vec3.fromValues(1, -1, 1),
    velocity: vec3.fromValues(0, 0, 0),
    color: vec3.fromValues(0, 0, 0),
    texCoord: vec2.fromValues(0, 0),
    radius: 0,
    mass: 0,
  });

  indices.push(
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

  return { vertices, indices };
}
