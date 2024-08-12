import { generateMips, loadImageBitmap, Vertex } from "@/engine/utils";

export default abstract class RendererBackend {
  protected _device!: GPUDevice;
  protected _canvasContext!: GPUCanvasContext;

  protected readonly WIDTH: number;
  protected readonly HEIGHT: number;

  constructor() {
    this.WIDTH = window.innerWidth;
    this.HEIGHT = window.innerHeight;
  }

  abstract initialize(): Promise<void>;
  abstract run(time: number, delta: number): Promise<void>;

  protected async requestDevice() {
    const adapter: GPUAdapter | null = await navigator.gpu?.requestAdapter();
    this._device = await adapter?.requestDevice()!;
    if (!this._device) {
      console.error("Cannot find a device");
      alert("Your device does not support WebGPU");
    }
  }

  protected async getCanvasContext() {
    const canvas = document.querySelector("canvas") as HTMLCanvasElement;
    if (!canvas) console.error("Cannot find a canvas");

    canvas.width = this.WIDTH;
    canvas.height = this.HEIGHT;

    this._canvasContext = canvas.getContext("webgpu") as GPUCanvasContext;
    if (!this._canvasContext) console.error("Cannot find a canvas context");

    const canvasConfig: GPUCanvasConfiguration = {
      device: this._device,
      format: navigator.gpu.getPreferredCanvasFormat(),
      usage: GPUTextureUsage.RENDER_ATTACHMENT,
      alphaMode: "opaque",
    };
    this._canvasContext.configure(canvasConfig);
  }

  protected async createRenderPipeline({
    label,
    vertexShader,
    fragmentShader,
    vertexBufferLayout,
    topology = "triangle-list",
  }: {
    label: string;
    vertexShader: string;
    fragmentShader: string;
    vertexBufferLayout: GPUVertexBufferLayout[];
    topology?: GPUPrimitiveTopology;
  }) {
    const renderPipelineDesc: GPURenderPipelineDescriptor = {
      label: label,
      layout: "auto",
      vertex: {
        module: this._device.createShaderModule({
          label: `${label} vertex shader`,
          code: vertexShader,
        }),
        buffers: vertexBufferLayout,
      },
      fragment: {
        module: this._device.createShaderModule({
          label: `${label} fragment shader`,
          code: fragmentShader,
        }),
        targets: [
          {
            format: navigator.gpu.getPreferredCanvasFormat(),
          },
        ],
      },
      primitive: {
        topology: topology,
        cullMode: "back",
      },
      depthStencil: {
        depthWriteEnabled: true,
        depthCompare: "less-equal",
        format: "depth24plus",
      },
    };
    const pipeline: GPURenderPipeline =
      this._device.createRenderPipeline(renderPipelineDesc);

    return pipeline;
  }

  protected async createComputePipeline({
    label,
    computeShader,
  }: {
    label: string;
    computeShader: string;
  }) {
    const computePipelineDesc: GPUComputePipelineDescriptor = {
      label: label,
      layout: "auto",
      compute: {
        module: this._device.createShaderModule({
          label: `${label} compute shader`,
          code: computeShader,
        }),
      },
    };
    const pipeline: GPUComputePipeline =
      this._device.createComputePipeline(computePipelineDesc);

    return pipeline;
  }

  public async createCubemapTexture(imgSrcs: string[], maxMipLevel = 0) {
    const imgs = await Promise.all(imgSrcs.map(loadImageBitmap));
    const texture = this._device.createTexture({
      label: "yellow F on red",
      size: [imgs[0].width, imgs[0].height, imgs.length],
      mipLevelCount: maxMipLevel + 1,
      format: "rgba8unorm",
      usage:
        GPUTextureUsage.TEXTURE_BINDING |
        GPUTextureUsage.COPY_DST |
        GPUTextureUsage.RENDER_ATTACHMENT,
    });
    if (!texture) console.error("Failed to load cubemap texture");

    for (let layer = 0; layer < 6; layer++) {
      const mips = await generateMips(imgs[layer], maxMipLevel);
      mips.forEach((img, mipLevel) => {
        this._device.queue.copyExternalImageToTexture(
          { source: img, flipY: false },
          {
            texture: texture,
            origin: [0, 0, layer],
            mipLevel: mipLevel,
          },
          { width: img.width, height: img.height }
        );
      });
    }

    return texture;
  }

  public async createTexture(imgSrc: string, maxMipLevel = 0) {
    const img = await loadImageBitmap(imgSrc);
    const mips = await generateMips(img, maxMipLevel);

    const texture = this._device.createTexture({
      label: "yellow F on red",
      size: [mips[0].width, mips[0].height],
      mipLevelCount: mips.length,
      format: "rgba8unorm",
      usage:
        GPUTextureUsage.TEXTURE_BINDING |
        GPUTextureUsage.COPY_DST |
        GPUTextureUsage.RENDER_ATTACHMENT,
    });
    if (!texture) console.error("Failed to load texture");

    mips.forEach((img, index) => {
      this._device.queue.copyExternalImageToTexture(
        { source: img, flipY: false },
        { texture: texture, mipLevel: index }, // Set the mip level for each copy operation
        { width: img.width, height: img.height }
      );
    });

    return texture;
  }

  public getVerticesData(vertices: Vertex[]) {
    const verticesData: number[] = [];
    for (let i = 0; i < vertices.length; i++) {
      const { position, velocity, color, texCoord, radius, mass } = vertices[i];
      verticesData.push(
        ...position,
        0,
        ...velocity,
        0,
        ...color,
        0,
        ...texCoord,
        radius,
        mass
      );
    }

    return verticesData;
  }

  //

  protected async getRenderPassDesc() {
    const canvasTexture = this._canvasContext.getCurrentTexture();
    const depthTexture = this._device.createTexture({
      size: [canvasTexture.width, canvasTexture.height],
      format: "depth24plus",
      usage: GPUTextureUsage.RENDER_ATTACHMENT,
    });

    const colorAttachment: GPURenderPassColorAttachment = {
      view: canvasTexture.createView(),
      clearValue: [0, 0, 0, 1],
      loadOp: "clear",
      storeOp: "store",
    };
    const depthStencilAttachment: GPURenderPassDepthStencilAttachment = {
      view: depthTexture.createView(),
      depthClearValue: 1.0,
      depthLoadOp: "clear",
      depthStoreOp: "store",
    };
    const renderPassDescriptor: GPURenderPassDescriptor = {
      label: "render pass",
      colorAttachments: [colorAttachment],
      depthStencilAttachment: depthStencilAttachment,
    };

    return renderPassDescriptor;
  }
}
