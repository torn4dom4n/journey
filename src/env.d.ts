/// <reference types="vite/client" />

declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare module "*.yaml" {
  import { MapData } from "./types";
  const data: MapData;
  export default data;
}
