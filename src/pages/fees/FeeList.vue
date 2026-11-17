<script setup>
import { ref, onMounted } from 'vue'
import feeService from '../../services/feeService'

const fees = ref([])
const loading = ref(false)
const search = ref('')

const showModal = ref(false)
const isEditing = ref(false)
const editingId = ref(null)

const form = ref({
  invoice: '',
  student: '',
  amount: '$450',
  due_date: '2026-10-15',
  status: 'Pending',
})

const mockFees = [
  { id: 1, invoice: 'INV-9001', student: 'Alexander Wright', amount: '$450', due_date: '2026-10-15', status: 'Paid' },
  { id: 2, invoice: 'INV-9002', student: 'Sophia Martinez', amount: '$450', due_date: '2026-10-15', status: 'Pending' },
  { id: 3, invoice: 'INV-9003', student: 'Ethan Hunt', amount: '$400', due_date: '2026-09-30', status: 'Overdue' },
]

const loadFees = async () => {
  loading.value = true
  try {
    const res = await feeService.getAll({ search: search.value })
    const data = res.data?.data?.data || res.data?.data || res.data || []
    if (Array.isArray(data) && data.length > 0) {
      fees.value = data
    } else {
      fees.value = mockFees.filter(f =>
        !search.value ||
        f.student.toLowerCase().includes(search.value.toLowerCase()) ||
        f.invoice.toLowerCase().includes(search.value.toLowerCase())
      )
    }
  } catch (err) {
    fees.value = mockFees.filter(f =>
      !search.value ||
      f.student.toLowerCase().includes(search.value.toLowerCase()) ||
      f.invoice.toLowerCase().includes(search.value.toLowerCase())
    )
  } finally {
    loading.value = false
  }
}

const openCreateModal = () => {
  isEditing.value = false
  editingId.value = null
  form.value = { invoice: `INV-${Math.floor(1000 + Math.random() * 9000)}`, student: '', amount: '$450', due_date: '2026-10-15', status: 'Pending' }
  showModal.value = true
}

const openEditModal = (item) => {
  isEditing.value = true
  editingId.value = item.id
  form.value = { ...item }
  showModal.value = true
}

const saveFee = async () => {
  try {
    if (isEditing.value && editingId.value) {
      await feeService.update(editingId.value, form.value)
      const index = fees.value.findIndex(f => f.id === editingId.value)
      if (index !== -1) fees.value[index] = { ...form.value, id: editingId.value }
    } else {
      const res = await feeService.create(form.value)
      const newFee = res.data?.data || res.data || { ...form.value, id: Date.now() }
      fees.value.unshift(newFee)
    }
  } catch (err) {
    if (isEditing.value && editingId.value) {
      const index = fees.value.findIndex(f => f.id === editingId.value)
      if (index !== -1) fees.value[index] = { ...form.value, id: editingId.value }
    } else {
      fees.value.unshift({ ...form.value, id: Date.now() })
    }
  } finally {
    showModal.value = false
  }
}

const deleteFee = async (id) => {
  if (!confirm('Are you sure you want to delete this fee record?')) return
  try {
    await feeService.delete(id)
  } catch (err) {
    console.error(err)
  } finally {
    fees.value = fees.value.filter(f => f.id !== id)
  }
}

onMounted(loadFees)
</script>

<template>
  <div>
    <!-- Header -->
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-slate-800">Fee Structure & Invoices</h1>
        <p class="text-slate-500">Tuition fee generation and payment management.</p>
      </div>
      <button
        @click="openCreateModal"
        class="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 font-medium text-sm"
      >
        + Generate Invoice
      </button>
    </div>

    <!-- Search -->
    <div class="mb-5 rounded-xl bg-white p-4 shadow-sm">
      <input
        v-model="search"
        @keyup.enter="loadFees"
        type="text"
        placeholder="Search invoice or student name..."
        class="w-full rounded-lg border border-slate-300 px-4 py-2 outline-none focus:border-blue-500 text-sm"
      />
    </div>

    <!-- Table -->
    <div class="overflow-hidden rounded-xl bg-white shadow-sm border border-slate-100">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead class="bg-slate-50 border-b border-slate-200">
            <tr>
              <th class="px-6 py-4 font-semibold text-slate-700 text-sm">Invoice No</th>
              <th class="px-6 py-4 font-semibold text-slate-700 text-sm">Student</th>
              <th class="px-6 py-4 font-semibold text-slate-700 text-sm">Total Amount</th>
              <th class="px-6 py-4 font-semibold text-slate-700 text-sm">Due Date</th>
              <th class="px-6 py-4 font-semibold text-slate-700 text-sm">Status</th>
              <th class="px-6 py-4 font-semibold text-slate-700 text-sm">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in fees" :key="item.id" class="border-b border-slate-100 hover:bg-slate-50/50">
              <td class="px-6 py-4 text-sm font-semibold text-slate-800">{{ item.invoice }}</td>
              <td class="px-6 py-4 text-sm font-medium text-slate-900">{{ item.student }}</td>
              <td class="px-6 py-4 text-sm font-bold text-slate-800">{{ item.amount }}</td>
              <td class="px-6 py-4 text-sm text-slate-600">{{ item.due_date }}</td>
              <td class="px-6 py-4 text-sm">
                <span
                  class="rounded-full px-3 py-1 text-xs font-semibold"
                  :class="{
                    'bg-green-100 text-green-700': item.status === 'Paid',
                    'bg-amber-100 text-amber-700': item.status === 'Pending',
                    'bg-red-100 text-red-700': item.status === 'Overdue'
                  }"
                >
                  {{ item.status }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm">
                <div class="flex items-center gap-3">
                  <button @click="openEditModal(item)" class="text-green-600 font-medium hover:underline">Edit</button>
                  <button @click="deleteFee(item.id)" class="text-red-600 font-medium hover:underline">Delete</button>
                </div>
              </td>
            </tr>
            <tr v-if="!loading && fees.length === 0">
              <td colspan="6" class="px-6 py-10 text-center text-slate-500">No invoices found.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div class="w-full max-w-md bg-white rounded-xl p-6 shadow-xl space-y-4">
        <h2 class="text-xl font-bold text-slate-800">{{ isEditing ? 'Edit Fee Invoice' : 'Generate New Invoice' }}</h2>
        <form @submit.prevent="saveFee" class="space-y-4">
          <div>
            <label class="block text-xs font-semibold text-slate-600 mb-1">Invoice No</label>
            <input v-model="form.invoice" type="text" required class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500" />
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-600 mb-1">Student Name</label>
            <input v-model="form.student" type="text" required placeholder="e.g. Alexander Wright" class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500" />
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-600 mb-1">Amount</label>
            <input v-model="form.amount" type="text" required placeholder="e.g. $450" class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500" />
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-600 mb-1">Due Date</label>
            <input v-model="form.due_date" type="date" required class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500" />
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-600 mb-1">Status</label>
            <select v-model="form.status" class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500">
              <option value="Pending">Pending</option>
              <option value="Paid">Paid</option>
              <option value="Overdue">Overdue</option>
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
