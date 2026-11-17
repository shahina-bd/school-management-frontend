<script setup>
import { computed } from 'vue'
import LoadingSpinner from './LoadingSpinner.vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'primary', // primary, secondary, danger, outline, ghost
  },
  size: {
    type: String,
    default: 'md', // sm, md, lg
  },
  type: {
    type: String,
    default: 'button',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['click'])

const variantClasses = computed(() => {
  switch (props.variant) {
    case 'secondary':
      return 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-transparent focus:ring-slate-300'
    case 'danger':
      return 'bg-red-600 text-white hover:bg-red-700 border-transparent focus:ring-red-500'
    case 'outline':
      return 'bg-transparent text-slate-700 hover:bg-slate-50 border-slate-300 focus:ring-indigo-500'
    case 'ghost':
      return 'bg-transparent text-slate-600 hover:bg-slate-100 border-transparent focus:ring-slate-300'
    case 'primary':
    default:
      return 'bg-indigo-600 text-white hover:bg-indigo-700 border-transparent focus:ring-indigo-500'
  }
})

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'px-3 py-1.5 text-xs font-medium rounded-lg'
    case 'lg':
      return 'px-5 py-3 text-base font-semibold rounded-xl'
    case 'md':
    default:
      return 'px-4 py-2 text-sm font-medium rounded-lg'
  }
})

const spinnerColor = computed(() => {
  return props.variant === 'primary' || props.variant === 'danger' ? 'white' : 'primary'
})
</script>

<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    class="inline-flex items-center justify-center border font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
    :class="[variantClasses, sizeClasses]"
    @click="$emit('click', $event)"
  >
    <LoadingSpinner v-if="loading" size="sm" :color="spinnerColor" class="mr-2" />
    <slot name="icon-left" v-if="!loading" />
    <span>
      <slot />
    </span>
    <slot name="icon-right" />
  </button>
</template>
