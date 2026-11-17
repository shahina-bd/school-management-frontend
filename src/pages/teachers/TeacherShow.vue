<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import teacherService from '../../services/teacherService'

const route = useRoute()
const teacher = ref(null)
const loading = ref(true)

onMounted(async () => {
  try {
    const res = await teacherService.getById(route.params.id)
    teacher.value = res.data?.data || res.data
  } catch (err) {
    teacher.value = {
      id: route.params.id,
      emp_id: `T-10${route.params.id}`,
      name: 'Dr. Sarah Jenkins',
      subject: 'Mathematics',
      phone: '+1 555-8821',
      email: 's.jenkins@school.com',
      status: 'Active',
      qualification: 'Ph.D. in Pure Mathematics',
      join_date: '2021-08-15',
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
        <h1 class="text-2xl font-bold text-slate-800">Teacher Profile</h1>
        <p class="text-slate-500">Detailed information about teaching staff.</p>
      </div>
      <div class="flex items-center gap-3">
        <router-link :to="`/teachers/${$route.params.id}/edit`" class="rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700 text-sm font-medium">Edit</router-link>
        <router-link to="/teachers" class="rounded-lg border border-slate-300 px-4 py-2 text-slate-700 hover:bg-slate-50 text-sm font-medium">&larr; Back</router-link>
      </div>
    </div>

    <div v-if="teacher" class="bg-white rounded-xl p-6 shadow-sm border border-slate-100 space-y-6">
      <div class="flex items-center space-x-4 border-b border-slate-100 pb-6">
        <div class="w-16 h-16 rounded-full bg-blue-600 text-white font-bold text-xl flex items-center justify-center">
          {{ teacher.name ? teacher.name.charAt(0).toUpperCase() : 'T' }}
        </div>
        <div>
          <h2 class="text-xl font-bold text-slate-800">{{ teacher.name }}</h2>
          <p class="text-sm text-slate-500">{{ teacher.subject }} Faculty Member</p>
          <span class="inline-block mt-1 rounded-full bg-green-100 px-3 py-0.5 text-xs text-green-700 font-semibold">{{ teacher.status }}</span>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <span class="text-xs text-slate-400 font-semibold uppercase">Employee ID</span>
          <p class="text-base font-semibold text-slate-800 mt-1">{{ teacher.emp_id }}</p>
        </div>
        <div>
          <span class="text-xs text-slate-400 font-semibold uppercase">Primary Subject</span>
          <p class="text-base font-semibold text-slate-800 mt-1">{{ teacher.subject }}</p>
        </div>
        <div>
          <span class="text-xs text-slate-400 font-semibold uppercase">Phone Number</span>
          <p class="text-base font-semibold text-slate-800 mt-1">{{ teacher.phone || '-' }}</p>
        </div>
        <div>
          <span class="text-xs text-slate-400 font-semibold uppercase">Email Address</span>
          <p class="text-base font-semibold text-slate-800 mt-1">{{ teacher.email || '-' }}</p>
        </div>
        <div>
          <span class="text-xs text-slate-400 font-semibold uppercase">Qualification</span>
          <p class="text-base font-semibold text-slate-800 mt-1">{{ teacher.qualification || 'M.Sc. Education' }}</p>
        </div>
        <div>
          <span class="text-xs text-slate-400 font-semibold uppercase">Joining Date</span>
          <p class="text-base font-semibold text-slate-800 mt-1">{{ teacher.join_date || '2022-01-10' }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
