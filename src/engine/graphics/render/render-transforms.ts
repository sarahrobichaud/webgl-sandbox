import { mat4, quat, vec3 } from "gl-matrix";
import { InternalComponent, type CorePrimitivesStorage, type RenderingPipelineComponent } from "../../components/components";
import type { EntityId } from "../../core/types";
import { renderMatrix, type RenderMatrix } from "../render-matrix";

const tempTranslation = vec3.create();
const tempRotation = quat.create();
const tempScale = vec3.create();
const Z_AXIS = vec3.fromValues(0, 0, 1);

export class Transformer extends InternalComponent implements RenderingPipelineComponent {
  constructor() {
    super();
  }

  update(entities: Iterable<number>, storage: CorePrimitivesStorage, matrices: Map<EntityId, RenderMatrix>): void {
    for (const entity of entities) {
      const transform = storage.transforms3D.get(entity);
      const render = matrices.get(entity);

      if (!transform?.isDirty || !render?.matrix) {
        continue;
      }

      quat.set(tempRotation, transform.rotateX, transform.rotateY, transform.rotateZ, 1);
      vec3.set(tempTranslation, transform.x, transform.y, transform.z);

      mat4.fromRotationTranslationScale(render.matrix, tempRotation, tempTranslation, vec3.create());

      transform.isDirty = false;
    }
  }
}
