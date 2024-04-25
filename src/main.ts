import billboard_compute from "@/shaders/billboard.compute.wgsl";
import main_vert from "@/shaders/main.vert.wgsl";
import main_frag from "@/shaders/main.frag.wgsl";
import bg_vert from "@/shaders/bg.vert.wgsl";
import bg_frag from "@/shaders/bg.frag.wgsl";
import RenderEnv from "@/engine/render-env";
import Pipeline from "@/engine/pipeline";
import { vec3, mat4, vec2 } from "@external/glmatrix/index";
import { toRadian } from "@external/glmatrix/common.js";
import Camera from "./engine/camera";
import { MathUtils } from "./engine/math-utils";
import Cubemap from "./engine/cubemap";
import Skybox from "./engine/geometry/skybox";
import { Vertex } from "./engine/common";
import { VertexBuffers } from "./engine/vertex-buffers";
import Sphere from "./engine/geometry/sphere";
import ComputePipeline from "./engine/compute-pipeline";

const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;

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
    baseUrl + "cubemap/px.jpg",
    baseUrl + "cubemap/nx.jpg",
    baseUrl + "cubemap/py.jpg",
    baseUrl + "cubemap/ny.jpg",
    baseUrl + "cubemap/pz.jpg",
    baseUrl + "cubemap/nz.jpg",
  ]);

  const sampler = env.device.createSampler({
    magFilter: "linear",
    minFilter: "linear",
    mipmapFilter: "linear",
  });

  // Pipelines
  const computeBillboardPipeline = new ComputePipeline({
    label: "billboard",
    device: env.device,
    computeShader: billboard_compute,
  });

  const mainPipeline = new Pipeline({
    label: "main",
    device: env.device,
    vertexShader: main_vert,
    fragmentShader: main_frag,
  });

  const bgPipeline = new Pipeline({
    label: "bg",
    device: env.device,
    vertexShader: bg_vert,
    fragmentShader: bg_frag,
  });

  // Geometry
  const skybox = new Skybox(env.device);

  // Vertex buffers
  const NUM_OF_OBJECT = 2;
  const objectVertices: Vertex[] = [];
  objectVertices.push({
    position: vec3.fromValues(-5, 0, -7),
    velocity: vec3.fromValues(0, 0, 0),
    texCoord: vec2.fromValues(0, 0),
    radius: 1,
  });
  objectVertices.push({
    position: vec3.fromValues(5, 0, -7),
    velocity: vec3.fromValues(0, 0, 0),
    texCoord: vec2.fromValues(0, 0),
    radius: 1,
  });

  const objectBuffers = new VertexBuffers(env.device, "object");
  await objectBuffers.initialize(objectVertices);

  // Buffers
  const matrixUniformBuffer = env.device.createBuffer({
    label: "vertex uniforms",
    size: (16 + 16) * Float32Array.BYTES_PER_ELEMENT,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
  });

  const cameraUniformBuffer = env.device.createBuffer({
    label: "vertex uniforms",
    size: (3 + 1 + 3 + 1) * Float32Array.BYTES_PER_ELEMENT,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
  });

  // Bind Groups
  const bindGroup = env.device.createBindGroup({
    label: "bind group for object",
    layout: mainPipeline.getBindGroupLayout(0),
    entries: [{ binding: 0, resource: { buffer: matrixUniformBuffer } }],
  });

  const computeBillboardBindGroup = env.device.createBindGroup({
    label: "compute billboard bind group",
    layout: computeBillboardPipeline.getBindGroupLayout(0),
    entries: [
      { binding: 0, resource: { buffer: objectBuffers.point } },
      { binding: 1, resource: { buffer: objectBuffers.billboard } },
      { binding: 2, resource: { buffer: cameraUniformBuffer } },
    ],
  });

  const bgBindGroup = env.device.createBindGroup({
    label: "bind group for object",
    layout: bgPipeline.getBindGroupLayout(0),
    entries: [
      { binding: 0, resource: { buffer: matrixUniformBuffer } },
      { binding: 1, resource: sampler },
      { binding: 2, resource: envCubemap.view },
    ],
  });

  // View
  const camera = new Camera({
    position: vec3.fromValues(0, 0, 2.5),
    center: vec3.fromValues(0, 0, 0),
    up: vec3.fromValues(0, 1, 0),
  });

  // Projection
  const projection = mat4.create();
  mat4.perspective(projection, toRadian(45), WIDTH / HEIGHT, 0.1, 100);

  async function render() {
    const view = camera.getViewMatrix();
    env.device?.queue.writeBuffer(
      matrixUniformBuffer,
      0,
      new Float32Array([...view, ...projection])
    );

    env.device?.queue.writeBuffer(
      cameraUniformBuffer,
      0,
      new Float32Array([...camera.position, 0, ...camera.up, 0])
    );

    env.setEncoder();

    // Compute
    const computePass = env.getComputePass();

    computeBillboardPipeline.use(computePass);
    computePass.setBindGroup(0, computeBillboardBindGroup);
    computePass.dispatchWorkgroups(1, 1);

    computePass.end();

    // Graphics
    const mainPass = env.getGraphicsPass();

    bgPipeline.use(mainPass);
    mainPass?.setBindGroup(0, bgBindGroup);
    skybox.draw(mainPass);

    mainPipeline.use(mainPass);
    mainPass?.setBindGroup(0, bindGroup);
    mainPass.setVertexBuffer(0, objectBuffers.billboard);
    mainPass.draw(NUM_OF_OBJECT * 6);

    mainPass.end();

    env.finishEncoder();

    requestAnimationFrame(render);
  }

  render();
}

main();
