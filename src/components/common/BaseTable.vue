<script setup>
import LoadingSpinner from './LoadingSpinner.vue'

defineProps({
  columns: {
    type: Array,
    required: true, // [{ key: 'id', label: 'ID' }, { key: 'name', label: 'Name' }]
  },
  items: {
    type: Array,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
  emptyText: {
    type: String,
    default: 'No records found.',
  },
})
</script>

<template>
  <div class="w-full bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
    <div class="overflow-x-auto">
      <table class="w-full text-left border-collapse text-sm">
        <thead>
          <tr class="bg-slate-50/80 border-b border-slate-200 text-xs font-semibold uppercase tracking-wider text-slate-500">
            <th
              v-for="col in columns"
              :key="col.key"
              class="px-6 py-3.5"
              :class="col.headerClass || ''"
            >
              {{ col.label }}
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100 text-slate-700">
          <tr v-if="loading">
            <td :colspan="columns.length" class="px-6 py-12 text-center text-slate-500">
              <div class="flex flex-col items-center justify-center space-y-3">
                <LoadingSpinner size="lg" />
                <span class="text-sm font-medium">Loading data...</span>
              </div>
            </td>
          </tr>

          <tr v-else-if="!items || items.length === 0">
            <td :colspan="columns.length" class="px-6 py-12 text-center text-slate-500">
              <div class="flex flex-col items-center justify-center space-y-2">
                <svg class="w-10 h-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <p class="text-slate-500 font-medium">{{ emptyText }}</p>
              </div>
            </td>
          </tr>

          <tr
            v-else
            v-for="(item, index) in items"
            :key="item.id || index"
            class="hover:bg-slate-50/60 transition-colors"
          >
            <td
              v-for="col in columns"
              :key="col.key"
              class="px-6 py-4 whitespace-nowrap"
              :class="col.cellClass || ''"
            >
              <slot :name="`cell-${col.key}`" :item="item" :index="index">
                {{ item[col.key] ?? '-' }}
              </slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Table Footer / Pagination -->
    <div v-if="$slots.pagination" class="px-6 py-3.5 bg-slate-50/50 border-t border-slate-200">
      <slot name="pagination" />
    </div>
  </div>
</template>
