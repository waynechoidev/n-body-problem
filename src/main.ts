import Renderer from "@/engine/renderer";

const renderer = new Renderer();
let previousFrameTime = 0;

async function main() {
  await renderer.initialize();

  async function render() {
    const time = performance.now();
    const delta: number = time - previousFrameTime;
    previousFrameTime = time;

    await renderer.run(time, delta);
    requestAnimationFrame(render);
  }

  render();
}

main();
