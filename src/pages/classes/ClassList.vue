<script setup>
import { ref, onMounted } from 'vue'
import classService from '../../services/classService'

const classes = ref([])
const loading = ref(false)
const search = ref('')

const showModal = ref(false)
const isEditing = ref(false)
const editingId = ref(null)

const form = ref({
  name: '',
  code: '',
  total_students: 0,
  class_teacher: '',
})

const mockClasses = [
  { id: 1, name: 'Grade 10', code: 'G10', total_students: 120, class_teacher: 'Dr. Sarah Jenkins' },
  { id: 2, name: 'Grade 9', code: 'G09', total_students: 115, class_teacher: 'Prof. David Miller' },
  { id: 3, name: 'Grade 8', code: 'G08', total_students: 108, class_teacher: 'Ms. Emily Watson' },
  { id: 4, name: 'Grade 7', code: 'G07', total_students: 96, class_teacher: 'Mr. Robert Harris' },
]

const loadClasses = async () => {
  loading.value = true
  try {
    const res = await classService.getAll({ search: search.value })
    const data = res.data?.data?.data || res.data?.data || res.data || []
    if (Array.isArray(data) && data.length > 0) {
      classes.value = data
    } else {
      classes.value = mockClasses.filter(c =>
        !search.value ||
        c.name.toLowerCase().includes(search.value.toLowerCase()) ||
        c.code.toLowerCase().includes(search.value.toLowerCase())
      )
    }
  } catch (err) {
    classes.value = mockClasses.filter(c =>
      !search.value ||
      c.name.toLowerCase().includes(search.value.toLowerCase()) ||
      c.code.toLowerCase().includes(search.value.toLowerCase())
    )
  } finally {
    loading.value = false
  }
}

const openCreateModal = () => {
  isEditing.value = false
  editingId.value = null
  form.value = { name: '', code: '', total_students: 0, class_teacher: '' }
  showModal.value = true
}

const openEditModal = (item) => {
  isEditing.value = true
  editingId.value = item.id
  form.value = { ...item }
  showModal.value = true
}

const saveClass = async () => {
  try {
    if (isEditing.value && editingId.value) {
      await classService.update(editingId.value, form.value)
      const index = classes.value.findIndex(c => c.id === editingId.value)
      if (index !== -1) classes.value[index] = { ...form.value, id: editingId.value }
    } else {
      const res = await classService.create(form.value)
      const newClass = res.data?.data || res.data || { ...form.value, id: Date.now() }
      classes.value.unshift(newClass)
    }
  } catch (err) {
    if (isEditing.value && editingId.value) {
      const index = classes.value.findIndex(c => c.id === editingId.value)
      if (index !== -1) classes.value[index] = { ...form.value, id: editingId.value }
    } else {
      classes.value.unshift({ ...form.value, id: Date.now() })
    }
  } finally {
    showModal.value = false
  }
}

const deleteClass = async (id) => {
  if (!confirm('Are you sure you want to delete this class?')) return
  try {
    await classService.delete(id)
  } catch (err) {
    console.error(err)
  } finally {
    classes.value = classes.value.filter(c => c.id !== id)
  }
}

onMounted(loadClasses)
</script>

<template>
  <div>
    <!-- Header -->
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-slate-800">Classes Management</h1>
        <p class="text-slate-500">Configure academic classes and head teacher assignments.</p>
      </div>
      <button
        @click="openCreateModal"
        class="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 font-medium text-sm"
      >
        + Add Class
      </button>
    </div>

    <!-- Search -->
    <div class="mb-5 rounded-xl bg-white p-4 shadow-sm">
      <input
        v-model="search"
        @keyup.enter="loadClasses"
        type="text"
        placeholder="Search class by name or code..."
        class="w-full rounded-lg border border-slate-300 px-4 py-2 outline-none focus:border-blue-500 text-sm"
      />
    </div>

    <!-- Table -->
    <div class="overflow-hidden rounded-xl bg-white shadow-sm border border-slate-100">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead class="bg-slate-50 border-b border-slate-200">
            <tr>
              <th class="px-6 py-4 font-semibold text-slate-700 text-sm">Class Code</th>
              <th class="px-6 py-4 font-semibold text-slate-700 text-sm">Class Name</th>
              <th class="px-6 py-4 font-semibold text-slate-700 text-sm">Description</th>
              <th class="px-6 py-4 font-semibold text-slate-700 text-sm">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in classes" :key="item.id" class="border-b border-slate-100 hover:bg-slate-50/50">
              <td class="px-6 py-4 text-sm">
                <span class="rounded bg-indigo-50 px-2.5 py-1 font-bold text-indigo-600 text-xs">{{ item.code || '-' }}</span>
              </td>
              <td class="px-6 py-4 text-sm font-semibold text-slate-900">{{ item.name }}</td>
              <td class="px-6 py-4 text-sm text-slate-600">{{ item.description || '-' }}</td>
              <td class="px-6 py-4 text-sm">
                <div class="flex items-center gap-3">
                  <button @click="openEditModal(item)" class="text-green-600 font-medium hover:underline">Edit</button>
                  <button @click="deleteClass(item.id)" class="text-red-600 font-medium hover:underline">Delete</button>
                </div>
              </td>
            </tr>
            <tr v-if="!loading && classes.length === 0">
              <td colspan="4" class="px-6 py-10 text-center text-slate-500">No classes found.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div class="w-full max-w-md bg-white rounded-xl p-6 shadow-xl space-y-4">
        <h2 class="text-xl font-bold text-slate-800">{{ isEditing ? 'Edit Class' : 'Add New Class' }}</h2>
        <form @submit.prevent="saveClass" class="space-y-4">
          <div>
            <label class="block text-xs font-semibold text-slate-600 mb-1">Class Name</label>
            <input v-model="form.name" type="text" required placeholder="e.g. Grade 10" class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500" />
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-600 mb-1">Class Code</label>
            <input v-model="form.code" type="text" placeholder="e.g. G10" class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500" />
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-600 mb-1">Description</label>
            <textarea v-model="form.description" rows="2" placeholder="Class notes or description..." class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"></textarea>
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
