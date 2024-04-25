export default class RenderEnv {
  private _canvas: HTMLCanvasElement;
  private _adapter?: GPUAdapter;
  private _device?: GPUDevice;
  private _context?: GPUCanvasContext;
  private _encoder?: GPUCommandEncoder;
  private _pass?: GPURenderPassEncoder;
  private _depthTexture?: GPUTexture;

  constructor(canvas: HTMLCanvasElement) {
    this._canvas = canvas;
  }

  get device() {
    return this._device;
  }

  public async initialize(width: number, height: number) {
    this._canvas.style.width = `${width}px`;
    this._canvas.style.height = `${height}px`;
    this._canvas.width = width * 2;
    this._canvas.height = height * 2;
    this._adapter = (await navigator.gpu?.requestAdapter()) as GPUAdapter;
    this._device = (await this._adapter?.requestDevice()) as GPUDevice;
    if (!this._device) {
      const msg = "Your device does not support WebGPU.";
      console.error(msg);

      const errMsg = document.createElement("p");
      errMsg.innerHTML = msg;
      document.querySelector("body")?.prepend(errMsg);
    }

    this._context = this._canvas.getContext("webgpu") as GPUCanvasContext;
    this._context.configure({
      device: this._device,
      format: navigator.gpu.getPreferredCanvasFormat(),
    });
  }

  public setEncoder() {
    if (!this._device) {
      console.error("RenderEnv was not initialized!");
      return;
    }
    this._encoder = this._device.createCommandEncoder({
      label: "encoder",
    });
  }

  public get encoder() {
    return this._encoder!;
  }

  public getGraphicsPass() {
    if (!this._context || !this._device) {
      console.error("RenderEnv was not initialized!");
    }
    if (!this._encoder) {
      console.error("Encoder was not created!");
    }
    const canvasTexture = this._context!.getCurrentTexture();

    if (
      !this._depthTexture ||
      this._depthTexture.width !== canvasTexture.width ||
      this._depthTexture.height !== canvasTexture.height
    ) {
      if (this._depthTexture) {
        this._depthTexture.destroy();
      }
      this._depthTexture = this._device!.createTexture({
        size: [canvasTexture.width, canvasTexture.height],
        format: "depth24plus",
        usage: GPUTextureUsage.RENDER_ATTACHMENT,
      });
    }

    const renderPassDescriptor: GPURenderPassDescriptor = {
      label: "render pass",
      colorAttachments: [
        {
          view: canvasTexture.createView(),
          clearValue: [0, 0, 0, 1],
          loadOp: "clear",
          storeOp: "store",
        },
      ],
      depthStencilAttachment: {
        view: this._depthTexture.createView(),
        depthClearValue: 1.0,
        depthLoadOp: "clear",
        depthStoreOp: "store",
      },
    };
    this._pass = this._encoder!.beginRenderPass(renderPassDescriptor);
    return this._pass;
  }

  public getComputePass() {
    if (!this._encoder) {
      console.error("Encoder was not created!");
    }
    return this._encoder!.beginComputePass({
      label: "compute pass",
    });
  }

  public finishEncoder() {
    if (!this._device) {
      console.error("RenderEnv was not initialized!");
    }
    if (!this._encoder) {
      console.error("Encoder was not created!");
    }

    const commandBuffer = this._encoder!.finish();
    this._device!.queue.submit([commandBuffer]);
  }
}
