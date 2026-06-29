<script setup lang="ts">
import { Map } from "maplibre-gl";
import { onMounted, onUnmounted, provide, ref, shallowRef, useTemplateRef, watch } from "vue";
import "maplibre-gl/dist/maplibre-gl.css";

const props = defineProps<{
  projection: "globe" | "mercator";
}>();

const emit = defineEmits<{
  mapReady: [map: Map];
}>();

const style = "https://tiles.openfreemap.org/styles/liberty";

const container = useTemplateRef<HTMLDivElement>("container");
const map = shallowRef<Map>();
const loaded = ref(false);

provide("map", map);

onMounted(() => {
  const instance = new Map({
    container: container.value!,
    style: style,
    center: [105.8, 21.0],
    zoom: 1.5,
    // @ts-ignore
    projection: { type: props.projection },
    dragRotate: true,
    touchPitch: true,
    attributionControl: false,
  });

  instance.on("load", () => {
    loaded.value = true;
    // @ts-ignore
    instance.setProjection({ type: props.projection });
  });

  map.value = instance;
  emit("mapReady", instance);
});

onUnmounted(() => {
  map.value?.remove();
});

watch(
  () => props.projection,
  (projection) => {
    if (!loaded.value) return;
    // @ts-ignore
    map.value?.setProjection({ type: projection });
  },
);
</script>

<template>
  <div ref="container" class="inset-0 bg-gray-100 absolute h-full w-full" />
  <slot v-if="map" />
</template>

<style scoped>
:deep(.maplibregl-canvas) {
  width: 100% !important;
  height: 100% !important;
}
</style>
