import { getRandomFloat, toRadian, Vertex } from "@/engine/utils";
import skybox from "@/engine/geometry/skybox";
import billboard_compute from "@/shaders/billboard.compute.wgsl";
import movement_compute from "@/shaders/movement.compute.wgsl";
import main_vert from "@/shaders/main.vert.wgsl";
import main_frag from "@/shaders/main.frag.wgsl";
import bg_vert from "@/shaders/bg.vert.wgsl";
import bg_frag from "@/shaders/bg.frag.wgsl";
import { mat4, vec2, vec3 } from "gl-matrix";
import Camera from "./camera";
import RendererBackend from "./renderer_backend";

export default class Renderer extends RendererBackend {
  private _mainPipeline!: GPURenderPipeline;
  private _bgPipeline!: GPURenderPipeline;
  private _computeMovementPipeline!: GPUComputePipeline;
  private _computeBillboardPipeline!: GPUComputePipeline;

  private _pointBuffer!: GPUBuffer;
  private _billboardBuffer!: GPUBuffer;
  private _skyboxVertexBuffer!: GPUBuffer;
  private _skyboxIndexBuffer!: GPUBuffer;
  private _skyboxIndicesLength!: number;

  private _objectNumBuffer!: GPUBuffer;
  private _matrixUniformBuffer!: GPUBuffer;
  private _timeUniformBuffer!: GPUBuffer;
  private _cameraUniformBuffer!: GPUBuffer;
  private _deltaUniformBuffer!: GPUBuffer;

  private _envCubemap!: GPUTexture;
  private _starTex!: GPUTexture;
  private _sampler!: GPUSampler;

  private _mainBindGroup!: GPUBindGroup;
  private _computeMovementBindGroup!: GPUBindGroup;
  private _computeBillboardBindGroup!: GPUBindGroup;
  private _bgBindGroup!: GPUBindGroup;

  private _camera!: Camera;
  private _projection!: mat4;

  private _commandEncoder!: GPUCommandEncoder;

  private readonly NUM_OF_OBJECT: number;

  constructor() {
    super();
    this.NUM_OF_OBJECT = 7;
  }

  // public methods
  public async initialize() {
    await this.requestDevice();
    await this.getCanvasContext();

    await this.createPipelines();

    await this.createVertexBuffers();
    await this.createOtherBuffers();

    await this.createTextures();

    await this.createBindGroups();

    await this.setMatrix();
  }

  public async run(time: number, delta: number) {
    await this.writeBuffers(time, delta);

    this._commandEncoder = this._device.createCommandEncoder({
      label: "encoder",
    });

    await this.compute();

    await this.draw();

    const commandBuffer: GPUCommandBuffer = this._commandEncoder.finish();
    this._device.queue.submit([commandBuffer]);
  }

  // private methods
  private async createPipelines() {
    const vertexBufferLayout: GPUVertexBufferLayout[] = [
      {
        arrayStride: 16 * Float32Array.BYTES_PER_ELEMENT,
        attributes: [
          { shaderLocation: 0, offset: 0, format: "float32x3" }, // position
          // padding * 1
          {
            shaderLocation: 1,
            offset: 4 * Float32Array.BYTES_PER_ELEMENT,
            format: "float32x3",
          }, // velocity
          // padding * 1
          {
            shaderLocation: 2,
            offset: 8 * Float32Array.BYTES_PER_ELEMENT,
            format: "float32x3",
          }, // color
          // padding * 1
          {
            shaderLocation: 3,
            offset: 12 * Float32Array.BYTES_PER_ELEMENT,
            format: "float32x2",
          }, // texCoord
          {
            shaderLocation: 4,
            offset: 14 * Float32Array.BYTES_PER_ELEMENT,
            format: "float32",
          }, // radius
          {
            shaderLocation: 5,
            offset: 15 * Float32Array.BYTES_PER_ELEMENT,
            format: "float32",
          }, // mass
        ],
      },
    ];
    this._mainPipeline = await this.createRenderPipeline({
      label: "main pipeline",
      vertexShader: main_vert,
      fragmentShader: main_frag,
      vertexBufferLayout,
    });
    this._bgPipeline = await this.createRenderPipeline({
      label: "bg pipeline",
      vertexShader: bg_vert,
      fragmentShader: bg_frag,
      vertexBufferLayout,
    });
    this._computeMovementPipeline = await this.createComputePipeline({
      label: "movement compute pipeline",
      computeShader: movement_compute,
    });
    this._computeBillboardPipeline = await this.createComputePipeline({
      label: "billboard compute pipeline",
      computeShader: billboard_compute,
    });
  }

  private async createVertexBuffers() {
    const objectVertices: Vertex[] = [];
    objectVertices.push({
      position: vec3.fromValues(0, 0, 2),
      velocity: vec3.fromValues(0, 0, 0),
      color: vec3.fromValues(0.8, 0.2, 0.2),
      texCoord: vec2.fromValues(0, 0),
      radius: 0.3,
      mass: 0.03,
    });
    for (let i = 0; i < this.NUM_OF_OBJECT - 1; ++i) {
      const mass = getRandomFloat(0.01, 0.03);
      objectVertices.push({
        position: vec3.fromValues(
          getRandomFloat(-5, 5),
          getRandomFloat(-5, 5),
          getRandomFloat(-5, 0)
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
    const objectVertexValues = new Float32Array(
      this.getVerticesData(objectVertices)
    );
    this._pointBuffer = this._device.createBuffer({
      label: "point vertex buffer",
      size: objectVertexValues.byteLength,
      usage:
        GPUBufferUsage.STORAGE |
        GPUBufferUsage.COPY_SRC |
        GPUBufferUsage.COPY_DST,
    });
    this._device.queue.writeBuffer(this._pointBuffer, 0, objectVertexValues);
    this._billboardBuffer = this._device.createBuffer({
      label: "billboard vertex buffer",
      size: objectVertexValues.byteLength * 6,
      usage:
        GPUBufferUsage.VERTEX |
        GPUBufferUsage.STORAGE |
        GPUBufferUsage.COPY_SRC |
        GPUBufferUsage.COPY_DST,
    });

    const skyboxData = skybox();
    const skyboxVertexValues = new Float32Array(
      this.getVerticesData(skyboxData.vertices)
    );
    this._skyboxVertexBuffer = this._device.createBuffer({
      label: "skybox vertex buffer",
      size: skyboxVertexValues.byteLength,
      usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
    });
    this._device.queue.writeBuffer(
      this._skyboxVertexBuffer,
      0,
      skyboxVertexValues
    );

    const skyboxIndexValues = new Uint32Array(skyboxData.indices);
    this._skyboxIndicesLength = skyboxData.indices.length;
    this._skyboxIndexBuffer = this._device.createBuffer({
      label: "skybox index buffer",
      size: skyboxIndexValues.byteLength,
      usage: GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST,
    });
    this._device.queue.writeBuffer(
      this._skyboxIndexBuffer,
      0,
      skyboxIndexValues
    );
  }

  private async createOtherBuffers() {
    this._objectNumBuffer = this._device.createBuffer({
      label: "frag uniforms",
      size: 1 * Uint32Array.BYTES_PER_ELEMENT,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });
    this._device?.queue.writeBuffer(
      this._objectNumBuffer,
      0,
      new Uint32Array([this.NUM_OF_OBJECT])
    );
    this._matrixUniformBuffer = this._device.createBuffer({
      label: "matrix uniforms",
      size: (16 + 16) * Float32Array.BYTES_PER_ELEMENT,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });
    this._timeUniformBuffer = this._device.createBuffer({
      label: "frag uniforms",
      size: 1 * Float32Array.BYTES_PER_ELEMENT,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });
    this._cameraUniformBuffer = this._device.createBuffer({
      label: "camera uniforms",
      size: (3 + 1 + 3 + 1) * Float32Array.BYTES_PER_ELEMENT,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });
    this._deltaUniformBuffer = this._device.createBuffer({
      label: "time uniform buffer",
      size: Float32Array.BYTES_PER_ELEMENT,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });
  }

  private async createTextures() {
    this._envCubemap = await this.createCubemapTexture([
      "cubemap/px.jpg",
      "cubemap/nx.jpg",
      "cubemap/py.jpg",
      "cubemap/ny.jpg",
      "cubemap/pz.jpg",
      "cubemap/nz.jpg",
    ]);
    this._starTex = await this.createTexture("star.png");
    this._sampler = this._device.createSampler({
      magFilter: "linear",
      minFilter: "linear",
      mipmapFilter: "linear",
    });
  }

  private async createBindGroups() {
    this._mainBindGroup = this._device.createBindGroup({
      label: "bind group for object",
      layout: this._mainPipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: this._matrixUniformBuffer } },
        { binding: 1, resource: this._starTex.createView() },
        { binding: 2, resource: this._sampler },
        { binding: 3, resource: { buffer: this._timeUniformBuffer } },
      ],
    });

    this._computeMovementBindGroup = this._device.createBindGroup({
      label: "compute movement bind group",
      layout: this._computeMovementPipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: this._pointBuffer } },
        { binding: 1, resource: { buffer: this._objectNumBuffer } },
        { binding: 2, resource: { buffer: this._deltaUniformBuffer } },
      ],
    });

    this._computeBillboardBindGroup = this._device.createBindGroup({
      label: "compute billboard bind group",
      layout: this._computeBillboardPipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: this._pointBuffer } },
        { binding: 1, resource: { buffer: this._billboardBuffer } },
        { binding: 2, resource: { buffer: this._cameraUniformBuffer } },
      ],
    });

    this._bgBindGroup = this._device.createBindGroup({
      label: "bind group for bg",
      layout: this._bgPipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: this._matrixUniformBuffer } },
        { binding: 1, resource: this._sampler },
        {
          binding: 2,
          resource: this._envCubemap.createView({ dimension: "cube" }),
        },
      ],
    });
  }

  private async setMatrix() {
    this._camera = new Camera({
      position: vec3.fromValues(0, 0, 2.5),
      center: vec3.fromValues(0, 0, 0),
      up: vec3.fromValues(0, 1, 0),
    });

    this._projection = mat4.create();
    mat4.perspective(
      this._projection,
      toRadian(90),
      this.WIDTH / this.HEIGHT,
      0.1,
      100
    );
  }

  private async writeBuffers(time: number, delta: number) {
    this._device.queue.writeBuffer(
      this._deltaUniformBuffer,
      0,
      new Float32Array([delta])
    );

    this._device.queue.writeBuffer(
      this._timeUniformBuffer,
      0,
      new Float32Array([time * 0.001])
    );

    const view = this._camera.getViewMatrix();
    this._device.queue.writeBuffer(
      this._matrixUniformBuffer,
      0,
      new Float32Array([...view, ...this._projection])
    );

    this._device.queue.writeBuffer(
      this._cameraUniformBuffer,
      0,
      new Float32Array([...this._camera.position, 0, ...this._camera.up, 0])
    );
  }

  private async compute() {
    const computePassEncoder = this._commandEncoder.beginComputePass({
      label: "compute pass",
    });

    computePassEncoder.setPipeline(this._computeMovementPipeline);
    computePassEncoder.setBindGroup(0, this._computeMovementBindGroup);
    computePassEncoder.dispatchWorkgroups(1, 1);

    computePassEncoder.setPipeline(this._computeBillboardPipeline);
    computePassEncoder.setBindGroup(0, this._computeBillboardBindGroup);
    computePassEncoder.dispatchWorkgroups(1, 1);

    computePassEncoder.end();
  }

  private async draw() {
    const renderPassDesc: GPURenderPassDescriptor =
      await this.getRenderPassDesc();
    const renderPassEncoder: GPURenderPassEncoder =
      this._commandEncoder.beginRenderPass(renderPassDesc);

    renderPassEncoder.setPipeline(this._bgPipeline);
    renderPassEncoder?.setBindGroup(0, this._bgBindGroup);
    renderPassEncoder.setVertexBuffer(0, this._skyboxVertexBuffer);
    renderPassEncoder.setIndexBuffer(this._skyboxIndexBuffer, "uint32");
    renderPassEncoder.drawIndexed(this._skyboxIndicesLength);

    renderPassEncoder.setPipeline(this._mainPipeline);
    renderPassEncoder?.setBindGroup(0, this._mainBindGroup);
    renderPassEncoder.setVertexBuffer(0, this._billboardBuffer);
    renderPassEncoder.draw(this.NUM_OF_OBJECT * 6);

    renderPassEncoder.end();
  }
}
