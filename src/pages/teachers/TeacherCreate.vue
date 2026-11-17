<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import teacherService from '../../services/teacherService'

const router = useRouter()

const form = ref({
  emp_id: '',
  name: '',
  subject: '',
  phone: '',
  email: '',
  status: 'Active',
})

const submitting = ref(false)

const handleSubmit = async () => {
  submitting.value = true

  const payload = {
    employee_id: form.value.emp_id || `T-${Math.floor(100 + Math.random() * 900)}`,
    name: form.value.name,
    designation: form.value.subject,
    phone: form.value.phone || null,
    email: form.value.email || null,
  }

  try {
    await teacherService.create(payload)
  } catch (error) {
    console.error('API save error:', error)
  } finally {
    submitting.value = false
    router.push('/teachers')
  }
}
</script>

<template>
  <div class="max-w-3xl mx-auto">
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-slate-800">Add New Teacher</h1>
        <p class="text-slate-500">Enter teacher details to register them in the system.</p>
      </div>
      <router-link to="/teachers" class="text-slate-600 hover:text-slate-800 text-sm font-medium">
        &larr; Back to List
      </router-link>
    </div>

    <form @submit.prevent="handleSubmit" class="bg-white rounded-xl p-6 shadow-sm border border-slate-100 space-y-4">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Employee ID</label>
          <input v-model="form.emp_id" type="text" required placeholder="e.g. T-105" class="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500 text-sm" />
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
          <input v-model="form.name" type="text" required placeholder="e.g. Dr. Jane Doe" class="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500 text-sm" />
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Primary Subject</label>
          <input v-model="form.subject" type="text" required placeholder="e.g. Mathematics" class="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500 text-sm" />
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
          <input v-model="form.phone" type="text" placeholder="+1 555-0000" class="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500 text-sm" />
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
          <input v-model="form.email" type="email" placeholder="teacher@school.com" class="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500 text-sm" />
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Status</label>
          <select v-model="form.status" class="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500 text-sm">
            <option value="Active">Active</option>
            <option value="On Leave">On Leave</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      <div class="pt-4 flex justify-end gap-3">
        <router-link to="/teachers" class="rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">Cancel</router-link>
        <button type="submit" :disabled="submitting" class="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 font-medium">Save Teacher</button>
      </div>
    </form>
  </div>
</template>
