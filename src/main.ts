import main_vert from "@/shaders/main.vert.wgsl";
import main_frag from "@/shaders/main.frag.wgsl";
import RenderEnv from "@/engine/render-env";
import Shader from "@/engine/shader";
import Sphere from "@/engine/geometry/sphere";
import { getModelMatrix, loadImages } from "./engine/utils";
import { vec3, mat4 } from "@external/glmatrix/index";
import { toRadian } from "@external/glmatrix/common.js";
import Camera from "./engine/camera";

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

  // Load textures
  const baseUrl = "";
  const textures = await loadImages([
    baseUrl + "pbr/antique-grate1-height.jpg",
    baseUrl + "pbr/antique-grate1-albedo.jpg",
    baseUrl + "pbr/antique-grate1-normal-dx.jpg",
    baseUrl + "pbr/antique-grate1-metallic.jpg",
    baseUrl + "pbr/antique-grate1-roughness.jpg",
    baseUrl + "pbr/antique-grate1-ao.jpg",
    baseUrl + "cubemap/air_museum_playground_brdf.jpg",
  ]);
  const envCubemapTextures = await loadImages([
    baseUrl + "cubemap/air_museum_playground_env_px.jpg",
    baseUrl + "cubemap/air_museum_playground_env_nx.jpg",
    baseUrl + "cubemap/air_museum_playground_env_py.jpg",
    baseUrl + "cubemap/air_museum_playground_env_ny.jpg",
    baseUrl + "cubemap/air_museum_playground_env_pz.jpg",
    baseUrl + "cubemap/air_museum_playground_env_nz.jpg",
  ]);
  const irradianceCubemapTextures = await loadImages([
    baseUrl + "cubemap/air_museum_playground_irradiance_px.jpg",
    baseUrl + "cubemap/air_museum_playground_irradiance_nx.jpg",
    baseUrl + "cubemap/air_museum_playground_irradiance_py.jpg",
    baseUrl + "cubemap/air_museum_playground_irradiance_ny.jpg",
    baseUrl + "cubemap/air_museum_playground_irradiance_pz.jpg",
    baseUrl + "cubemap/air_museum_playground_irradiance_nz.jpg",
  ]);

  const mainShader = new Shader({
    label: "main",
    device: env.device,
    vertexShader: main_vert,
    fragmentShader: main_frag,
  });

  const camera = new Camera({
    position: vec3.fromValues(0, 0, 2.5),
    center: vec3.fromValues(0, 0, 1.5),
    up: vec3.fromValues(0, 1, 0),
  });

  const sphere = new Sphere(env.device, 1);

  const uniformBufferSize = (16 + 16 + 16) * 4;
  const uniformBuffer = env.device.createBuffer({
    label: "uniforms",
    size: uniformBufferSize,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
  });
  const bindGroup = env.device.createBindGroup({
    label: "bind group for object",
    layout: mainShader.getBindGroupLayout(0),
    entries: [{ binding: 0, resource: { buffer: uniformBuffer } }],
  });

  // Projcetion
  const projection = mat4.create();
  mat4.perspective(projection, toRadian(45), WIDTH / HEIGHT, 0.1, 100);

  // Controll
  const translation = vec3.fromValues(0, 0, 0);
  const scaling = vec3.fromValues(0.6, 0.6, 0.6);
  const rotation = vec3.fromValues(0, 0, 0);

  function render() {
    const model = getModelMatrix({ translation, scaling, rotation });
    const view = camera.getViewMatrix();
    env.device?.queue.writeBuffer(
      uniformBuffer,
      0,
      new Float32Array([...model, ...view, ...projection])
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
