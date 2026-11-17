<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import staffService from '../../services/staffService'

const router = useRouter()

const form = ref({
  emp_id: '',
  name: '',
  role: '',
  phone: '',
  email: '',
  status: 'Active',
})

const submitting = ref(false)

const handleSubmit = async () => {
  submitting.value = true

  const payload = {
    employee_id: form.value.emp_id || `S-${Math.floor(200 + Math.random() * 900)}`,
    name: form.value.name,
    designation: form.value.role,
    phone: form.value.phone || null,
    email: form.value.email || null,
  }

  try {
    await staffService.create(payload)
  } catch (error) {
    console.error('API save error:', error)
  } finally {
    submitting.value = false
    router.push('/staff')
  }
}
</script>

<template>
  <div class="max-w-3xl mx-auto">
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-slate-800">Add Staff Member</h1>
        <p class="text-slate-500">Register administrative or operational staff.</p>
      </div>
      <router-link to="/staff" class="text-slate-600 hover:text-slate-800 text-sm font-medium">
        &larr; Back to List
      </router-link>
    </div>

    <form @submit.prevent="handleSubmit" class="bg-white rounded-xl p-6 shadow-sm border border-slate-100 space-y-4">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Employee ID</label>
          <input v-model="form.emp_id" type="text" required placeholder="e.g. S-204" class="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500 text-sm" />
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
          <input v-model="form.name" type="text" required placeholder="e.g. Marcus Brody" class="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500 text-sm" />
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Role / Designation</label>
          <input v-model="form.role" type="text" required placeholder="e.g. Librarian, Accountant" class="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500 text-sm" />
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
          <input v-model="form.phone" type="text" placeholder="+1 555-0000" class="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500 text-sm" />
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
          <input v-model="form.email" type="email" placeholder="staff@school.com" class="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500 text-sm" />
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Status</label>
          <select v-model="form.status" class="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500 text-sm">
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      <div class="pt-4 flex justify-end gap-3">
        <router-link to="/staff" class="rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">Cancel</router-link>
        <button type="submit" :disabled="submitting" class="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 font-medium">Save Staff Member</button>
      </div>
    </form>
  </div>
</template>
