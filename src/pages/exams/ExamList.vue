<script setup>
import { ref, onMounted } from 'vue'
import examService from '../../services/examService'

const exams = ref([])
const loading = ref(false)
const search = ref('')

const showModal = ref(false)
const isEditing = ref(false)
const editingId = ref(null)

const form = ref({
  title: '',
  term: 'Mid Term 2026',
  date: '2026-11-10',
  class_name: 'Grade 10',
  status: 'Scheduled',
})

const mockExams = [
  { id: 1, title: 'Mid-Term Science Examination', term: 'Mid Term 2026', date: '2026-11-10', class_name: 'Grade 10', status: 'Scheduled' },
  { id: 2, title: 'Mathematics Assessment #2', term: 'Term 1', date: '2026-10-20', class_name: 'Grade 9', status: 'Scheduled' },
  { id: 3, title: 'English Literature Final', term: 'Final Term', date: '2026-09-15', class_name: 'Grade 10', status: 'Completed' },
]

const loadExams = async () => {
  loading.value = true
  try {
    const res = await examService.getAll({ search: search.value })
    const data = res.data?.data?.data || res.data?.data || res.data || []
    if (Array.isArray(data) && data.length > 0) {
      exams.value = data
    } else {
      exams.value = mockExams.filter(e =>
        !search.value ||
        e.title.toLowerCase().includes(search.value.toLowerCase()) ||
        e.term.toLowerCase().includes(search.value.toLowerCase())
      )
    }
  } catch (err) {
    exams.value = mockExams.filter(e =>
      !search.value ||
      e.title.toLowerCase().includes(search.value.toLowerCase()) ||
      e.term.toLowerCase().includes(search.value.toLowerCase())
    )
  } finally {
    loading.value = false
  }
}

const openCreateModal = () => {
  isEditing.value = false
  editingId.value = null
  form.value = { title: '', term: 'Mid Term 2026', date: '2026-11-10', class_name: 'Grade 10', status: 'Scheduled' }
  showModal.value = true
}

const openEditModal = (item) => {
  isEditing.value = true
  editingId.value = item.id
  form.value = { ...item }
  showModal.value = true
}

const saveExam = async () => {
  try {
    if (isEditing.value && editingId.value) {
      await examService.update(editingId.value, form.value)
      const index = exams.value.findIndex(e => e.id === editingId.value)
      if (index !== -1) exams.value[index] = { ...form.value, id: editingId.value }
    } else {
      const res = await examService.create(form.value)
      const newExam = res.data?.data || res.data || { ...form.value, id: Date.now() }
      exams.value.unshift(newExam)
    }
  } catch (err) {
    if (isEditing.value && editingId.value) {
      const index = exams.value.findIndex(e => e.id === editingId.value)
      if (index !== -1) exams.value[index] = { ...form.value, id: editingId.value }
    } else {
      exams.value.unshift({ ...form.value, id: Date.now() })
    }
  } finally {
    showModal.value = false
  }
}

const deleteExam = async (id) => {
  if (!confirm('Are you sure you want to delete this exam schedule?')) return
  try {
    await examService.delete(id)
  } catch (err) {
    console.error(err)
  } finally {
    exams.value = exams.value.filter(e => e.id !== id)
  }
}

onMounted(loadExams)
</script>

<template>
  <div>
    <!-- Header -->
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-slate-800">Examinations & Schedules</h1>
        <p class="text-slate-500">Plan and schedule academic exams and test terms.</p>
      </div>
      <button
        @click="openCreateModal"
        class="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 font-medium text-sm"
      >
        + Schedule Exam
      </button>
    </div>

    <!-- Search -->
    <div class="mb-5 rounded-xl bg-white p-4 shadow-sm">
      <input
        v-model="search"
        @keyup.enter="loadExams"
        type="text"
        placeholder="Search examination title or term..."
        class="w-full rounded-lg border border-slate-300 px-4 py-2 outline-none focus:border-blue-500 text-sm"
      />
    </div>

    <!-- Table -->
    <div class="overflow-hidden rounded-xl bg-white shadow-sm border border-slate-100">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead class="bg-slate-50 border-b border-slate-200">
            <tr>
              <th class="px-6 py-4 font-semibold text-slate-700 text-sm">Exam Title</th>
              <th class="px-6 py-4 font-semibold text-slate-700 text-sm">Academic Term</th>
              <th class="px-6 py-4 font-semibold text-slate-700 text-sm">Target Class</th>
              <th class="px-6 py-4 font-semibold text-slate-700 text-sm">Date</th>
              <th class="px-6 py-4 font-semibold text-slate-700 text-sm">Status</th>
              <th class="px-6 py-4 font-semibold text-slate-700 text-sm">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in exams" :key="item.id" class="border-b border-slate-100 hover:bg-slate-50/50">
              <td class="px-6 py-4 text-sm font-semibold text-slate-800">{{ item.title }}</td>
              <td class="px-6 py-4 text-sm text-slate-600">{{ item.term }}</td>
              <td class="px-6 py-4 text-sm text-slate-600">{{ item.class_name }}</td>
              <td class="px-6 py-4 text-sm text-slate-600">{{ item.date }}</td>
              <td class="px-6 py-4 text-sm">
                <span
                  class="rounded-full px-3 py-1 text-xs font-semibold"
                  :class="item.status === 'Completed' ? 'bg-slate-100 text-slate-600' : 'bg-blue-100 text-blue-700'"
                >
                  {{ item.status }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm">
                <div class="flex items-center gap-3">
                  <button @click="openEditModal(item)" class="text-green-600 font-medium hover:underline">Edit</button>
                  <button @click="deleteExam(item.id)" class="text-red-600 font-medium hover:underline">Delete</button>
                </div>
              </td>
            </tr>
            <tr v-if="!loading && exams.length === 0">
              <td colspan="6" class="px-6 py-10 text-center text-slate-500">No exams found.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div class="w-full max-w-md bg-white rounded-xl p-6 shadow-xl space-y-4">
        <h2 class="text-xl font-bold text-slate-800">{{ isEditing ? 'Edit Exam Schedule' : 'Schedule New Exam' }}</h2>
        <form @submit.prevent="saveExam" class="space-y-4">
          <div>
            <label class="block text-xs font-semibold text-slate-600 mb-1">Exam Title</label>
            <input v-model="form.title" type="text" required placeholder="e.g. Mid-Term Science Exam" class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500" />
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-600 mb-1">Term</label>
            <input v-model="form.term" type="text" required placeholder="e.g. Mid Term 2026" class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500" />
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-600 mb-1">Class</label>
            <input v-model="form.class_name" type="text" placeholder="e.g. Grade 10" class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500" />
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-600 mb-1">Exam Date</label>
            <input v-model="form.date" type="date" required class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500" />
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-600 mb-1">Status</label>
            <select v-model="form.status" class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500">
              <option value="Scheduled">Scheduled</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
          <div class="flex justify-end gap-3 pt-2">
            <button type="button" @click="showModal = false" class="rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-700">Cancel</button>
            <button type="submit" class="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white font-medium hover:bg-blue-700">Save</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
