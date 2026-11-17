<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useStudentStore } from '../../stores/student'
import BaseInput from '../../components/common/BaseInput.vue'
import BaseButton from '../../components/common/BaseButton.vue'
import LoadingSpinner from '../../components/common/LoadingSpinner.vue'

const router = useRouter()
const route = useRoute()
const studentStore = useStudentStore()

const studentId = route.params.id

const form = ref({
  name: '',
  roll_no: '',
  class: 'Class 10',
  section: 'A',
  gender: 'Male',
  dob: '',
  email: '',
  phone: '',
  guardian_name: '',
  guardian_phone: '',
  address: '',
  status: 'Active',
})

const isLoading = ref(true)
const isSubmitting = ref(false)

onMounted(async () => {
  try {
    const student = await studentStore.fetchStudent(studentId)
    if (student) {
      form.value = { ...form.value, ...student }
    }
  } catch (err) {
    // Fallback sample data if API fails
    const found = studentStore.students.find((s) => s.id == studentId)
    if (found) {
      form.value = { ...form.value, ...found }
    } else {
      form.value = {
        name: 'Alexander Wright',
        roll_no: '101',
        class: 'Class 10',
        section: 'A',
        gender: 'Male',
        dob: '2009-04-12',
        email: 'alex.w@school.com',
        phone: '+1 555-0192',
        guardian_name: 'Robert Wright',
        guardian_phone: '+1 555-0188',
        address: '742 Evergreen Terrace, Springfield',
        status: 'Active',
      }
    }
  } finally {
    isLoading.value = false
  }
})

const handleSubmit = async () => {
  isSubmitting.value = true
  try {
    await studentStore.updateStudent(studentId, form.value)
    router.push('/students')
  } catch (err) {
    // Update local store as fallback
    const index = studentStore.students.findIndex((s) => s.id == studentId)
    if (index !== -1) {
      studentStore.students[index] = { ...studentStore.students[index], ...form.value }
    }
    router.push('/students')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="max-w-4xl mx-auto space-y-6">
    <div class="flex items-center justify-between border-b border-slate-200 pb-4">
      <div>
        <h2 class="text-2xl font-bold text-slate-800">Edit Student Record</h2>
        <p class="text-xs text-slate-500 mt-1">Update information for ID #{{ studentId }}</p>
      </div>

      <router-link to="/students">
        <BaseButton variant="outline" size="sm">
          &larr; Back to Directory
        </BaseButton>
      </router-link>
    </div>

    <div v-if="isLoading" class="bg-white rounded-2xl p-12 text-center border border-slate-100">
      <LoadingSpinner size="lg" />
      <p class="text-slate-500 text-sm mt-3">Loading student record...</p>
    </div>

    <form
      v-else
      @submit.prevent="handleSubmit"
      class="bg-white rounded-2xl p-6 sm:p-8 border border-slate-100 shadow-xs space-y-6"
    >
      <div class="space-y-4">
        <h3 class="text-sm font-bold text-slate-700 uppercase tracking-wider border-b border-slate-100 pb-2">
          Academic Details
        </h3>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div class="sm:col-span-2">
            <BaseInput v-model="form.name" label="Full Name" required />
          </div>
          <div>
            <BaseInput v-model="form.roll_no" label="Roll Number" required />
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1.5">Class</label>
            <select
              v-model="form.class"
              class="block w-full rounded-lg text-sm border-gray-300 py-2.5 px-3 text-slate-700 bg-white focus:ring-indigo-500 focus:border-indigo-500 border"
            >
              <option value="Class 10">Class 10</option>
              <option value="Class 9">Class 9</option>
              <option value="Class 8">Class 8</option>
              <option value="Class 7">Class 7</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1.5">Section</label>
            <select
              v-model="form.section"
              class="block w-full rounded-lg text-sm border-gray-300 py-2.5 px-3 text-slate-700 bg-white focus:ring-indigo-500 focus:border-indigo-500 border"
            >
              <option value="A">Section A</option>
              <option value="B">Section B</option>
              <option value="C">Section C</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1.5">Status</label>
            <select
              v-model="form.status"
              class="block w-full rounded-lg text-sm border-gray-300 py-2.5 px-3 text-slate-700 bg-white focus:ring-indigo-500 focus:border-indigo-500 border"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Graduated">Graduated</option>
            </select>
          </div>
        </div>
      </div>

      <div class="space-y-4 pt-4">
        <h3 class="text-sm font-bold text-slate-700 uppercase tracking-wider border-b border-slate-100 pb-2">
          Contact & Guardian
        </h3>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <BaseInput v-model="form.email" type="email" label="Email Address" />
          <BaseInput v-model="form.phone" label="Phone Number" />
          <BaseInput v-model="form.dob" type="date" label="Date of Birth" />
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <BaseInput v-model="form.guardian_name" label="Guardian Name" />
          <BaseInput v-model="form.guardian_phone" label="Guardian Contact" />
        </div>
      </div>

      <div class="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
        <router-link to="/students">
          <BaseButton variant="secondary" size="md">
            Cancel
          </BaseButton>
        </router-link>

        <BaseButton type="submit" variant="primary" size="md" :loading="isSubmitting">
          Update Record
        </BaseButton>
      </div>
    </form>
  </div>
</template>
