<script setup>
import { ref } from 'vue'
import BaseTable from '../../components/common/BaseTable.vue'
import BaseButton from '../../components/common/BaseButton.vue'

const results = ref([
  { id: 1, student: 'Alexander Wright', exam: 'Mid-Term 2026', total_marks: '485 / 500', grade: 'A+', gpa: '4.00' },
  { id: 2, student: 'Sophia Martinez', exam: 'Mid-Term 2026', total_marks: '462 / 500', grade: 'A', gpa: '3.85' },
])

const columns = [
  { key: 'student', label: 'Student' },
  { key: 'exam', label: 'Exam' },
  { key: 'total_marks', label: 'Obtained Marks' },
  { key: 'grade', label: 'Grade' },
  { key: 'gpa', label: 'GPA' },
]
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold text-slate-800">Exam Results & Marks</h2>
        <p class="text-xs text-slate-500 mt-1">Publish report cards and academic performance analytics</p>
      </div>
      <BaseButton variant="primary" size="md">+ Upload Marks</BaseButton>
    </div>

    <BaseTable :columns="columns" :items="results">
      <template #cell-grade="{ item }">
        <span class="font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded text-xs">{{ item.grade }}</span>
      </template>
    </BaseTable>
  </div>
</template>
