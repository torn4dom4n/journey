import "@unocss/reset/tailwind.css";
import { ViteSSG } from "vite-ssg";

import App from "./App.vue";
import "./styles.css";
import "virtual:uno.css";

export const createApp = ViteSSG(App, { routes: [{ path: "/", component: App }] });
