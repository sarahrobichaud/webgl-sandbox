import { InternalComponent, type CorePrimitivesStorage, type RenderingPipelineComponent } from "../../components/components";
import type { EntityId } from "../../core/types";
import { type RenderMatrix } from "../render-matrix";


export class Transformer extends InternalComponent implements RenderingPipelineComponent {
  constructor() {

    super();
  }

  update(entities: Iterable<number>, storage: CorePrimitivesStorage, matrices: Map<EntityId, RenderMatrix>): void {
  }
}
