<script setup>
import { computed } from 'vue'

const props = defineProps({
  size: {
    type: String,
    default: 'md', // sm, md, lg, xl
  },
  color: {
    type: String,
    default: 'primary', // primary, white, gray
  },
})

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'w-4 h-4 border-2'
    case 'lg':
      return 'w-8 h-8 border-3'
    case 'xl':
      return 'w-12 h-12 border-4'
    case 'md':
    default:
      return 'w-6 h-6 border-2'
  }
})

const colorClasses = computed(() => {
  switch (props.color) {
    case 'white':
      return 'border-white/30 border-t-white'
    case 'gray':
      return 'border-gray-300 border-t-gray-600'
    case 'primary':
    default:
      return 'border-indigo-200 border-t-indigo-600'
  }
})
</script>

<template>
  <div
    class="inline-block animate-spin rounded-full"
    :class="[sizeClasses, colorClasses]"
    role="status"
    aria-label="loading"
  >
    <span class="sr-only">Loading...</span>
  </div>
</template>
