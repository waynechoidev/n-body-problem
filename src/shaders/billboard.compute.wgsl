#include "common.wgsl"

struct Camera {
  position: vec3f,
  up: vec3f
};

@group(0) @binding(0) var<storage, read_write> inputVertex: array<Vertex>;
@group(0) @binding(1) var<storage, read_write> outputVertex: array<Vertex>;
@group(0) @binding(2) var<uniform> camera: Camera;

@compute @workgroup_size(256)
fn computeSomething(
    @builtin(global_invocation_id) global_invocation_id : vec3<u32>,
) {
    let startIndex = i32(global_invocation_id.x);

    var pos = array<vec2f, 6>(
        vec2(1.0, 1.0),
        vec2(-1.0, 1.0),
        vec2(-1.0, -1.0),
        vec2(1.0, 1.0),
        vec2(-1.0, -1.0),
        vec2(1.0, -1.0),
    );

    var tex = array<vec2f, 6>(
        vec2(1.0, 0.0),
        vec2(0.0, 0.0),
        vec2(0.0, 1.0),
        vec2(1.0, 0.0),
        vec2(0.0, 1.0),
        vec2(1.0, 1.0),
    );

    let input = inputVertex[startIndex];

    let up: vec3f = camera.up; // Using camera up vector from uniform
    let front: vec3f = normalize(camera.position - input.position);
    let right: vec3f = cross(camera.up, front);

    for (var i = 0; i < 6; i++) {
        let newPos:vec3f = input.position + pos[i].x * right.xyz * input.radius + pos[i].y * up.xyz * input.radius;
        outputVertex[startIndex * 6 + i] = Vertex(newPos, input.velocity, tex[i], input.radius);
    }
}
