import "@unocss/reset/tailwind.css";
import { createApp } from "vue";

import App from "./App.vue";
import "./styles.css";
import "virtual:uno.css";

console.log("Mounting app...");
const app = createApp(App);
app.mount("#root");
console.log("App mounted.");
