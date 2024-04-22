#include "main.common.wgsl"
#include "main.utils.wgsl"

@fragment fn fs(input: VSOutput) -> @location(0) vec4f {
  
  return vec4f(1.0, 0.0, 0.0, 1.0);
}