<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useStudentStore } from '../../stores/student'
import BaseButton from '../../components/common/BaseButton.vue'
import LoadingSpinner from '../../components/common/LoadingSpinner.vue'

const router = useRouter()
const route = useRoute()
const studentStore = useStudentStore()

const studentId = route.params.id
const student = ref(null)
const isLoading = ref(true)

onMounted(async () => {
  try {
    const data = await studentStore.fetchStudent(studentId)
    student.value = data
  } catch (err) {
    // Fallback sample data
    const found = studentStore.students.find((s) => s.id == studentId)
    student.value = found || {
      id: studentId,
      roll_no: '101',
      name: 'Alexander Wright',
      class: 'Class 10',
      section: 'A',
      gender: 'Male',
      dob: '2009-04-12',
      email: 'alex.w@school.com',
      phone: '+1 555-0192',
      guardian_name: 'Robert Wright',
      guardian_phone: '+1 555-0188',
      address: '742 Evergreen Terrace, Springfield',
      status: 'Active',
      created_at: '2025-09-01',
    }
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <div class="max-w-4xl mx-auto space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between border-b border-slate-200 pb-4">
      <div class="flex items-center space-x-3">
        <router-link to="/students">
          <BaseButton variant="ghost" size="sm">
            &larr; Back
          </BaseButton>
        </router-link>
        <h2 class="text-2xl font-bold text-slate-800">Student Profile</h2>
      </div>

      <div v-if="student" class="flex items-center space-x-2">
        <router-link :to="`/students/${student.id}/edit`">
          <BaseButton variant="primary" size="md">
            <template #icon-left>
              <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </template>
            Edit Profile
          </BaseButton>
        </router-link>
      </div>
    </div>

    <div v-if="isLoading" class="bg-white rounded-2xl p-12 text-center border border-slate-100">
      <LoadingSpinner size="lg" />
      <p class="text-slate-500 text-sm mt-3">Fetching profile details...</p>
    </div>

    <div v-else-if="student" class="space-y-6">
      <!-- Top Overview Card -->
      <div class="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
        <div class="w-24 h-24 rounded-2xl bg-indigo-100 text-indigo-700 font-extrabold text-3xl flex items-center justify-center border-2 border-indigo-200 shrink-0">
          {{ student.name ? student.name.charAt(0).toUpperCase() : 'S' }}
        </div>
        <div class="text-center sm:text-left flex-1">
          <div class="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h3 class="text-2xl font-bold text-slate-900">{{ student.name }}</h3>
            <span
              class="px-2.5 py-0.5 rounded-full text-xs font-semibold"
              :class="student.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-600 border border-slate-200'"
            >
              {{ student.status || 'Active' }}
            </span>
          </div>

          <p class="text-xs text-slate-500 mt-1 font-medium">
            Roll #{{ student.roll_no }} &bull; {{ student.class }} (Section {{ student.section || 'A' }})
          </p>

          <div class="mt-4 flex flex-wrap justify-center sm:justify-start gap-4 text-xs text-slate-600">
            <div class="flex items-center">
              <svg class="w-4 h-4 mr-1.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              {{ student.email || 'N/A' }}
            </div>

            <div class="flex items-center">
              <svg class="w-4 h-4 mr-1.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              {{ student.phone || 'N/A' }}
            </div>
          </div>
        </div>
      </div>

      <!-- Information Details Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Academic Details Card -->
        <div class="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs space-y-4">
          <h4 class="text-sm font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center">
            <svg class="w-4 h-4 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0112 20.055a11.952 11.952 0 01-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
            </svg>
            Academic Details
          </h4>

          <dl class="grid grid-cols-2 gap-4 text-xs">
            <div>
              <dt class="text-slate-400 font-medium">Roll Number</dt>
              <dd class="text-slate-800 font-bold mt-1">#{{ student.roll_no }}</dd>
            </div>
            <div>
              <dt class="text-slate-400 font-medium">Class</dt>
              <dd class="text-slate-800 font-bold mt-1">{{ student.class }}</dd>
            </div>
            <div>
              <dt class="text-slate-400 font-medium">Section</dt>
              <dd class="text-slate-800 font-bold mt-1">Section {{ student.section || 'A' }}</dd>
            </div>
            <div>
              <dt class="text-slate-400 font-medium">Gender</dt>
              <dd class="text-slate-800 font-bold mt-1">{{ student.gender || 'Not specified' }}</dd>
            </div>
          </dl>
        </div>

        <!-- Guardian & Contact Card -->
        <div class="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs space-y-4">
          <h4 class="text-sm font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center">
            <svg class="w-4 h-4 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Guardian & Personal Info
          </h4>

          <dl class="grid grid-cols-2 gap-4 text-xs">
            <div>
              <dt class="text-slate-400 font-medium">Guardian Name</dt>
              <dd class="text-slate-800 font-bold mt-1">{{ student.guardian_name || 'N/A' }}</dd>
            </div>
            <div>
              <dt class="text-slate-400 font-medium">Guardian Contact</dt>
              <dd class="text-slate-800 font-bold mt-1">{{ student.guardian_phone || 'N/A' }}</dd>
            </div>
            <div>
              <dt class="text-slate-400 font-medium">Date of Birth</dt>
              <dd class="text-slate-800 font-bold mt-1">{{ student.dob || 'N/A' }}</dd>
            </div>
            <div>
              <dt class="text-slate-400 font-medium">Residential Address</dt>
              <dd class="text-slate-800 font-bold mt-1 truncate">{{ student.address || 'N/A' }}</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  </div>
</template>
