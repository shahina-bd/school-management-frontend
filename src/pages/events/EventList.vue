<script setup>
import { ref } from 'vue'
import BaseTable from '../../components/common/BaseTable.vue'
import BaseButton from '../../components/common/BaseButton.vue'

const events = ref([
  { id: 1, title: 'Science Exhibition 2026', location: 'Main Auditorium', date: '2026-10-20', organizer: 'Science Dept' },
  { id: 2, title: 'Annual Cultural Festival', location: 'School Grounds', date: '2026-11-15', organizer: 'Cultural Committee' },
])

const columns = [
  { key: 'title', label: 'Event Name' },
  { key: 'location', label: 'Venue' },
  { key: 'date', label: 'Event Date' },
  { key: 'organizer', label: 'Organizer' },
]
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold text-slate-800">Events Calendar</h2>
        <p class="text-xs text-slate-500 mt-1">Schedule and view upcoming school activities and events</p>
      </div>
      <BaseButton variant="primary" size="md">+ Create Event</BaseButton>
    </div>

    <BaseTable :columns="columns" :items="events">
      <template #cell-title="{ item }">
        <span class="font-bold text-slate-800 text-sm">{{ item.title }}</span>
      </template>
    </BaseTable>
  </div>
</template>
