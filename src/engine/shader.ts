export default class Shader {
  private _label: string;
  private _pipeline: GPURenderPipeline;

  constructor({
    label,
    device,
    vertexShader,
    fragmentShader,
  }: {
    label: string;
    device: GPUDevice;
    vertexShader: string;
    fragmentShader: string;
  }) {
    this._label = label;
    this._pipeline = device.createRenderPipeline({
      label: `${label} pipeline`,
      layout: "auto",
      vertex: {
        module: device.createShaderModule({
          label: `${label} vertex shader`,
          code: vertexShader,
        }),
        buffers: [
          {
            arrayStride: 11 * Float32Array.BYTES_PER_ELEMENT,
            attributes: [
              { shaderLocation: 0, offset: 0, format: "float32x3" }, // pos
              {
                shaderLocation: 1,
                offset: 3 * Float32Array.BYTES_PER_ELEMENT,
                format: "float32x3",
              }, // norm
              {
                shaderLocation: 2,
                offset: 6 * Float32Array.BYTES_PER_ELEMENT,
                format: "float32x3",
              }, // tangent
              {
                shaderLocation: 3,
                offset: 9 * Float32Array.BYTES_PER_ELEMENT,
                format: "float32x2",
              }, // tax
            ],
          },
        ],
      },
      fragment: {
        module: device.createShaderModule({
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
        topology: "triangle-list",
        cullMode: "back",
      },
      depthStencil: {
        depthWriteEnabled: true,
        depthCompare: "less-equal",
        format: "depth24plus",
      },
    });
  }

  public getBindGroupLayout(index: number) {
    return this._pipeline.getBindGroupLayout(index);
  }

  public use(pass?: GPURenderPassEncoder) {
    if (!pass) {
      console.error(
        `GPURenderPassEncoder was not passed to ${this._label} pipeline`
      );
      return;
    }
    pass.setPipeline(this._pipeline);
  }
}
