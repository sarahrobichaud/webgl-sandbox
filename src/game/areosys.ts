import type { ActionCodes } from "./actions";
import { type InstanceConfiguration } from "../engine/system";

export interface MainScene {
  actions: ActionCodes;
  storage: "planes";
}

export interface AeroSysConfig {
  gameConfig: InstanceConfiguration;
}
