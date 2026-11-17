<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import staffService from '../../services/staffService'

const route = useRoute()
const member = ref(null)
const loading = ref(true)

onMounted(async () => {
  try {
    const res = await staffService.getById(route.params.id)
    member.value = res.data?.data || res.data
  } catch (err) {
    member.value = {
      id: route.params.id,
      emp_id: `S-20${route.params.id}`,
      name: 'Marcus Brody',
      role: 'Librarian',
      phone: '+1 555-4001',
      email: 'm.brody@school.com',
      status: 'Active',
      department: 'Library Administration',
      join_date: '2020-03-12',
    }
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="max-w-3xl mx-auto space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-slate-800">Staff Profile</h1>
        <p class="text-slate-500">Detailed information about administrative staff.</p>
      </div>
      <div class="flex items-center gap-3">
        <router-link :to="`/staff/${$route.params.id}/edit`" class="rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700 text-sm font-medium">Edit</router-link>
        <router-link to="/staff" class="rounded-lg border border-slate-300 px-4 py-2 text-slate-700 hover:bg-slate-50 text-sm font-medium">&larr; Back</router-link>
      </div>
    </div>

    <div v-if="member" class="bg-white rounded-xl p-6 shadow-sm border border-slate-100 space-y-6">
      <div class="flex items-center space-x-4 border-b border-slate-100 pb-6">
        <div class="w-16 h-16 rounded-full bg-blue-600 text-white font-bold text-xl flex items-center justify-center">
          {{ member.name ? member.name.charAt(0).toUpperCase() : 'S' }}
        </div>
        <div>
          <h2 class="text-xl font-bold text-slate-800">{{ member.name }}</h2>
          <p class="text-sm text-slate-500">{{ member.role }}</p>
          <span class="inline-block mt-1 rounded-full bg-green-100 px-3 py-0.5 text-xs text-green-700 font-semibold">{{ member.status }}</span>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <span class="text-xs text-slate-400 font-semibold uppercase">Employee ID</span>
          <p class="text-base font-semibold text-slate-800 mt-1">{{ member.emp_id }}</p>
        </div>
        <div>
          <span class="text-xs text-slate-400 font-semibold uppercase">Designation / Role</span>
          <p class="text-base font-semibold text-slate-800 mt-1">{{ member.role }}</p>
        </div>
        <div>
          <span class="text-xs text-slate-400 font-semibold uppercase">Phone Number</span>
          <p class="text-base font-semibold text-slate-800 mt-1">{{ member.phone || '-' }}</p>
        </div>
        <div>
          <span class="text-xs text-slate-400 font-semibold uppercase">Email Address</span>
          <p class="text-base font-semibold text-slate-800 mt-1">{{ member.email || '-' }}</p>
        </div>
        <div>
          <span class="text-xs text-slate-400 font-semibold uppercase">Department</span>
          <p class="text-base font-semibold text-slate-800 mt-1">{{ member.department || 'Administration' }}</p>
        </div>
        <div>
          <span class="text-xs text-slate-400 font-semibold uppercase">Joining Date</span>
          <p class="text-base font-semibold text-slate-800 mt-1">{{ member.join_date || '2020-03-12' }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
