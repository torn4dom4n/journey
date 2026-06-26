<script setup lang="ts">
import MapboxLanguage from "@mapbox/mapbox-gl-language";
import { useDark } from "@vueuse/core";
import mapboxgl, { Map, type ProjectionSpecification } from "mapbox-gl";
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
  projection: ProjectionSpecification["name"];
}>();

const emit = defineEmits<{
  mapReady: [map: Map];
}>();

const dark = useDark();
const style = computed(() => `mapbox://styles/mapbox/${dark.value ? "dark" : "light"}-v10`);

const container = useTemplateRef<HTMLDivElement>("container");
const map = shallowRef<Map>();
const loaded = ref(false);

provide("map", map);

onMounted(() => {
  const token = import.meta.env.VITE_MAPBOX_TOKEN;
  if (!token) {
    console.warn("VITE_MAPBOX_TOKEN is missing. Map might not render correctly.");
  }
  mapboxgl.accessToken = token || "";

  console.log("Initializing Mapbox...");
  const instance = new Map({
    container: container.value!,
    style: style.value,
    center: [105, 21], // Center on Vietnam
    zoom: 5,
    projection: props.projection,
    dragRotate: true,
    touchPitch: true,
    attributionControl: false,
  });

  instance.addControl(
    new MapboxLanguage({
      defaultLanguage: "en",
    }) as any,
  );

  instance.on("load", () => {
    console.log("Map loaded.");
    loaded.value = true;
  });

  instance.on("error", (e) => {
    console.error("Mapbox error:", e);
  });

  instance.on("style.load", () => {
    instance.setFog({
      color: "rgba(0,0,0,0)",
      "high-color": "rgba(255,255,255,0.1)",
      "space-color": "rgba(0,0,0,0)",
      "horizon-blend": 0,
    });
  });

  map.value = instance;
  emit("mapReady", instance);
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
    map.value?.setProjection(projection);
  },
);
</script>

<template>
  <div ref="container" class="h-full w-full" style="position: absolute; top: 0; left: 0" />
  <slot v-if="map" />
</template>
