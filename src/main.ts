import main_vert from "@/shaders/main.vert.wgsl";
import main_frag from "@/shaders/main.frag.wgsl";
import RenderEnv from "@/engine/render-env";
import Shader from "@/engine/shader";
import Sphere from "@/engine/geometry/sphere";
import { vec3, mat4 } from "@external/glmatrix/index";
import { toRadian } from "@external/glmatrix/common.js";
import Camera from "./engine/camera";
import { MathUtils } from "./engine/math-utils";
import Texture from "./engine/texture";

const WIDTH = document.documentElement.clientWidth;
const HEIGHT = document.documentElement.clientHeight;

async function main() {
  // Initialize
  const env = new RenderEnv(
    document.querySelector("canvas") as HTMLCanvasElement
  );
  await env.initialize(WIDTH, HEIGHT);
  if (!env.device) {
    return;
  }

  // Textures
  const baseUrl = "";
  const albedoMap = new Texture(env.device);
  await albedoMap.initialize(baseUrl + "pbr/antique-grate1-albedo.jpg");
  const normalMap = new Texture(env.device);
  await normalMap.initialize(baseUrl + "pbr/antique-grate1-normal-dx.jpg");
  const metallicMap = new Texture(env.device);
  await metallicMap.initialize(baseUrl + "pbr/antique-grate1-metallic.jpg");
  const roughnessMap = new Texture(env.device);
  await roughnessMap.initialize(baseUrl + "pbr/antique-grate1-roughness.jpg");
  const aoMap = new Texture(env.device);
  await aoMap.initialize(baseUrl + "pbr/antique-grate1-ao.jpg");
  const brdfMap = new Texture(env.device);
  await brdfMap.initialize(baseUrl + "cubemap/air_museum_playground_brdf.jpg");

  const sampler = env.device.createSampler({
    magFilter: "linear",
    minFilter: "linear",
  });

  // Load textures

  // const envCubemapTextures = await loadImages([
  //   baseUrl + "cubemap/air_museum_playground_env_px.jpg",
  //   baseUrl + "cubemap/air_museum_playground_env_nx.jpg",
  //   baseUrl + "cubemap/air_museum_playground_env_py.jpg",
  //   baseUrl + "cubemap/air_museum_playground_env_ny.jpg",
  //   baseUrl + "cubemap/air_museum_playground_env_pz.jpg",
  //   baseUrl + "cubemap/air_museum_playground_env_nz.jpg",
  // ]);
  // const irradianceCubemapTextures = await loadImages([
  //   baseUrl + "cubemap/air_museum_playground_irradiance_px.jpg",
  //   baseUrl + "cubemap/air_museum_playground_irradiance_nx.jpg",
  //   baseUrl + "cubemap/air_museum_playground_irradiance_py.jpg",
  //   baseUrl + "cubemap/air_museum_playground_irradiance_ny.jpg",
  //   baseUrl + "cubemap/air_museum_playground_irradiance_pz.jpg",
  //   baseUrl + "cubemap/air_museum_playground_irradiance_nz.jpg",
  // ]);

  // Geometry
  const sphere = new Sphere(env.device, 1);

  // Shaders
  const mainShader = new Shader({
    label: "main",
    device: env.device,
    vertexShader: main_vert,
    fragmentShader: main_frag,
    bindGroupLayouts: [
      env.device.createBindGroupLayout({
        entries: [
          {
            // Vertex Uniforms
            binding: 0,
            visibility: GPUShaderStage.VERTEX,
            buffer: {
              type: "uniform",
            },
          },
          {
            // Fragment Uniform
            binding: 1,
            visibility: GPUShaderStage.FRAGMENT,
            buffer: {
              type: "uniform",
            },
          },
          {
            binding: 2,
            visibility: GPUShaderStage.FRAGMENT,
            sampler: {
              type: "filtering",
            },
          },
          {
            binding: 3,
            visibility: GPUShaderStage.FRAGMENT,
            texture: {
              sampleType: "float",
              viewDimension: "2d",
            },
          },
          {
            binding: 4,
            visibility: GPUShaderStage.FRAGMENT,
            texture: {
              sampleType: "float",
              viewDimension: "2d",
            },
          },
          {
            binding: 5,
            visibility: GPUShaderStage.FRAGMENT,
            texture: {
              sampleType: "float",
              viewDimension: "2d",
            },
          },
          {
            binding: 6,
            visibility: GPUShaderStage.FRAGMENT,
            texture: {
              sampleType: "float",
              viewDimension: "2d",
            },
          },
          {
            binding: 7,
            visibility: GPUShaderStage.FRAGMENT,
            texture: {
              sampleType: "float",
              viewDimension: "2d",
            },
          },
          {
            binding: 8,
            visibility: GPUShaderStage.FRAGMENT,
            texture: {
              sampleType: "float",
              viewDimension: "2d",
            },
          },
        ],
      }),
    ],
  });

  const vertexUniformBuffer = env.device.createBuffer({
    label: "vertex uniforms",
    size: (16 + 16 + 16 + 16) * Float32Array.BYTES_PER_ELEMENT,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
  });

  const fragmentUniformBuffer = env.device.createBuffer({
    label: "fragment uniforms",
    size: (3 + 1) * Float32Array.BYTES_PER_ELEMENT,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
  });

  const bindGroup = env.device.createBindGroup({
    label: "bind group for object",
    layout: mainShader.getBindGroupLayout(0),
    entries: [
      { binding: 0, resource: { buffer: vertexUniformBuffer } },
      { binding: 1, resource: { buffer: fragmentUniformBuffer } },
      { binding: 2, resource: sampler },
      { binding: 3, resource: albedoMap.view },
      { binding: 4, resource: normalMap.view },
      { binding: 5, resource: metallicMap.view },
      { binding: 6, resource: roughnessMap.view },
      { binding: 7, resource: aoMap.view },
      { binding: 8, resource: brdfMap.view },
    ],
  });

  // Model
  const translation = vec3.fromValues(0, 0, 0);
  const scaling = vec3.fromValues(0.7, 0.7, 0.7);
  const rotation = vec3.fromValues(0, 0, 0);

  // View
  const camera = new Camera({
    position: vec3.fromValues(0, 0, 2.5),
    center: vec3.fromValues(0, 0, 0),
    up: vec3.fromValues(0, 1, 0),
  });

  // Projection
  const projection = mat4.create();
  mat4.perspective(projection, toRadian(45), WIDTH / HEIGHT, 0.1, 100);

  function render() {
    const model = MathUtils.getModelMatrix({ translation, scaling, rotation });
    const view = camera.getViewMatrix();
    const invTransposedModel = mat4.clone(model);
    mat4.invert(invTransposedModel, invTransposedModel);
    mat4.transpose(invTransposedModel, invTransposedModel);
    env.device?.queue.writeBuffer(
      vertexUniformBuffer,
      0,
      new Float32Array([
        ...model,
        ...view,
        ...projection,
        ...invTransposedModel,
      ])
    );

    const position = vec3.clone(camera.position);
    env.device?.queue.writeBuffer(
      fragmentUniformBuffer,
      0,
      new Float32Array([...position, 0])
    );

    const pass = env.getPass();

    mainShader.use(pass);
    pass?.setBindGroup(0, bindGroup);
    sphere.draw(pass);

    env.endPass();
    requestAnimationFrame(render);
  }

  render();
}

main();
