export default class ComputePipeline {
  private _label: string;
  private _pipeline: GPUComputePipeline;

  constructor({
    label,
    device,
    computeShader,
  }: {
    label: string;
    device: GPUDevice;
    computeShader: string;
  }) {
    this._label = label;
    this._pipeline = device.createComputePipeline({
      label: `${label} compute pipeline`,
      layout: "auto",
      compute: {
        module: device.createShaderModule({
          label: `${label} compute shader`,
          code: computeShader,
        }),
      },
    });
  }

  public getBindGroupLayout(index: number) {
    return this._pipeline.getBindGroupLayout(index);
  }

  public use(pass?: GPUComputePassEncoder) {
    if (!pass) {
      console.error(
        `GPUComputePassEncoder was not passed to ${this._label} pipeline`
      );
    }
    pass!.setPipeline(this._pipeline);
  }
}
