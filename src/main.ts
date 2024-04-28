import billboard_compute from "@/shaders/billboard.compute.wgsl";
import movement_compute from "@/shaders/movement.compute.wgsl";
import main_vert from "@/shaders/main.vert.wgsl";
import main_frag from "@/shaders/main.frag.wgsl";
import bg_vert from "@/shaders/bg.vert.wgsl";
import bg_frag from "@/shaders/bg.frag.wgsl";
import RenderEnv from "@/engine/render-env";
import Pipeline from "@/engine/pipeline";
import { vec3, mat4, vec2 } from "@external/glmatrix/index";
import { toRadian } from "@external/glmatrix/common.js";
import Camera from "./engine/camera";
import Cubemap from "./engine/cubemap";
import Skybox from "./engine/geometry/skybox";
import { Vertex } from "./engine/common";
import { VertexBuffers } from "./engine/vertex-buffers";
import ComputePipeline from "./engine/compute-pipeline";
import Texture from "./engine/texture";
import { getRandomFloat } from "./utils";

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

  const starTex = new Texture(env.device);
  await starTex.initialize(baseUrl + "star.png");

  const sampler = env.device.createSampler({
    magFilter: "linear",
    minFilter: "linear",
    mipmapFilter: "linear",
  });

  // Pipelines
  const computeMovementPipeline = new ComputePipeline({
    label: "movement",
    device: env.device,
    computeShader: movement_compute,
  });

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
  const NUM_OF_OBJECT = 7;
  const objectVertices: Vertex[] = [];
  for (let i = 0; i < NUM_OF_OBJECT; ++i) {
    const mass = getRandomFloat(0.01, 0.05);
    objectVertices.push({
      position: vec3.fromValues(
        getRandomFloat(-5, 5),
        getRandomFloat(-5, 5),
        getRandomFloat(-5, 5)
      ),
      velocity: vec3.fromValues(0, 0, 0),
      color: vec3.fromValues(
        getRandomFloat(0, 1),
        getRandomFloat(0, 1),
        getRandomFloat(0, 1)
      ),
      texCoord: vec2.fromValues(0, 0),
      radius: mass * getRandomFloat(9, 11),
      mass: mass,
    });
  }
  // objectVertices.push({
  //   position: vec3.fromValues(0, 0, 0),
  //   velocity: vec3.fromValues(0, 0, 0),
  //   color: vec3.fromValues(0.8, 0.2, 0.2),
  //   texCoord: vec2.fromValues(0, 0),
  //   radius: 0.5,
  //   mass: 0.05,
  // });
  // objectVertices.push({
  //   position: vec3.fromValues(4, -1, -2),
  //   velocity: vec3.fromValues(0, 0, 0),
  //   color: vec3.fromValues(0.2, 0.8, 0.8),
  //   texCoord: vec2.fromValues(0, 0),
  //   radius: 0.2,
  //   mass: 0.02,
  // });
  // objectVertices.push({
  //   position: vec3.fromValues(-2, 4, -4),
  //   velocity: vec3.fromValues(0, 0, 0),
  //   color: vec3.fromValues(0.8, 0.8, 0.2),
  //   texCoord: vec2.fromValues(0, 0),
  //   radius: 0.3,
  //   mass: 0.03,
  // });

  const objectBuffers = new VertexBuffers(env.device, "object");
  await objectBuffers.initialize(objectVertices);

  // Buffers
  const objectNumBuffer = env.device.createBuffer({
    label: "frag uniforms",
    size: 1 * Uint32Array.BYTES_PER_ELEMENT,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
  });

  env.device?.queue.writeBuffer(
    objectNumBuffer,
    0,
    new Uint32Array([NUM_OF_OBJECT])
  );

  const matrixUniformBuffer = env.device.createBuffer({
    label: "matrix uniforms",
    size: (16 + 16) * Float32Array.BYTES_PER_ELEMENT,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
  });

  const timeUniformBuffer = env.device.createBuffer({
    label: "frag uniforms",
    size: 1 * Float32Array.BYTES_PER_ELEMENT,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
  });

  const cameraUniformBuffer = env.device.createBuffer({
    label: "camera uniforms",
    size: (3 + 1 + 3 + 1) * Float32Array.BYTES_PER_ELEMENT,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
  });

  const deltaUniformBuffer = env.device.createBuffer({
    label: "time uniform buffer",
    size: Float32Array.BYTES_PER_ELEMENT,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
  });

  // Bind Groups
  const bindGroup = env.device.createBindGroup({
    label: "bind group for object",
    layout: mainPipeline.getBindGroupLayout(0),
    entries: [
      { binding: 0, resource: { buffer: matrixUniformBuffer } },
      { binding: 1, resource: starTex.view },
      { binding: 2, resource: sampler },
      { binding: 3, resource: { buffer: timeUniformBuffer } },
    ],
  });

  const computeMovementBindGroup = env.device.createBindGroup({
    label: "compute movement bind group",
    layout: computeMovementPipeline.getBindGroupLayout(0),
    entries: [
      { binding: 0, resource: { buffer: objectBuffers.point } },
      { binding: 1, resource: { buffer: objectNumBuffer } },
      { binding: 2, resource: { buffer: deltaUniformBuffer } },
    ],
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
  mat4.perspective(projection, toRadian(90), WIDTH / HEIGHT, 0.1, 100);

  let previousFrameTime = 0;
  async function render() {
    const time = performance.now();
    const delta: number = time - previousFrameTime;
    previousFrameTime = time;

    env.device?.queue.writeBuffer(
      deltaUniformBuffer,
      0,
      new Float32Array([delta])
    );

    env.device?.queue.writeBuffer(
      timeUniformBuffer,
      0,
      new Float32Array([time * 0.001])
    );

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

    computeMovementPipeline.use(computePass);
    computePass.setBindGroup(0, computeMovementBindGroup);
    computePass.dispatchWorkgroups(1, 1);

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
