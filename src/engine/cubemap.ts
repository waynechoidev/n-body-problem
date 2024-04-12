import ImageUtils from "./image-utils";

export default class Cubemap {
  private _device: GPUDevice;
  private _texture?: GPUTexture;

  constructor(device: GPUDevice) {
    this._device = device;
  }

  get view() {
    if (!this._texture) console.error("You need to initialize texture first!");
    return this._texture!.createView({ dimension: "cube" });
  }

  public async initialize(imgSrcs: string[], maxMipLevel = 0) {
    const imgs = await Promise.all(imgSrcs.map(ImageUtils.loadImageBitmap));
    this._texture = this._device.createTexture({
      label: "yellow F on red",
      size: [imgs[0].width, imgs[0].height, imgs.length],
      mipLevelCount: maxMipLevel + 1,
      format: "rgba8unorm",
      usage:
        GPUTextureUsage.TEXTURE_BINDING |
        GPUTextureUsage.COPY_DST |
        GPUTextureUsage.RENDER_ATTACHMENT,
    });
    if (!this._texture) {
      console.error("Failed to load texture");
      return;
    }

    for (let layer = 0; layer < 6; layer++) {
      const mips = await ImageUtils.generateMips(imgs[layer], maxMipLevel);
      mips.forEach((img, mipLevel) => {
        this._device.queue.copyExternalImageToTexture(
          { source: img, flipY: false },
          {
            texture: this._texture!,
            origin: [0, 0, layer],
            mipLevel: mipLevel,
          },
          { width: img.width, height: img.height }
        );
      });
    }
  }
}
