<script setup>
import { ref } from 'vue'
import BaseTable from '../../components/common/BaseTable.vue'
import BaseButton from '../../components/common/BaseButton.vue'

const sections = ref([
  { id: 1, name: 'Section A', class_name: 'Grade 10', capacity: 40, room_no: 'Room 301' },
  { id: 2, name: 'Section B', class_name: 'Grade 10', capacity: 40, room_no: 'Room 302' },
  { id: 3, name: 'Section A', class_name: 'Grade 9', capacity: 35, room_no: 'Room 201' },
  { id: 4, name: 'Section B', class_name: 'Grade 9', capacity: 35, room_no: 'Room 202' },
])

const columns = [
  { key: 'name', label: 'Section' },
  { key: 'class_name', label: 'Class' },
  { key: 'capacity', label: 'Student Capacity' },
  { key: 'room_no', label: 'Classroom' },
]
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold text-slate-800">Sections Configuration</h2>
        <p class="text-xs text-slate-500 mt-1">Manage class sections and classroom allocation</p>
      </div>
      <BaseButton variant="primary" size="md">+ Add Section</BaseButton>
    </div>

    <BaseTable :columns="columns" :items="sections">
      <template #cell-name="{ item }">
        <span class="font-semibold text-purple-700 bg-purple-50 px-2.5 py-1 rounded text-xs">{{ item.name }}</span>
      </template>
    </BaseTable>
  </div>
</template>
