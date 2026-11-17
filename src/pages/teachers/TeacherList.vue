<script setup>
import { ref, onMounted } from 'vue'
import teacherService from '../../services/teacherService'

const teachers = ref([])
const loading = ref(false)
const search = ref('')

const mockTeachers = [
  { id: 1, emp_id: 'T-101', name: 'Dr. Sarah Jenkins', subject: 'Mathematics', phone: '+1 555-8821', email: 's.jenkins@school.com', status: 'Active' },
  { id: 2, emp_id: 'T-102', name: 'Prof. David Miller', subject: 'Physics', phone: '+1 555-8822', email: 'd.miller@school.com', status: 'Active' },
  { id: 3, emp_id: 'T-103', name: 'Ms. Emily Watson', subject: 'English', phone: '+1 555-8823', email: 'e.watson@school.com', status: 'Active' },
  { id: 4, emp_id: 'T-104', name: 'Mr. Robert Harris', subject: 'Chemistry', phone: '+1 555-8824', email: 'r.harris@school.com', status: 'On Leave' },
]

const getCustomTeachers = () => {
  try {
    return JSON.parse(localStorage.getItem('custom_teachers') || '[]')
  } catch {
    return []
  }
}

const loadTeachers = async () => {
  loading.value = true
  const custom = getCustomTeachers()
  try {
    const response = await teacherService.getAll({ search: search.value })
    const data = response.data?.data?.data || response.data?.data || response.data || []
    if (Array.isArray(data) && data.length > 0) {
      teachers.value = filterList([...custom, ...data])
    } else {
      teachers.value = filterList([...custom, ...mockTeachers])
    }
  } catch (error) {
    teachers.value = filterList([...custom, ...mockTeachers])
  } finally {
    loading.value = false
  }
}

const filterList = (list) => {
  if (!search.value) return list
  const q = search.value.toLowerCase()
  return list.filter(t =>
    t.name.toLowerCase().includes(q) ||
    t.subject.toLowerCase().includes(q) ||
    t.emp_id.toLowerCase().includes(q)
  )
}

const deleteTeacher = async (id) => {
  if (!confirm('Are you sure you want to delete this teacher?')) return
  try {
    await teacherService.delete(id)
  } catch (error) {
    console.error(error)
  } finally {
    const custom = getCustomTeachers().filter(t => t.id !== id)
    localStorage.setItem('custom_teachers', JSON.stringify(custom))
    teachers.value = teachers.value.filter(t => t.id !== id)
  }
}

onMounted(loadTeachers)
</script>

<template>
  <div>
    <!-- Header -->
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-slate-800">Teachers Directory</h1>
        <p class="text-slate-500">Manage all teaching faculty records.</p>
      </div>
      <router-link
        to="/teachers/create"
        class="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 font-medium text-sm"
      >
        + Add Teacher
      </router-link>
    </div>

    <!-- Search -->
    <div class="mb-5 rounded-xl bg-white p-4 shadow-sm">
      <input
        v-model="search"
        @keyup.enter="loadTeachers"
        type="text"
        placeholder="Search teacher by name, subject, ID..."
        class="w-full rounded-lg border border-slate-300 px-4 py-2 outline-none focus:border-blue-500 text-sm"
      />
    </div>

    <!-- Table -->
    <div class="overflow-hidden rounded-xl bg-white shadow-sm border border-slate-100">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead class="bg-slate-50 border-b border-slate-200">
            <tr>
              <th class="px-4 py-3 font-semibold text-slate-700 text-xs uppercase tracking-wider">Emp ID</th>
              <th class="px-4 py-3 font-semibold text-slate-700 text-xs uppercase tracking-wider">Teacher Name</th>
              <th class="px-4 py-3 font-semibold text-slate-700 text-xs uppercase tracking-wider">Designation</th>
              <th class="px-4 py-3 font-semibold text-slate-700 text-xs uppercase tracking-wider">Qualification</th>
              <th class="px-4 py-3 font-semibold text-slate-700 text-xs uppercase tracking-wider">Joining Date</th>
              <th class="px-4 py-3 font-semibold text-slate-700 text-xs uppercase tracking-wider">Salary</th>
              <th class="px-4 py-3 font-semibold text-slate-700 text-xs uppercase tracking-wider">Phone</th>
              <th class="px-4 py-3 font-semibold text-slate-700 text-xs uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="teacher in teachers"
              :key="teacher.id"
              class="border-b border-slate-100 hover:bg-slate-50/50 transition-colors text-xs"
            >
              <td class="px-4 py-3 font-medium text-slate-900">
                <span class="rounded bg-emerald-50 px-2 py-1 text-emerald-700 font-semibold">{{ teacher.employee_id || teacher.emp_id || `T-${teacher.id}` }}</span>
              </td>
              <td class="px-4 py-3 font-medium text-slate-900">
                {{ teacher.name || teacher.user?.name || 'Teacher' }}
                <span class="block text-[11px] text-slate-400 font-normal">{{ teacher.email || teacher.user?.email || '' }}</span>
              </td>
              <td class="px-4 py-3 text-slate-600">{{ teacher.designation || teacher.subject || '-' }}</td>
              <td class="px-4 py-3 text-slate-600">{{ teacher.qualification || '-' }}</td>
              <td class="px-4 py-3 text-slate-600">{{ teacher.joining_date || '-' }}</td>
              <td class="px-4 py-3 text-slate-600 font-medium">{{ teacher.salary ? `$${teacher.salary}` : '-' }}</td>
              <td class="px-4 py-3 text-slate-600">{{ teacher.phone || '-' }}</td>
              <td class="px-4 py-3">
                <div class="flex items-center gap-2">
                  <router-link :to="`/teachers/${teacher.id}`" class="text-blue-600 font-medium hover:underline">View</router-link>
                  <router-link :to="`/teachers/${teacher.id}/edit`" class="text-green-600 font-medium hover:underline">Edit</router-link>
                  <button type="button" @click="deleteTeacher(teacher.id)" class="text-red-600 font-medium hover:underline">Delete</button>
                </div>
              </td>
            </tr>
            <tr v-if="!loading && teachers.length === 0">
              <td colspan="8" class="px-6 py-10 text-center text-slate-500">No teachers found.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
