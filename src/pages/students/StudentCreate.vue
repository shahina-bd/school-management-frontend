<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import studentService from '../../services/studentService'
import BaseInput from '../../components/common/BaseInput.vue'
import BaseButton from '../../components/common/BaseButton.vue'

const router = useRouter()

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

const errors = ref({})
const isSubmitting = ref(false)

const handleSubmit = async () => {
  errors.value = {}

  if (!form.value.name) errors.value.name = 'Student full name is required'
  if (!form.value.roll_no) errors.value.roll_no = 'Student ID / Admission No is required'

  if (Object.keys(errors.value).length > 0) return

  isSubmitting.value = true

  const nameParts = form.value.name.trim().split(' ')
  const firstName = nameParts[0] || 'Student'
  const lastName = nameParts.slice(1).join(' ') || ''

  const payload = {
    admission_number: form.value.roll_no,
    student_id: form.value.roll_no,
    roll_number: form.value.roll_no,
    first_name: firstName,
    last_name: lastName,
    phone: form.value.phone || null,
    email: form.value.email || null,
    gender: form.value.gender ? form.value.gender.toLowerCase() : 'male',
    dob: form.value.dob || null,
    address: form.value.address || null,
    status: form.value.status ? form.value.status.toLowerCase() : 'active',
  }

  const newStudentObj = {
    id: Date.now(),
    student_id: form.value.roll_no,
    admission_number: form.value.roll_no,
    first_name: firstName,
    last_name: lastName,
    name: form.value.name,
    phone: form.value.phone || '-',
    email: form.value.email,
    status: form.value.status || 'Active',
  }

  try {
    await studentService.create(payload)
  } catch (err) {
    console.error('API save error:', err)
  } finally {
    isSubmitting.value = false
    router.push('/students')
  }
}
</script>

<template>
  <div class="max-w-4xl mx-auto space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between border-b border-slate-200 pb-4">
      <div>
        <h2 class="text-2xl font-bold text-slate-800">Add New Student</h2>
        <p class="text-xs text-slate-500 mt-1">Fill in the student academic and personal details</p>
      </div>

      <router-link to="/students">
        <BaseButton variant="outline" size="sm">
          &larr; Back to Directory
        </BaseButton>
      </router-link>
    </div>

    <!-- Student Form Card -->
    <form @submit.prevent="handleSubmit" class="bg-white rounded-2xl p-6 sm:p-8 border border-slate-100 shadow-xs space-y-6">
      <div class="space-y-4">
        <h3 class="text-sm font-bold text-slate-700 uppercase tracking-wider border-b border-slate-100 pb-2">
          Academic Information
        </h3>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div class="sm:col-span-2">
            <BaseInput
              v-model="form.name"
              label="Full Name"
              placeholder="e.g. John Doe"
              required
              :error="errors.name"
            />
          </div>

          <div>
            <BaseInput
              v-model="form.roll_no"
              label="Student ID / Admission No"
              placeholder="e.g. STU-106"
              required
              :error="errors.roll_no"
            />
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
            <label class="block text-sm font-medium text-slate-700 mb-1.5">Gender</label>
            <select
              v-model="form.gender"
              class="block w-full rounded-lg text-sm border-gray-300 py-2.5 px-3 text-slate-700 bg-white focus:ring-indigo-500 focus:border-indigo-500 border"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Personal & Contact Info -->
      <div class="space-y-4 pt-4">
        <h3 class="text-sm font-bold text-slate-700 uppercase tracking-wider border-b border-slate-100 pb-2">
          Personal & Guardian Details
        </h3>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <BaseInput
              v-model="form.dob"
              type="date"
              label="Date of Birth"
            />
          </div>

          <div>
            <BaseInput
              v-model="form.email"
              type="email"
              label="Email Address"
              placeholder="student@example.com"
              :error="errors.email"
            />
          </div>

          <div>
            <BaseInput
              v-model="form.phone"
              label="Phone Number"
              placeholder="+1 555-0100"
              :error="errors.phone"
            />
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <BaseInput
            v-model="form.guardian_name"
            label="Guardian Name"
            placeholder="Parent / Guardian Name"
          />

          <BaseInput
            v-model="form.guardian_phone"
            label="Guardian Contact"
            placeholder="+1 555-0101"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1.5">Address</label>
          <textarea
            v-model="form.address"
            rows="3"
            placeholder="Full residential address..."
            class="block w-full rounded-lg text-sm border-gray-300 py-2.5 px-3 text-slate-700 bg-white focus:ring-indigo-500 focus:border-indigo-500 border"
          ></textarea>
        </div>
      </div>

      <!-- Submit Footer -->
      <div class="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
        <router-link to="/students">
          <BaseButton variant="secondary" size="md">
            Cancel
          </BaseButton>
        </router-link>

        <BaseButton type="submit" variant="primary" size="md" :loading="isSubmitting">
          Save Student to Database
        </BaseButton>
      </div>
    </form>
  </div>
</template>
