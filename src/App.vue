<script setup lang="ts">
import type { Map } from "maplibre-gl";

import { useLocalStorage } from "@vueuse/core";
import { ref } from "vue";

import data from "../data.yaml";
import MapBox from "./MapBox.vue";
import PlaceMarker from "./PlaceMarker.vue";

const projection = useLocalStorage<"globe" | "mercator">("map-projection", "mercator");

const coords = ref<GeolocationCoordinates>();
const locating = ref(false);
const map = ref<Map>();

function flyToLocation() {
  if (!coords.value) return;
  map.value?.flyTo({
    center: [coords.value.longitude, coords.value.latitude],
    zoom: 12,
  });
}

function getCurrentPosition(options?: PositionOptions): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, options);
  });
}

async function handleLocate() {
  locating.value = true;
  try {
    const position = await getCurrentPosition({
      enableHighAccuracy: true,
    });
    coords.value = position.coords;
    flyToLocation();
  } catch (e) {
    console.error("Locate failed:", e);
  } finally {
    locating.value = false;
  }
}
</script>

<template>
  <div class="relative h-screen w-screen overflow-hidden">
    <MapBox :projection="projection" @map-ready="(m) => (map = m)">
      <template v-for="item in data" :key="item.label">
        <PlaceMarker
          v-for="place in item.places"
          :key="place.label"
          :color="item.color"
          :place="place"
        />
      </template>

      <PlaceMarker
        v-if="coords"
        color="oklch(62.3% 0.214 259.815)"
        :place="{
          label: 'You',
          coords: [coords.longitude, coords.latitude],
          current: true,
        }"
      />
    </MapBox>

    <div class="bottom-6 right-6 gap-3 pointer-events-none absolute flex flex-col items-end">
      <div class="gap-3 pointer-events-auto flex">
        <div
          class="gap-3 bg-white/80 px-3 py-2 text-sm text-#111827 shadow-lg backdrop-blur-md flex items-center rounded-full"
        >
          <button
            class="flex cursor-pointer"
            :class="{ 'opacity-30': projection !== 'globe' }"
            @click="projection = 'globe'"
          >
            <span class="i-ph:globe-hemisphere-east-duotone text-xl" aria-label="Earth" />
          </button>
          <button
            class="flex cursor-pointer"
            :class="{ 'opacity-30': projection !== 'mercator' }"
            @click="projection = 'mercator'"
          >
            <span class="i-ph:map-trifold-duotone text-xl" aria-label="Map" />
          </button>
        </div>

        <div
          class="gap-3 bg-white/80 px-3 py-2 text-sm text-#111827 shadow-lg backdrop-blur-md flex items-center rounded-full"
        >
          <button class="flex cursor-pointer" @click="handleLocate">
            <span
              class="i-ph:map-pin-duotone text-xl"
              :class="{ 'animate-pulse': locating }"
              aria-label="Locate me"
            />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
