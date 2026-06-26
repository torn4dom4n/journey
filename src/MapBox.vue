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

provide("map", map);

onMounted(() => {
  const token = import.meta.env.VITE_MAPBOX_TOKEN;
  if (!token) {
    console.error("VITE_MAPBOX_TOKEN is missing!");
  }
  mapboxgl.accessToken = token || "";

  const instance = new Map({
    container: container.value!,
    style: style.value,
    center: [105.8, 21.0],
    zoom: 1.5,
    projection: { name: props.projection },
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
    loaded.value = true;
    instance.setProjection({ name: props.projection });
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
    map.value?.setProjection({ name: projection });
  },
);
</script>

<template>
  <div ref="container" class="inset-0 bg-gray-100 dark:bg-gray-900 absolute h-full w-full" />
  <slot v-if="map" />
</template>

<style scoped>
:deep(.mapboxgl-canvas) {
  width: 100% !important;
  height: 100% !important;
}
</style>
