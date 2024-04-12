#include "main.common.wgsl"
#include "main.utils.wgsl"

struct Uniforms {
  camPos: vec3f,
  padding: f32
};

@group(0) @binding(1) var<uniform> uni: Uniforms;

@group(0) @binding(4) var albedoMap: texture_2d<f32>;
@group(0) @binding(5) var normalMap: texture_2d<f32>;
@group(0) @binding(6) var metallicMap: texture_2d<f32>;
@group(0) @binding(7) var roughnessMap: texture_2d<f32>;
@group(0) @binding(8) var aoMap: texture_2d<f32>;
@group(0) @binding(9) var brdfLUT: texture_2d<f32>;

@group(0) @binding(10) var envCubemap: texture_cube<f32>;
@group(0) @binding(11) var irradianceCubemap: texture_cube<f32>;


@fragment fn fs(input: VSOutput) -> @location(0) vec4f {
  // Apply gamma correction to the sampled albedo texture to convert it from sRGB space to linear space
  let albedo:vec3f = pow(textureSample(albedoMap, mySampler, input.texCoord).rgb, vec3(2.2));
  let metallic:f32 = textureSample(metallicMap, mySampler, input.texCoord).r;
  let roughness:f32 = textureSample(roughnessMap, mySampler, input.texCoord).r;
  let ao:f32 = textureSample(aoMap, mySampler, input.texCoord).r;

  let normalWorld:vec3f = normalize(input.normalWorld);
  // Adjust the tangent vector to ensure it is perpendicular to the surface
  // by removing the component parallel to the normal vector.
  let tangent:vec3f = normalize(input.tangentWorld - dot(input.tangentWorld, normalWorld) * normalWorld);
  let bitangent:vec3f = cross(normalWorld, tangent);
  let TBN:mat3x3f = mat3x3f(tangent, bitangent, normalWorld);
  let N:vec3f = normalize(TBN * (textureSample(normalMap, mySampler, input.texCoord).xyz * 2.0 - 1.0));

  let V:vec3f = normalize(uni.camPos - input.posWorld);
  let R:vec3f = reflect(-V, N);

  let lightRadiances:vec3f = vec3f(10.0);

  var F0:vec3f = vec3f(0.04);
  F0 = mix(F0, albedo, metallic);

  // use camPos instead of lightPos
  let L:vec3f = normalize(uni.camPos - input.posWorld);
  let H:vec3f = normalize(V + L);
  let distance:f32 = length(uni.camPos - input.posWorld);
  let attenuation:f32 = 1.0 / (distance * distance);
  let radiance:vec3f = lightRadiances * attenuation;

  var F:vec3f = fresnelSchlick(max(dot(H, V), 0.0), F0);
  let G:f32 = GeometrySmith(N, V, L, roughness);
  let NDF:f32 = DistributionGGX(N, H, roughness);

  let numerator:vec3f = NDF * G * F;
  // + 0.0001 to prevent divide by zero
  let denominator:f32 = 4.0 * max(dot(N, V), 0.0) * max(dot(N, L), 0.0) + 0.0001;
  var specular:vec3f = numerator / denominator;

  var kS:vec3f = F;

  var kD:vec3f = (vec3(1.0) - kS) * (1.0 - metallic);

  // scale light by NdotL
  let NdotL:f32 = max(dot(N, L), 0.0);

  let directLight:vec3f = (kD * albedo / PI + specular) * radiance * NdotL;

  // ambient lighting (we now use IBL as the ambient term)
  F = fresnelSchlickRoughness(max(dot(N, V), 0.0), F0, roughness);

  kS = F;
  kD = 1.0 - kS;
  kD *= 1.0 - metallic;

  // Apply gamma correction to the sampled irradianceCubemap texture to convert it from sRGB space to linear space
  let irradiance:vec3f = pow(textureSample(irradianceCubemap, mySampler, N).rgb, vec3(2.2));
  let diffuse:vec3f = irradiance * albedo;

  // sample both the pre-filter map and the BRDF lut and combine them together as per the Split-Sum approximation to get the IBL specular part.
  const MAX_REFLECTION_LOD:f32 = 4.0;
  // Apply gamma correction to the sampled envCubemap texture to convert it from sRGB space to linear space
  let prefilteredColor:vec3f = pow(textureSampleLevel(envCubemap, mySampler, R,  roughness * MAX_REFLECTION_LOD).rgb, vec3(2.2));
  let brdf:vec2f  = textureSample(brdfLUT, mySampler, vec2(max(dot(N, V), 0.0), roughness)).rg;
  specular = prefilteredColor * (F * brdf.x + brdf.y);

  let ambient:vec3f = (kD * diffuse + specular) * ao;

  var color:vec3f = directLight + ambient;

  // HDR tonemapping
  color = color / (color + vec3(1.0));
  // gamma correct
  color = pow(color, vec3(1.0/2.2));

  return vec4f(color, 1.0);
}