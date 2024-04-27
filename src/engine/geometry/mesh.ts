import { Vertex } from "@/engine/common";

export default class Mesh {
  private _label: string;
  private _device: GPUDevice;
  protected _vertices: Vertex[];
  protected _indices: number[];
  private _vertexBuffer: GPUBuffer | undefined;
  private _indexBuffer: GPUBuffer | undefined;

  constructor(device: GPUDevice, label: string) {
    this._label = label;
    this._device = device;
    this._vertices = [];
    this._indices = [];
  }

  protected initialize() {
    const verticesData: number[] = [];
    for (let i = 0; i < this._vertices.length; i++) {
      const { position, velocity, color, texCoord, radius, mass } =
        this._vertices[i];
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
    const vertexValues = new Float32Array(verticesData);
    this._vertexBuffer = this._device.createBuffer({
      label: `${this._label}-vertex-buffer`,
      size: vertexValues.byteLength,
      usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
    });
    this._device.queue.writeBuffer(this._vertexBuffer, 0, vertexValues);

    const indexValues = new Uint32Array(this._indices);
    this._indexBuffer = this._device.createBuffer({
      label: `${this._label}-index-buffer`,
      size: indexValues.byteLength,
      usage: GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST,
    });
    this._device.queue.writeBuffer(this._indexBuffer, 0, indexValues);
  }

  public draw(pass?: GPURenderPassEncoder) {
    if (!this._vertexBuffer || !this._indexBuffer) {
      console.error(`${this._label} mesh was not initialized!`);
      return;
    }
    if (!pass) {
      console.error(
        `GPURenderPassEncoder was not passed to ${this._label} mesh`
      );
      return;
    }
    pass.setVertexBuffer(0, this._vertexBuffer);
    pass.setIndexBuffer(this._indexBuffer, "uint32");
    pass.drawIndexed(this._indices.length);
  }
}
