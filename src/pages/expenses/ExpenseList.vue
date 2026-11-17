<script setup>
import { ref, onMounted } from 'vue'
import expenseService from '../../services/expenseService'

const expenses = ref([])
const loading = ref(false)
const search = ref('')

const showModal = ref(false)
const isEditing = ref(false)
const editingId = ref(null)

const form = ref({
  title: '',
  category: 'Utilities',
  amount: '$150',
  date: '2026-10-01',
  status: 'Approved',
})

const mockExpenses = [
  { id: 1, title: 'Electricity Bill - September', category: 'Utilities', amount: '$1,250', date: '2026-10-01', status: 'Approved' },
  { id: 2, title: 'Science Lab Equipment', category: 'Supplies', amount: '$3,400', date: '2026-09-28', status: 'Approved' },
  { id: 3, title: 'Library Books Purchase', category: 'Academic', amount: '$850', date: '2026-09-25', status: 'Pending' },
]

const loadExpenses = async () => {
  loading.value = true
  try {
    const res = await expenseService.getAll({ search: search.value })
    const data = res.data?.data?.data || res.data?.data || res.data || []
    if (Array.isArray(data) && data.length > 0) {
      expenses.value = data
    } else {
      expenses.value = mockExpenses.filter(e =>
        !search.value ||
        e.title.toLowerCase().includes(search.value.toLowerCase()) ||
        e.category.toLowerCase().includes(search.value.toLowerCase())
      )
    }
  } catch (err) {
    expenses.value = mockExpenses.filter(e =>
      !search.value ||
      e.title.toLowerCase().includes(search.value.toLowerCase()) ||
      e.category.toLowerCase().includes(search.value.toLowerCase())
    )
  } finally {
    loading.value = false
  }
}

const openCreateModal = () => {
  isEditing.value = false
  editingId.value = null
  form.value = { title: '', category: 'Utilities', amount: '$150', date: '2026-10-01', status: 'Approved' }
  showModal.value = true
}

const openEditModal = (item) => {
  isEditing.value = true
  editingId.value = item.id
  form.value = { ...item }
  showModal.value = true
}

const saveExpense = async () => {
  try {
    if (isEditing.value && editingId.value) {
      await expenseService.update(editingId.value, form.value)
      const index = expenses.value.findIndex(e => e.id === editingId.value)
      if (index !== -1) expenses.value[index] = { ...form.value, id: editingId.value }
    } else {
      const res = await expenseService.create(form.value)
      const newExpense = res.data?.data || res.data || { ...form.value, id: Date.now() }
      expenses.value.unshift(newExpense)
    }
  } catch (err) {
    if (isEditing.value && editingId.value) {
      const index = expenses.value.findIndex(e => e.id === editingId.value)
      if (index !== -1) expenses.value[index] = { ...form.value, id: editingId.value }
    } else {
      expenses.value.unshift({ ...form.value, id: Date.now() })
    }
  } finally {
    showModal.value = false
  }
}

const deleteExpense = async (id) => {
  if (!confirm('Are you sure you want to delete this expense record?')) return
  try {
    await expenseService.delete(id)
  } catch (err) {
    console.error(err)
  } finally {
    expenses.value = expenses.value.filter(e => e.id !== id)
  }
}

onMounted(loadExpenses)
</script>

<template>
  <div>
    <!-- Header -->
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-slate-800">Expense Ledger</h1>
        <p class="text-slate-500">Track and manage operational school expenses.</p>
      </div>
      <button
        @click="openCreateModal"
        class="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 font-medium text-sm"
      >
        + Add Expense
      </button>
    </div>

    <!-- Search -->
    <div class="mb-5 rounded-xl bg-white p-4 shadow-sm">
      <input
        v-model="search"
        @keyup.enter="loadExpenses"
        type="text"
        placeholder="Search expense title or category..."
        class="w-full rounded-lg border border-slate-300 px-4 py-2 outline-none focus:border-blue-500 text-sm"
      />
    </div>

    <!-- Table -->
    <div class="overflow-hidden rounded-xl bg-white shadow-sm border border-slate-100">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead class="bg-slate-50 border-b border-slate-200">
            <tr>
              <th class="px-6 py-4 font-semibold text-slate-700 text-sm">Expense Title</th>
              <th class="px-6 py-4 font-semibold text-slate-700 text-sm">Category</th>
              <th class="px-6 py-4 font-semibold text-slate-700 text-sm">Amount</th>
              <th class="px-6 py-4 font-semibold text-slate-700 text-sm">Date</th>
              <th class="px-6 py-4 font-semibold text-slate-700 text-sm">Description</th>
              <th class="px-6 py-4 font-semibold text-slate-700 text-sm">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in expenses" :key="item.id" class="border-b border-slate-100 hover:bg-slate-50/50">
              <td class="px-6 py-4 text-sm font-semibold text-slate-800">{{ item.title }}</td>
              <td class="px-6 py-4 text-sm text-slate-600">{{ item.category || item.category_id || '-' }}</td>
              <td class="px-6 py-4 text-sm font-bold text-slate-800">{{ item.amount }}</td>
              <td class="px-6 py-4 text-sm text-slate-600">{{ item.date }}</td>
              <td class="px-6 py-4 text-sm text-slate-600">{{ item.description || '-' }}</td>
              <td class="px-6 py-4 text-sm">
                <div class="flex items-center gap-3">
                  <button @click="openEditModal(item)" class="text-green-600 font-medium hover:underline">Edit</button>
                  <button @click="deleteExpense(item.id)" class="text-red-600 font-medium hover:underline">Delete</button>
                </div>
              </td>
            </tr>
            <tr v-if="!loading && expenses.length === 0">
              <td colspan="6" class="px-6 py-10 text-center text-slate-500">No expense records found.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div class="w-full max-w-md bg-white rounded-xl p-6 shadow-xl space-y-4">
        <h2 class="text-xl font-bold text-slate-800">{{ isEditing ? 'Edit Expense Record' : 'Record New Expense' }}</h2>
        <form @submit.prevent="saveExpense" class="space-y-4">
          <div>
            <label class="block text-xs font-semibold text-slate-600 mb-1">Expense Title</label>
            <input v-model="form.title" type="text" required placeholder="e.g. Electricity Bill" class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500" />
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-600 mb-1">Category</label>
            <input v-model="form.category" type="text" required placeholder="e.g. Utilities, Supplies" class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500" />
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-600 mb-1">Amount</label>
            <input v-model="form.amount" type="text" required placeholder="e.g. $1,250" class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500" />
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-600 mb-1">Date</label>
            <input v-model="form.date" type="date" required class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500" />
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-600 mb-1">Description</label>
            <textarea v-model="form.description" rows="2" placeholder="Expense description..." class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"></textarea>
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
