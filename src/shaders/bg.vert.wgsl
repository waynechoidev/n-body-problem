#include "bg.common.wgsl"

struct Vertex {
  @location(0) pos: vec3f,
  @location(1) norm: vec3f,
  @location(2) tangent: vec3f,
  @location(3) tex: vec2f,
};

struct Uniforms {
  view: mat4x4f,
  projection: mat4x4f
};

@group(0) @binding(0) var<uniform> uni: Uniforms;

@vertex fn vs(
  input: Vertex,
) -> VSOutput {
  let rotView: mat4x4<f32> = mat4x4<f32>(
    vec4f(uni.view[0].xyz, 0.0),
    vec4f(uni.view[1].xyz, 0.0), 
    vec4f(uni.view[2].xyz, 0.0),
    vec4f(0.0, 0.0, 0.0, 1.0)
  );
  let clipPos:vec4f = uni.projection * uni.view * vec4f(input.pos * 20.0, 1.0);

  var output: VSOutput;
  output.posWorld = input.pos;
  output.position = clipPos.xyww;
  return output;
}