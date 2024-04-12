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
  invTransposedModel: mat4x4f
};

@group(0) @binding(0) var<uniform> uni: Uniforms;
@group(0) @binding(3) var heightMap: texture_2d<f32>;

@vertex fn vs(
  input: Vertex,
) -> VSOutput {
  var output: VSOutput;
  // ignore scale
  output.normalWorld = normalize(uni.invTransposedModel * vec4f(input.norm, 1.0)).xyz;
  output.tangentWorld = normalize(uni.model * vec4f(input.tangent, 1.0)).xyz;
  output.texCoord = input.tex;

  let heightScale:f32 = 0.1;
  let height:f32 = textureSampleLevel(heightMap, mySampler, input.tex, 0).x;
  var newPos: vec3f = input.pos + (output.normalWorld * height * heightScale);

	output.posWorld = (uni.model * vec4f(newPos, 1.0)).xyz;
  output.position = uni.projection * uni.view * uni.model * vec4f(newPos , 1.0);
  return output;
}