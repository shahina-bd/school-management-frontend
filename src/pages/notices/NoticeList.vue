<script setup>
import { ref, onMounted } from 'vue'
import noticeService from '../../services/noticeService'

const notices = ref([])
const loading = ref(false)
const search = ref('')

const showModal = ref(false)
const isEditing = ref(false)
const editingId = ref(null)

const form = ref({
  title: '',
  audience: 'All Students & Staff',
  date: '2026-10-03',
  content: '',
})

const mockNotices = [
  { id: 1, title: 'Annual Sports Day Announcement', audience: 'All Students & Staff', date: '2026-10-03', content: 'Annual sports day will take place on Oct 25th.' },
  { id: 2, title: 'Parent-Teacher Meeting Scheduled', audience: 'Parents & Teachers', date: '2026-09-28', content: 'Parent teacher meeting for Grade 9 & 10.' },
  { id: 3, title: 'Mid-Term Exam Schedule Published', audience: 'Students', date: '2026-09-20', content: 'Exam schedules uploaded on student portal.' },
]

const loadNotices = async () => {
  loading.value = true
  try {
    const res = await noticeService.getAll({ search: search.value })
    const data = res.data?.data?.data || res.data?.data || res.data || []
    if (Array.isArray(data) && data.length > 0) {
      notices.value = data
    } else {
      notices.value = mockNotices.filter(n =>
        !search.value ||
        n.title.toLowerCase().includes(search.value.toLowerCase()) ||
        n.audience.toLowerCase().includes(search.value.toLowerCase())
      )
    }
  } catch (err) {
    notices.value = mockNotices.filter(n =>
      !search.value ||
      n.title.toLowerCase().includes(search.value.toLowerCase()) ||
      n.audience.toLowerCase().includes(search.value.toLowerCase())
    )
  } finally {
    loading.value = false
  }
}

const openCreateModal = () => {
  isEditing.value = false
  editingId.value = null
  form.value = { title: '', audience: 'All Students & Staff', date: '2026-10-03', content: '' }
  showModal.value = true
}

const openEditModal = (item) => {
  isEditing.value = true
  editingId.value = item.id
  form.value = { ...item }
  showModal.value = true
}

const saveNotice = async () => {
  try {
    if (isEditing.value && editingId.value) {
      await noticeService.update(editingId.value, form.value)
      const index = notices.value.findIndex(n => n.id === editingId.value)
      if (index !== -1) notices.value[index] = { ...form.value, id: editingId.value }
    } else {
      const res = await noticeService.create(form.value)
      const newNotice = res.data?.data || res.data || { ...form.value, id: Date.now() }
      notices.value.unshift(newNotice)
    }
  } catch (err) {
    if (isEditing.value && editingId.value) {
      const index = notices.value.findIndex(n => n.id === editingId.value)
      if (index !== -1) notices.value[index] = { ...form.value, id: editingId.value }
    } else {
      notices.value.unshift({ ...form.value, id: Date.now() })
    }
  } finally {
    showModal.value = false
  }
}

const deleteNotice = async (id) => {
  if (!confirm('Are you sure you want to delete this notice?')) return
  try {
    await noticeService.delete(id)
  } catch (err) {
    console.error(err)
  } finally {
    notices.value = notices.value.filter(n => n.id !== id)
  }
}

onMounted(loadNotices)
</script>

<template>
  <div>
    <!-- Header -->
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-slate-800">Notice Board</h1>
        <p class="text-slate-500">Publish announcements and official notices.</p>
      </div>
      <button
        @click="openCreateModal"
        class="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 font-medium text-sm"
      >
        + Post Notice
      </button>
    </div>

    <!-- Search -->
    <div class="mb-5 rounded-xl bg-white p-4 shadow-sm">
      <input
        v-model="search"
        @keyup.enter="loadNotices"
        type="text"
        placeholder="Search notice title or target audience..."
        class="w-full rounded-lg border border-slate-300 px-4 py-2 outline-none focus:border-blue-500 text-sm"
      />
    </div>

    <!-- Notice List Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      <div
        v-for="item in notices"
        :key="item.id"
        class="bg-white rounded-xl p-5 border border-slate-100 shadow-sm flex flex-col justify-between space-y-4"
      >
        <div>
          <div class="flex items-center justify-between text-xs text-slate-400 font-medium mb-2">
            <span>📢 {{ item.audience }}</span>
            <span>{{ item.date }}</span>
          </div>
          <h3 class="text-base font-bold text-slate-800 leading-snug">{{ item.title }}</h3>
          <p class="text-xs text-slate-600 mt-2 line-clamp-3">{{ item.content || 'Official school notice content details.' }}</p>
        </div>

        <div class="pt-3 border-t border-slate-100 flex items-center justify-end gap-3 text-xs font-semibold">
          <button @click="openEditModal(item)" class="text-green-600 hover:underline">Edit Notice</button>
          <button @click="deleteNotice(item.id)" class="text-red-600 hover:underline">Delete</button>
        </div>
      </div>

      <div v-if="!loading && notices.length === 0" class="col-span-full bg-white rounded-xl p-10 text-center text-slate-500">
        No notices found.
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div class="w-full max-w-md bg-white rounded-xl p-6 shadow-xl space-y-4">
        <h2 class="text-xl font-bold text-slate-800">{{ isEditing ? 'Edit Notice' : 'Post New Notice' }}</h2>
        <form @submit.prevent="saveNotice" class="space-y-4">
          <div>
            <label class="block text-xs font-semibold text-slate-600 mb-1">Notice Title</label>
            <input v-model="form.title" type="text" required placeholder="e.g. Sports Day Announcement" class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500" />
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-600 mb-1">Target Audience</label>
            <select v-model="form.audience" class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500">
              <option value="All Students & Staff">All Students & Staff</option>
              <option value="Parents & Teachers">Parents & Teachers</option>
              <option value="Students Only">Students Only</option>
              <option value="Teachers Only">Teachers Only</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-600 mb-1">Notice Date</label>
            <input v-model="form.date" type="date" required class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500" />
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-600 mb-1">Content Details</label>
            <textarea v-model="form.content" rows="3" placeholder="Enter notice description..." class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"></textarea>
          </div>
          <div class="flex justify-end gap-3 pt-2">
            <button type="button" @click="showModal = false" class="rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-700">Cancel</button>
            <button type="submit" class="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white font-medium hover:bg-blue-700">Publish</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
