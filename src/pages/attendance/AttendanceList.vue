<script setup>
import { ref } from 'vue'
import BaseTable from '../../components/common/BaseTable.vue'
import BaseButton from '../../components/common/BaseButton.vue'

const date = ref(new Date().toISOString().split('T')[0])
const selectedClass = ref('Class 10-A')

const attendanceRecords = ref([
  { id: 1, date: '2026-10-05', roll_no: '101', student_name: 'Alexander Wright', class: 'Class 10-A', status: 'Present', remarks: 'On time' },
  { id: 2, date: '2026-10-05', roll_no: '102', student_name: 'Sophia Martinez', class: 'Class 10-A', status: 'Present', remarks: 'On time' },
  { id: 3, date: '2026-10-05', roll_no: '103', student_name: 'Ethan Hunt', class: 'Class 10-A', status: 'Absent', remarks: 'Medical leave' },
  { id: 4, date: '2026-10-05', roll_no: '104', student_name: 'Olivia Taylor', class: 'Class 10-A', status: 'Late', remarks: '15 mins late' },
])

const columns = [
  { key: 'date', label: 'Date' },
  { key: 'roll_no', label: 'Roll No' },
  { key: 'student_name', label: 'Student Name' },
  { key: 'class', label: 'Class' },
  { key: 'status', label: 'Attendance Status' },
  { key: 'remarks', label: 'Remarks' },
]
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold text-slate-800">Daily Attendance Tracker</h2>
        <p class="text-xs text-slate-500 mt-1">Record and inspect daily student presence logs</p>
      </div>
      <BaseButton variant="primary" size="md">Save Attendance</BaseButton>
    </div>

    <!-- Controls -->
    <div class="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs flex flex-wrap items-center gap-4">
      <div>
        <label class="block text-xs font-semibold text-slate-500 mb-1">Select Date</label>
        <input type="date" v-model="date" class="border border-slate-300 rounded-lg px-3 py-2 text-xs" />
      </div>

      <div>
        <label class="block text-xs font-semibold text-slate-500 mb-1">Select Class</label>
        <select v-model="selectedClass" class="border border-slate-300 rounded-lg px-3 py-2 text-xs">
          <option value="Class 10-A">Class 10-A</option>
          <option value="Class 10-B">Class 10-B</option>
          <option value="Class 9-A">Class 9-A</option>
        </select>
      </div>
    </div>

    <BaseTable :columns="columns" :items="attendanceRecords">
      <template #cell-status="{ item }">
        <span
          class="px-2.5 py-1 rounded-full text-xs font-bold"
          :class="{
            'bg-emerald-50 text-emerald-700': item.status === 'Present',
            'bg-red-50 text-red-700': item.status === 'Absent',
            'bg-amber-50 text-amber-700': item.status === 'Late'
          }"
        >
          {{ item.status }}
        </span>
      </template>
    </BaseTable>
  </div>
</template>
