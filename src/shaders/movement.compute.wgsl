#include "common.wgsl"

@group(0) @binding(0) var<storage, read_write> objects: array<Vertex>;
@group(0) @binding(1) var<uniform> delta: f32;


@compute @workgroup_size(256) fn computeSomething(
    @builtin(global_invocation_id) global_invocation_id : vec3<u32>,
) {
    let numBodies:u32 = 3;
    let index = global_invocation_id.x;
    var body : Vertex = objects[index];
    var acceleration = vec3<f32>(0.0, 0.0, 0.0);

    for (var i = 0u; i < numBodies; i++) {
        if (i != index) {
            let other : Vertex = objects[i];
            let distance_vec = other.position - body.position;
            let distance = length(distance_vec);
            let force = (0.0000067 * body.mass * other.mass) / distance * distance;
            let direction = normalize(distance_vec);
            acceleration += direction * force / body.mass;
        }
    }

    body.velocity += acceleration * delta;
    body.position += body.velocity * delta;
    objects[index] = body;
}