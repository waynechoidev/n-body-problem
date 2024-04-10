#include "main.common.wgsl"

struct Vertex {
  @location(0) pos: vec3f,
  @location(1) norm: vec3f,
  @location(2) tangent: vec3f,
  @location(3) tex: vec2f,
};

struct Uniforms {
  model: mat4x4f,
  view: mat4x4f,
  projection: mat4x4f,
};

@group(0) @binding(0) var<uniform> uni: Uniforms;

@vertex fn vs(
  vert: Vertex,
) -> VSOutput {
  var vsOut: VSOutput;
  let position = uni.projection * uni.view * uni.model * vec4f(vert.pos , 1.0);

  vsOut.position = position;
  vsOut.color = vec4f(position.xyz, 1.0);
  return vsOut;
}