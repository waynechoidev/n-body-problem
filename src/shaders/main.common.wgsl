struct VSOutput {
  @builtin(position) position: vec4f,
  @location(0) posWorld: vec3f,
  @location(1) normalWorld: vec3f,
  @location(2) tangentWorld: vec3f,
  @location(3) texCoord: vec2f,
};

@group(0) @binding(2) var mySampler: sampler;
