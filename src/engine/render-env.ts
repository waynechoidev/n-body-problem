export default class RenderEnv {
  private _canvas: HTMLCanvasElement;
  private _adapter?: GPUAdapter;
  private _device?: GPUDevice;
  private _context?: GPUCanvasContext;
  private _encoder?: GPUCommandEncoder;
  private _pass?: GPURenderPassEncoder;

  constructor(canvas: HTMLCanvasElement) {
    this._canvas = canvas;
  }

  get device() {
    return this._device;
  }

  public async initialize(width: number, height: number) {
    this._canvas.width = width;
    this._canvas.height = height;
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

  public getPass() {
    if (!this._context || !this._device) {
      console.error("RenderEnv was not initialized!");
      return;
    }
    const renderPassDescriptor: GPURenderPassDescriptor = {
      colorAttachments: [
        {
          view: this._context.getCurrentTexture().createView(),
          clearValue: [0, 0, 0, 1],
          loadOp: "clear",
          storeOp: "store",
        },
      ],
    };
    this._encoder = this._device.createCommandEncoder();
    this._pass = this._encoder.beginRenderPass(renderPassDescriptor);
    return this._pass;
  }

  public endPass() {
    if (!this._device) {
      console.error("RenderEnv was not initialized!");
      return;
    }
    this._pass?.end();
    const commandBuffer = this._encoder?.finish();
    if (commandBuffer) this._device.queue.submit([commandBuffer]);
  }
}
