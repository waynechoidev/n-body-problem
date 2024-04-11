import { mat4 } from "@external/glmatrix";
export class MathUtils {
  static getModelMatrix({
    translation,
    scaling,
    rotation,
  }: {
    translation: vec3;
    scaling: vec3;
    rotation: vec3;
  }) {
    const model = mat4.create();

    mat4.translate(model, model, translation);
    mat4.scale(model, model, scaling);
    mat4.rotateX(model, model, rotation[0]);
    mat4.rotateZ(model, model, rotation[1]);
    mat4.rotateY(model, model, rotation[2]);

    return model;
  }
}
