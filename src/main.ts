import main_vert from "@/shaders/main.vert.wgsl";
import main_frag from "@/shaders/main.frag.wgsl";
import bg_vert from "@/shaders/bg.vert.wgsl";
import bg_frag from "@/shaders/bg.frag.wgsl";
import RenderEnv from "@/engine/render-env";
import Shader from "@/engine/shader";
import Sphere from "@/engine/geometry/sphere";
import { vec3, mat4 } from "@external/glmatrix/index";
import { toRadian } from "@external/glmatrix/common.js";
import Camera from "./engine/camera";
import { MathUtils } from "./engine/math-utils";
import Cubemap from "./engine/cubemap";
import Skybox from "./engine/geometry/skybox";

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
  const envCubemap = new Cubemap(env.device);
  await envCubemap.initialize([
    baseUrl + "cubemap/air_museum_playground_env_px.jpg",
    baseUrl + "cubemap/air_museum_playground_env_nx.jpg",
    baseUrl + "cubemap/air_museum_playground_env_py.jpg",
    baseUrl + "cubemap/air_museum_playground_env_ny.jpg",
    baseUrl + "cubemap/air_museum_playground_env_pz.jpg",
    baseUrl + "cubemap/air_museum_playground_env_nz.jpg",
  ]);

  const sampler = env.device.createSampler({
    magFilter: "linear",
    minFilter: "linear",
    mipmapFilter: "linear",
  });

  // Geometry
  const sphere = new Sphere(env.device, WIDTH >= 500 ? 0.6 : 0.4);
  const skybox = new Skybox(env.device);

  // Shaders
  const mainShader = new Shader({
    label: "main",
    device: env.device,
    vertexShader: main_vert,
    fragmentShader: main_frag,
  });

  const bgShader = new Shader({
    label: "bg",
    device: env.device,
    vertexShader: bg_vert,
    fragmentShader: bg_frag,
  });

  const vertexUniformBuffer = env.device.createBuffer({
    label: "vertex uniforms",
    size: (16 + 16 + 16 + 16) * Float32Array.BYTES_PER_ELEMENT,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
  });

  const bgUniformBuffer = env.device.createBuffer({
    label: "vertex uniforms",
    size: (16 + 16) * Float32Array.BYTES_PER_ELEMENT,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
  });

  const bindGroup = env.device.createBindGroup({
    label: "bind group for object",
    layout: mainShader.getBindGroupLayout(0),
    entries: [{ binding: 0, resource: { buffer: vertexUniformBuffer } }],
  });

  const bgBindGroup = env.device.createBindGroup({
    label: "bind group for object",
    layout: bgShader.getBindGroupLayout(0),
    entries: [
      { binding: 0, resource: { buffer: bgUniformBuffer } },
      { binding: 1, resource: sampler },
      { binding: 2, resource: envCubemap.view },
    ],
  });

  // Model
  const translation = vec3.fromValues(0, 0, 0);
  const scaling = vec3.fromValues(1.0, 1.0, 1.0);
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
    env.device?.queue.writeBuffer(
      bgUniformBuffer,
      0,
      new Float32Array([...view, ...projection])
    );

    const pass = env.getPass();

    bgShader.use(pass);
    pass?.setBindGroup(0, bgBindGroup);
    skybox.draw(pass);

    mainShader.use(pass);
    pass?.setBindGroup(0, bindGroup);
    sphere.draw(pass);

    env.endPass();
    requestAnimationFrame(render);
  }

  render();
}

main();
