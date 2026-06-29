<script setup lang="ts">
import MapboxLanguage from "@mapbox/mapbox-gl-language";
import { useDark } from "@vueuse/core";
import mapboxgl, { Map } from "mapbox-gl";
import {
  computed,
  onMounted,
  onUnmounted,
  provide,
  ref,
  shallowRef,
  useTemplateRef,
  watch,
} from "vue";
import "mapbox-gl/dist/mapbox-gl.css";

const props = defineProps<{
  projection: "globe" | "mercator";
}>();

const emit = defineEmits<{
  mapReady: [map: Map];
}>();

const dark = useDark();
const style = computed(() => `mapbox://styles/mapbox/${dark.value ? "dark" : "light"}-v11`);

const container = useTemplateRef<HTMLDivElement>("container");
const map = shallowRef<Map>();
const loaded = ref(false);
const error = ref<string>();

provide("map", map);

onMounted(() => {
  const token = import.meta.env.VITE_MAPBOX_TOKEN;
  console.log("Initializing map...");
  if (!token) {
    error.value = "Mapbox token is missing. Please set VITE_MAPBOX_TOKEN in your environment.";
    console.error(error.value);
    return;
  }
  mapboxgl.accessToken = token;

  if (!container.value) {
    error.value = "Map container not found.";
    console.error(error.value);
    return;
  }

  try {
    const instance = new Map({
      container: container.value,
      style: style.value,
      center: [105.8, 21.0],
      zoom: 1.5,
      projection: { name: props.projection },
      dragRotate: true,
      touchPitch: true,
      attributionControl: false,
    });

    instance.on("load", () => {
      console.log("Map loaded.");
      loaded.value = true;
      instance.setProjection({ name: props.projection });
    });

    instance.on("style.load", () => {
      console.log("Map style loaded.");
      instance.addControl(
        new MapboxLanguage({
          defaultLanguage: "en",
        }) as any,
      );

      instance.setFog({
        color: "rgba(0,0,0,0)",
        "high-color": "rgba(255,255,255,0.1)",
        "space-color": "rgba(0,0,0,0)",
        "horizon-blend": 0,
      });
    });

    instance.on("error", (e) => {
      console.error("Mapbox error:", e);
    });

    map.value = instance;
    emit("mapReady", instance);
  } catch (e) {
    error.value = `Failed to initialize Mapbox: ${e instanceof Error ? e.message : String(e)}`;
    console.error(error.value);
  }
});

onUnmounted(() => {
  map.value?.remove();
});

watch(style, () => {
  if (!loaded.value) return;
  map.value?.setStyle(style.value);
});

watch(
  () => props.projection,
  (projection) => {
    if (!loaded.value) return;
    map.value?.setProjection({ name: projection });
  },
);
</script>

<template>
  <div ref="container" class="inset-0 bg-gray-100 dark:bg-gray-900 absolute h-full w-full">
    <div
      v-if="error"
      class="p-4 text-red-500 flex h-full w-full items-center justify-center text-center"
    >
      <div class="bg-white p-6 shadow-xl dark:bg-gray-800 rounded-lg">
        <p class="font-bold mb-2 text-lg">Error Loading Map</p>
        <p>{{ error }}</p>
      </div>
    </div>
  </div>
  <slot v-if="map" />
</template>

<style scoped></style>
