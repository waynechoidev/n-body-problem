#include "bg.common.wgsl"

@group(0) @binding(1) var mySampler: sampler;
@group(0) @binding(2) var envCubemap: texture_cube<f32>;

@fragment fn fs(input: VSOutput) -> @location(0) vec4f {
  let envColor:vec3f = textureSample(envCubemap, mySampler, input.posWorld).rgb;
  
  return vec4f(envColor, 1.0);
}