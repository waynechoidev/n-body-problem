struct VSOutput {
  @builtin(position) position: vec4f,
  @location(1) texCoord: vec2f,
  @location(2) posWorld: vec3f,
};

struct Vertex {
  @location(0) position: vec3f,
  @location(1) velocity: vec3f,
  @location(2) texCoord: vec2f,
  @location(3) radius: f32,
};

struct MatrixUniforms {
  view: mat4x4f,
  projection: mat4x4f,
};