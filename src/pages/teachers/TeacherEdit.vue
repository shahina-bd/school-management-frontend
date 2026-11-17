<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import teacherService from '../../services/teacherService'

const route = useRoute()
const router = useRouter()

const form = ref({
  emp_id: '',
  name: '',
  subject: '',
  phone: '',
  email: '',
  status: 'Active',
})

const loading = ref(true)
const submitting = ref(false)

onMounted(async () => {
  try {
    const res = await teacherService.getById(route.params.id)
    const data = res.data?.data || res.data
    if (data) {
      form.value = { ...form.value, ...data }
    }
  } catch (err) {
    // Fallback data for editing demo
    form.value = {
      emp_id: `T-10${route.params.id}`,
      name: 'Dr. Sarah Jenkins',
      subject: 'Mathematics',
      phone: '+1 555-8821',
      email: 's.jenkins@school.com',
      status: 'Active',
    }
  } finally {
    loading.value = false
  }
})

const handleSubmit = async () => {
  submitting.value = true
  try {
    await teacherService.update(route.params.id, form.value)
    router.push('/teachers')
  } catch (error) {
    console.error(error)
    router.push('/teachers')
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="max-w-3xl mx-auto">
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-slate-800">Edit Teacher</h1>
        <p class="text-slate-500">Update teacher details and assignment status.</p>
      </div>
      <router-link to="/teachers" class="text-slate-600 hover:text-slate-800 text-sm font-medium">
        &larr; Back to List
      </router-link>
    </div>

    <form @submit.prevent="handleSubmit" class="bg-white rounded-xl p-6 shadow-sm border border-slate-100 space-y-4">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Employee ID</label>
          <input v-model="form.emp_id" type="text" required class="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500 text-sm" />
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
          <input v-model="form.name" type="text" required class="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500 text-sm" />
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Primary Subject</label>
          <input v-model="form.subject" type="text" required class="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500 text-sm" />
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
          <input v-model="form.phone" type="text" class="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500 text-sm" />
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
          <input v-model="form.email" type="email" class="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500 text-sm" />
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
        <button type="submit" :disabled="submitting" class="rounded-lg bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-700 font-medium">Update Teacher</button>
      </div>
    </form>
  </div>
</template>
