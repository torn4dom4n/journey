<script setup lang="ts">
import MapboxLanguage from '@mapbox/mapbox-gl-language'
import { useDark } from '@vueuse/core'
import mapboxgl, { Map } from 'mapbox-gl'
import {
  computed,
  onMounted,
  onUnmounted,
  provide,
  shallowRef,
  useTemplateRef,
  watch,
} from 'vue'
import 'mapbox-gl/dist/mapbox-gl.css'

const props = defineProps<{
  projection: 'globe' | 'mercator'
}>()

const emit = defineEmits<{
  mapReady: [map: Map]
}>()

const dark = useDark()
const style = computed(
  () => `mapbox://styles/mapbox/${dark.value ? 'dark' : 'light'}-v11`,
)

const container = useTemplateRef<HTMLDivElement>('container')
const map = shallowRef<Map>()

provide('map', map)

onMounted(() => {
  const token = import.meta.env.VITE_MAPBOX_TOKEN
  mapboxgl.accessToken = token || ''

  const instance = new Map({
    container: container.value!,
    style: style.value,
    center: [105.8, 21.0], // Center on Hanoi
    zoom: 1.5,
    projection: { name: props.projection },
    dragRotate: true,
    touchPitch: true,
    attributionControl: false,
  })

  instance.addControl(
    new MapboxLanguage({
      defaultLanguage: 'en',
    }) as any,
  )

  instance.on('style.load', () => {
    instance.setFog({
      color: 'rgba(0,0,0,0)',
      'high-color': 'rgba(255,255,255,0.1)',
      'space-color': 'rgba(0,0,0,0)',
      'horizon-blend': 0,
    })
  })

  map.value = instance
  emit('mapReady', instance)
})

onUnmounted(() => {
  map.value?.remove()
})

watch(style, () => {
  map.value?.setStyle(style.value)
})

watch(
  () => props.projection,
  (projection) => {
    map.value?.setProjection({ name: projection })
  },
)
</script>

<template>
  <div ref="container" class="absolute inset-0 h-full w-full" />
  <slot v-if="map" />
</template>
