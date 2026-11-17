<script setup>
import { ref, onMounted } from 'vue'
import subjectService from '../../services/subjectService'

const subjects = ref([])
const loading = ref(false)
const search = ref('')

const showModal = ref(false)
const isEditing = ref(false)
const editingId = ref(null)

const form = ref({
  code: '',
  name: '',
  type: 'Theory',
  class_name: 'Grade 10',
})

const mockSubjects = [
  { id: 1, code: 'SUB-MATH', name: 'Advanced Mathematics', type: 'Theory & Practical', class_name: 'Grade 10' },
  { id: 2, code: 'SUB-PHY', name: 'General Physics', type: 'Practical', class_name: 'Grade 10' },
  { id: 3, code: 'SUB-ENG', name: 'English Literature', type: 'Theory', class_name: 'Grade 9' },
  { id: 4, code: 'SUB-CHEM', name: 'Organic Chemistry', type: 'Theory & Practical', class_name: 'Grade 10' },
]

const loadSubjects = async () => {
  loading.value = true
  try {
    const res = await subjectService.getAll({ search: search.value })
    const data = res.data?.data?.data || res.data?.data || res.data || []
    if (Array.isArray(data) && data.length > 0) {
      subjects.value = data
    } else {
      subjects.value = mockSubjects.filter(s =>
        !search.value ||
        s.name.toLowerCase().includes(search.value.toLowerCase()) ||
        s.code.toLowerCase().includes(search.value.toLowerCase())
      )
    }
  } catch (err) {
    subjects.value = mockSubjects.filter(s =>
      !search.value ||
      s.name.toLowerCase().includes(search.value.toLowerCase()) ||
      s.code.toLowerCase().includes(search.value.toLowerCase())
    )
  } finally {
    loading.value = false
  }
}

const openCreateModal = () => {
  isEditing.value = false
  editingId.value = null
  form.value = { code: '', name: '', type: 'Theory', class_name: 'Grade 10' }
  showModal.value = true
}

const openEditModal = (item) => {
  isEditing.value = true
  editingId.value = item.id
  form.value = { ...item }
  showModal.value = true
}

const saveSubject = async () => {
  try {
    if (isEditing.value && editingId.value) {
      await subjectService.update(editingId.value, form.value)
      const index = subjects.value.findIndex(s => s.id === editingId.value)
      if (index !== -1) subjects.value[index] = { ...form.value, id: editingId.value }
    } else {
      const res = await subjectService.create(form.value)
      const newSubject = res.data?.data || res.data || { ...form.value, id: Date.now() }
      subjects.value.unshift(newSubject)
    }
  } catch (err) {
    if (isEditing.value && editingId.value) {
      const index = subjects.value.findIndex(s => s.id === editingId.value)
      if (index !== -1) subjects.value[index] = { ...form.value, id: editingId.value }
    } else {
      subjects.value.unshift({ ...form.value, id: Date.now() })
    }
  } finally {
    showModal.value = false
  }
}

const deleteSubject = async (id) => {
  if (!confirm('Are you sure you want to delete this subject?')) return
  try {
    await subjectService.delete(id)
  } catch (err) {
    console.error(err)
  } finally {
    subjects.value = subjects.value.filter(s => s.id !== id)
  }
}

onMounted(loadSubjects)
</script>

<template>
  <div>
    <!-- Header -->
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-slate-800">Subjects & Curriculum</h1>
        <p class="text-slate-500">Configure course catalog and subject codes.</p>
      </div>
      <button
        @click="openCreateModal"
        class="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 font-medium text-sm"
      >
        + Add Subject
      </button>
    </div>

    <!-- Search -->
    <div class="mb-5 rounded-xl bg-white p-4 shadow-sm">
      <input
        v-model="search"
        @keyup.enter="loadSubjects"
        type="text"
        placeholder="Search subject by title or code..."
        class="w-full rounded-lg border border-slate-300 px-4 py-2 outline-none focus:border-blue-500 text-sm"
      />
    </div>

    <!-- Table -->
    <div class="overflow-hidden rounded-xl bg-white shadow-sm border border-slate-100">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead class="bg-slate-50 border-b border-slate-200">
            <tr>
              <th class="px-6 py-4 font-semibold text-slate-700 text-sm">Subject Code</th>
              <th class="px-6 py-4 font-semibold text-slate-700 text-sm">Subject Title</th>
              <th class="px-6 py-4 font-semibold text-slate-700 text-sm">Course Type</th>
              <th class="px-6 py-4 font-semibold text-slate-700 text-sm">Class</th>
              <th class="px-6 py-4 font-semibold text-slate-700 text-sm">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in subjects" :key="item.id" class="border-b border-slate-100 hover:bg-slate-50/50">
              <td class="px-6 py-4 text-sm">
                <span class="rounded bg-amber-50 px-2.5 py-1 font-bold text-amber-700 text-xs">{{ item.code }}</span>
              </td>
              <td class="px-6 py-4 text-sm font-semibold text-slate-900">{{ item.name }}</td>
              <td class="px-6 py-4 text-sm text-slate-600">{{ item.type || 'Theory' }}</td>
              <td class="px-6 py-4 text-sm text-slate-600">{{ item.class_name || '-' }}</td>
              <td class="px-6 py-4 text-sm">
                <div class="flex items-center gap-3">
                  <button @click="openEditModal(item)" class="text-green-600 font-medium hover:underline">Edit</button>
                  <button @click="deleteSubject(item.id)" class="text-red-600 font-medium hover:underline">Delete</button>
                </div>
              </td>
            </tr>
            <tr v-if="!loading && subjects.length === 0">
              <td colspan="5" class="px-6 py-10 text-center text-slate-500">No subjects found.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div class="w-full max-w-md bg-white rounded-xl p-6 shadow-xl space-y-4">
        <h2 class="text-xl font-bold text-slate-800">{{ isEditing ? 'Edit Subject' : 'Add New Subject' }}</h2>
        <form @submit.prevent="saveSubject" class="space-y-4">
          <div>
            <label class="block text-xs font-semibold text-slate-600 mb-1">Subject Code</label>
            <input v-model="form.code" type="text" required placeholder="e.g. SUB-MATH" class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500" />
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-600 mb-1">Subject Title</label>
            <input v-model="form.name" type="text" required placeholder="e.g. Advanced Mathematics" class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500" />
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-600 mb-1">Course Type</label>
            <select v-model="form.type" class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500">
              <option value="Theory">Theory</option>
              <option value="Practical">Practical</option>
              <option value="Theory & Practical">Theory & Practical</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-600 mb-1">Target Class</label>
            <input v-model="form.class_name" type="text" placeholder="e.g. Grade 10" class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500" />
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
