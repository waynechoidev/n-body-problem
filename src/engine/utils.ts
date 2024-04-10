import { mat4 } from "@external/glmatrix";

export const loadImages = async (
  imgSrcs: string[]
): Promise<HTMLImageElement[]> => {
  const loadImagePromises = imgSrcs.map((src) => {
    return new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.src = src;
      img.crossOrigin = "anonymous";
      img.onload = () => {
        resolve(img);
      };
      img.onerror = () => {
        reject(new Error("Image loading failed"));
      };
    });
  });
  return await Promise.all(loadImagePromises);
};

export const getModelMatrix = ({
  translation,
  scaling,
  rotation,
}: {
  translation: vec3;
  scaling: vec3;
  rotation: vec3;
}) => {
  const model = mat4.create();
  mat4.translate(model, model, translation);
  mat4.scale(model, model, scaling);
  mat4.rotateX(model, model, rotation[0]);
  mat4.rotateZ(model, model, rotation[1]);
  mat4.rotateY(model, model, rotation[2]);
  return model;
};
