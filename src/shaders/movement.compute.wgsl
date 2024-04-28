#include "common.wgsl"

@group(0) @binding(0) var<storage, read_write> objects: array<Vertex>;
@group(0) @binding(1) var<uniform> numOfObject: u32;
@group(0) @binding(2) var<uniform> delta: f32;

const MIN_DISTANCE: f32 = 0.0001;

@compute @workgroup_size(256) fn computeSomething(
    @builtin(global_invocation_id) global_invocation_id : vec3u,
) {
    let index = global_invocation_id.x;
    var body : Vertex = objects[index];
    var acceleration = vec3f(0.0, 0.0, 0.0);

    for (var i = 0u; i < numOfObject; i++) {
        if (i != index) {
            let other : Vertex = objects[i];
            let distance_vec = other.position - body.position;
            var distance = length(distance_vec);
            if (distance < MIN_DISTANCE) {
                distance = MIN_DISTANCE;
            }
            let force = (0.00067 * body.mass * other.mass) / distance * distance;
            var direction = vec3(0.0, 0.0, 0.0);
            if (distance > MIN_DISTANCE) {
                direction = normalize(distance_vec);
            }
            acceleration += vec3(direction * force / body.mass);
        }
    }

    body.velocity += acceleration;
    body.position += body.velocity * delta;
    objects[index] = body;
}