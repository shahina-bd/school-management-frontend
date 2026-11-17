<script setup>
import { ref, onMounted } from 'vue'
import api from '../../services/api'
import studentService from '../../services/studentService'
import teacherService from '../../services/teacherService'
import staffService from '../../services/staffService'
import classService from '../../services/classService'
import noticeService from '../../services/noticeService'

const stats = ref({
  students: 0,
  staff: 0,
  present: 0,
  absent: 0,
})

const loading = ref(true)

// Quick Add Modal state
const showQuickAddModal = ref(false)
const entityType = ref('student')
const isSubmitting = ref(false)
const successMsg = ref('')
const errorMsg = ref('')

const quickForm = ref({
  name: '',
  roll_no: '',
  email: '',
  phone: '',
  role: 'Librarian',
  subject: 'Mathematics',
  code: 'G-10',
  title: '',
  audience: 'All Students & Staff',
})

const loadDashboardData = async () => {
  loading.value = true
  try {
    const res = await api.get('/dashboard')
    const data = res.data?.data || res.data
    if (data) {
      if (data.students) stats.value.students = data.students.total ?? 0
      if (data.staff) stats.value.staff = data.staff.total ?? 0
      if (data.attendance) {
        stats.value.present = data.attendance.present ?? 0
        stats.value.absent = data.attendance.absent ?? 0
      }
    }
  } catch (err) {
    console.warn('Dashboard API offline, fetching students count directly:', err)
    try {
      const stRes = await studentService.getAll()
      const list = stRes.data?.data?.data || stRes.data?.data || stRes.data || []
      stats.value.students = Array.isArray(list) ? list.length : 0
    } catch (e) {
      stats.value.students = 4
    }
  } finally {
    loading.value = false
  }
}

const openQuickAdd = (type) => {
  entityType.value = type
  const uniqueId = Math.floor(1000 + Math.random() * 9000)
  quickForm.value = {
    name: '',
    roll_no: `STU-${Date.now().toString().slice(-4)}${uniqueId}`,
    email: '',
    phone: '',
    role: 'Librarian',
    subject: 'Mathematics',
    code: `G-${uniqueId}`,
    title: '',
    audience: 'All Students & Staff',
  }
  successMsg.value = ''
  errorMsg.value = ''
  showQuickAddModal.value = true
}

const handleQuickSubmit = async () => {
  isSubmitting.value = true
  successMsg.value = ''
  errorMsg.value = ''

  try {
    if (entityType.value === 'student') {
      const nameParts = quickForm.value.name.trim().split(' ')
      const firstName = nameParts[0] || 'Student'
      const lastName = nameParts.slice(1).join(' ') || ''
      const uniqueId = quickForm.value.roll_no || `STU-${Date.now()}`

      const dbPayload = {
        admission_number: uniqueId,
        student_id: uniqueId,
        roll_number: uniqueId,
        first_name: firstName,
        last_name: lastName,
        name: quickForm.value.name,
        phone: quickForm.value.phone || null,
        email: quickForm.value.email || null,
        status: 'active',
        gender: 'male',
      }

      const res = await studentService.create(dbPayload)
      console.log('Saved student directly to MySQL:', res.data)
      stats.value.students += 1
      successMsg.value = `Student "${quickForm.value.name}" saved to MySQL database!`
    } else if (entityType.value === 'teacher') {
      const empId = `T-${Date.now().toString().slice(-4)}${Math.floor(100 + Math.random() * 900)}`
      const dbPayload = {
        employee_id: empId,
        name: quickForm.value.name,
        designation: `${quickForm.value.subject || 'Faculty'} Teacher`,
        phone: quickForm.value.phone || null,
        email: quickForm.value.email || null,
      }

      const res = await teacherService.create(dbPayload)
      console.log('Saved teacher directly to MySQL:', res.data)
      stats.value.staff += 1
      successMsg.value = `Teacher "${quickForm.value.name}" saved to MySQL database!`
    } else if (entityType.value === 'staff') {
      const empId = `S-${Date.now().toString().slice(-4)}${Math.floor(100 + Math.random() * 900)}`
      const dbPayload = {
        employee_id: empId,
        name: quickForm.value.name,
        designation: quickForm.value.role || 'Staff',
        department: 'General Administration',
        phone: quickForm.value.phone || null,
        email: quickForm.value.email || null,
      }

      const res = await staffService.create(dbPayload)
      console.log('Saved staff directly to MySQL:', res.data)
      stats.value.staff += 1
      successMsg.value = `Staff "${quickForm.value.name}" saved to MySQL database!`
    } else if (entityType.value === 'class') {
      const dbPayload = {
        name: quickForm.value.name,
        code: quickForm.value.code,
      }

      const res = await classService.create(dbPayload)
      console.log('Saved class directly to MySQL:', res.data)
      successMsg.value = `Class "${quickForm.value.name}" saved to MySQL database!`
    } else if (entityType.value === 'notice') {
      const dbPayload = {
        title: quickForm.value.title,
        content: quickForm.value.title,
        target_audience: quickForm.value.audience,
        publish_date: new Date().toISOString().split('T')[0],
      }

      const res = await noticeService.create(dbPayload)
      console.log('Saved notice directly to MySQL:', res.data)
      successMsg.value = `Notice "${quickForm.value.title}" saved to MySQL database!`
    }

    setTimeout(() => {
      showQuickAddModal.value = false
    }, 1500)
  } catch (err) {
    console.error('MySQL Save error:', err)
    if (err.response && err.response.data && err.response.data.errors) {
      const errObj = err.response.data.errors
      const firstKey = Object.keys(errObj)[0]
      errorMsg.value = errObj[firstKey][0] || 'Validation error'
    } else {
      errorMsg.value = err.response?.data?.message || err.message || 'Database insert failed'
    }
  } finally {
    isSubmitting.value = false
  }
}

onMounted(loadDashboardData)
</script>

<template>
  <div class="space-y-6">
    <!-- Top Banner & Quick Add Actions -->
    <div class="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold">School ERP Dashboard</h1>
        <p class="text-blue-100 text-sm mt-1">Manage school admissions, faculty, finances, and notices.</p>
      </div>

      <div class="flex flex-wrap gap-2">
        <button
          @click="openQuickAdd('student')"
          class="rounded-lg bg-white/20 hover:bg-white/30 backdrop-blur-md px-3.5 py-2 text-xs font-semibold text-white transition-all flex items-center gap-1.5"
        >
          <span>+ Add Student</span>
        </button>

        <button
          @click="openQuickAdd('teacher')"
          class="rounded-lg bg-white/20 hover:bg-white/30 backdrop-blur-md px-3.5 py-2 text-xs font-semibold text-white transition-all flex items-center gap-1.5"
        >
          <span>+ Add Teacher</span>
        </button>

        <button
          @click="openQuickAdd('staff')"
          class="rounded-lg bg-white/20 hover:bg-white/30 backdrop-blur-md px-3.5 py-2 text-xs font-semibold text-white transition-all flex items-center gap-1.5"
        >
          <span>+ Add Staff</span>
        </button>

        <button
          @click="openQuickAdd('class')"
          class="rounded-lg bg-white/20 hover:bg-white/30 backdrop-blur-md px-3.5 py-2 text-xs font-semibold text-white transition-all flex items-center gap-1.5"
        >
          <span>+ Add Class</span>
        </button>

        <button
          @click="openQuickAdd('notice')"
          class="rounded-lg bg-white/20 hover:bg-white/30 backdrop-blur-md px-3.5 py-2 text-xs font-semibold text-white transition-all flex items-center gap-1.5"
        >
          <span>+ Post Notice</span>
        </button>
      </div>
    </div>

    <!-- Stat Cards Grid -->
    <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      <div class="rounded-xl bg-white p-5 shadow-sm border border-slate-100 flex items-center justify-between">
        <div>
          <p class="text-xs font-semibold uppercase text-slate-500 tracking-wider">Total Students</p>
          <h2 class="mt-1 text-3xl font-bold text-slate-800">{{ stats.students }}</h2>
        </div>
        <div class="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl font-bold">
          🎓
        </div>
      </div>

      <div class="rounded-xl bg-white p-5 shadow-sm border border-slate-100 flex items-center justify-between">
        <div>
          <p class="text-xs font-semibold uppercase text-slate-500 tracking-wider">Faculty & Staff</p>
          <h2 class="mt-1 text-3xl font-bold text-slate-800">{{ stats.staff }}</h2>
        </div>
        <div class="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl font-bold">
          👨‍🏫
        </div>
      </div>

      <div class="rounded-xl bg-white p-5 shadow-sm border border-slate-100 flex items-center justify-between">
        <div>
          <p class="text-xs font-semibold uppercase text-slate-500 tracking-wider">Present Today</p>
          <h2 class="mt-1 text-3xl font-bold text-slate-800">{{ stats.present }}</h2>
        </div>
        <div class="w-12 h-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center text-xl font-bold">
          ✓
        </div>
      </div>

      <div class="rounded-xl bg-white p-5 shadow-sm border border-slate-100 flex items-center justify-between">
        <div>
          <p class="text-xs font-semibold uppercase text-slate-500 tracking-wider">Absent Today</p>
          <h2 class="mt-1 text-3xl font-bold text-slate-800">{{ stats.absent }}</h2>
        </div>
        <div class="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-xl font-bold">
          ⚠️
        </div>
      </div>
    </div>

    <!-- Quick Module Navigation Cards -->
    <div class="bg-white rounded-xl p-6 border border-slate-100 shadow-sm space-y-4">
      <h2 class="text-lg font-bold text-slate-800">System Modules</h2>
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <router-link to="/students" class="p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-blue-50 transition-all text-center space-y-2 block">
          <div class="text-2xl">🎓</div>
          <p class="text-xs font-bold text-slate-800">Students</p>
        </router-link>

        <router-link to="/teachers" class="p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-emerald-50 transition-all text-center space-y-2 block">
          <div class="text-2xl">👨‍🏫</div>
          <p class="text-xs font-bold text-slate-800">Teachers</p>
        </router-link>

        <router-link to="/staff" class="p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-indigo-50 transition-all text-center space-y-2 block">
          <div class="text-2xl">👥</div>
          <p class="text-xs font-bold text-slate-800">Staff</p>
        </router-link>

        <router-link to="/classes" class="p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-amber-50 transition-all text-center space-y-2 block">
          <div class="text-2xl">🏫</div>
          <p class="text-xs font-bold text-slate-800">Classes</p>
        </router-link>

        <router-link to="/fees" class="p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-green-50 transition-all text-center space-y-2 block">
          <div class="text-2xl">💰</div>
          <p class="text-xs font-bold text-slate-800">Fees</p>
        </router-link>

        <router-link to="/notices" class="p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-rose-50 transition-all text-center space-y-2 block">
          <div class="text-2xl">📢</div>
          <p class="text-xs font-bold text-slate-800">Notices</p>
        </router-link>
      </div>
    </div>

    <!-- Quick Add Modal -->
    <div v-if="showQuickAddModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div class="w-full max-w-md bg-white rounded-xl p-6 shadow-xl space-y-4">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-bold text-slate-800 uppercase tracking-wide text-xs font-bold">
            Add {{ entityType }}
          </h2>
          <button @click="showQuickAddModal = false" class="text-slate-400 hover:text-slate-600 font-bold">&times;</button>
        </div>

        <div v-if="successMsg" class="p-3 rounded-lg bg-green-50 text-green-700 text-xs font-semibold">
          {{ successMsg }}
        </div>

        <div v-if="errorMsg" class="p-3 rounded-lg bg-red-50 text-red-700 text-xs font-semibold">
          {{ errorMsg }}
        </div>

        <form @submit.prevent="handleQuickSubmit" class="space-y-3">
          <div v-if="entityType === 'student'">
            <label class="block text-xs font-semibold text-slate-600 mb-1">Student Full Name</label>
            <input v-model="quickForm.name" type="text" required placeholder="e.g. Alex Morgan" class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500" />
            <label class="block text-xs font-semibold text-slate-600 mt-2 mb-1">Admission / Student ID (Must be unique)</label>
            <input v-model="quickForm.roll_no" type="text" required class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500" />
            <label class="block text-xs font-semibold text-slate-600 mt-2 mb-1">Email</label>
            <input v-model="quickForm.email" type="email" placeholder="alex@school.com" class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500" />
          </div>

          <div v-else-if="entityType === 'teacher'">
            <label class="block text-xs font-semibold text-slate-600 mb-1">Teacher Full Name</label>
            <input v-model="quickForm.name" type="text" required placeholder="e.g. Dr. Sarah Jenkins" class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500" />
            <label class="block text-xs font-semibold text-slate-600 mt-2 mb-1">Primary Subject</label>
            <input v-model="quickForm.subject" type="text" required placeholder="e.g. Mathematics" class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500" />
          </div>

          <div v-else-if="entityType === 'staff'">
            <label class="block text-xs font-semibold text-slate-600 mb-1">Staff Member Name</label>
            <input v-model="quickForm.name" type="text" required placeholder="e.g. Marcus Brody" class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500" />
            <label class="block text-xs font-semibold text-slate-600 mt-2 mb-1">Role / Designation</label>
            <input v-model="quickForm.role" type="text" required placeholder="e.g. Librarian" class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500" />
          </div>

          <div v-else-if="entityType === 'class'">
            <label class="block text-xs font-semibold text-slate-600 mb-1">Class Name</label>
            <input v-model="quickForm.name" type="text" required placeholder="e.g. Grade 10" class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500" />
            <label class="block text-xs font-semibold text-slate-600 mt-2 mb-1">Class Code</label>
            <input v-model="quickForm.code" type="text" required placeholder="e.g. G10" class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500" />
          </div>

          <div v-else-if="entityType === 'notice'">
            <label class="block text-xs font-semibold text-slate-600 mb-1">Notice Title</label>
            <input v-model="quickForm.title" type="text" required placeholder="e.g. Annual Sports Day" class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500" />
          </div>

          <div class="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button type="button" @click="showQuickAddModal = false" class="rounded-lg border border-slate-300 px-4 py-2 text-xs font-medium text-slate-700">Cancel</button>
            <button type="submit" :disabled="isSubmitting" class="rounded-lg bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700">Save Record to MySQL</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
