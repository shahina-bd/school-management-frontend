<script setup>
import { ref, onMounted } from 'vue'
import staffService from '../../services/staffService'

const staff = ref([])
const loading = ref(false)
const search = ref('')

const mockStaff = [
  { id: 1, emp_id: 'S-201', name: 'Marcus Brody', role: 'Librarian', phone: '+1 555-4001', email: 'm.brody@school.com', status: 'Active' },
  { id: 2, emp_id: 'S-202', name: 'Laura Palmer', role: 'Accountant', phone: '+1 555-4002', email: 'l.palmer@school.com', status: 'Active' },
  { id: 3, emp_id: 'S-203', name: 'James Wilson', role: 'IT Support Administrator', phone: '+1 555-4003', email: 'j.wilson@school.com', status: 'Active' },
]

const getCustomStaff = () => {
  try {
    return JSON.parse(localStorage.getItem('custom_staff') || '[]')
  } catch {
    return []
  }
}

const loadStaff = async () => {
  loading.value = true
  const custom = getCustomStaff()
  try {
    const response = await staffService.getAll({ search: search.value })
    const data = response.data?.data?.data || response.data?.data || response.data || []
    if (Array.isArray(data) && data.length > 0) {
      staff.value = filterList([...custom, ...data])
    } else {
      staff.value = filterList([...custom, ...mockStaff])
    }
  } catch (error) {
    staff.value = filterList([...custom, ...mockStaff])
  } finally {
    loading.value = false
  }
}

const filterList = (list) => {
  if (!search.value) return list
  const q = search.value.toLowerCase()
  return list.filter(s =>
    s.name.toLowerCase().includes(q) ||
    s.role.toLowerCase().includes(q) ||
    s.emp_id.toLowerCase().includes(q)
  )
}

const deleteStaff = async (id) => {
  if (!confirm('Are you sure you want to delete this staff member?')) return
  try {
    await staffService.delete(id)
  } catch (error) {
    console.error(error)
  } finally {
    const custom = getCustomStaff().filter(s => s.id !== id)
    localStorage.setItem('custom_staff', JSON.stringify(custom))
    staff.value = staff.value.filter(s => s.id !== id)
  }
}

onMounted(loadStaff)
</script>

<template>
  <div>
    <!-- Header -->
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-slate-800">Staff Directory</h1>
        <p class="text-slate-500">Manage non-teaching & administrative staff records.</p>
      </div>
      <router-link
        to="/staff/create"
        class="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 font-medium text-sm"
      >
        + Add Staff Member
      </router-link>
    </div>

    <!-- Search -->
    <div class="mb-5 rounded-xl bg-white p-4 shadow-sm">
      <input
        v-model="search"
        @keyup.enter="loadStaff"
        type="text"
        placeholder="Search staff by name, role, employee ID..."
        class="w-full rounded-lg border border-slate-300 px-4 py-2 outline-none focus:border-blue-500"
      />
    </div>

    <!-- Table -->
    <div class="overflow-hidden rounded-xl bg-white shadow-sm border border-slate-100">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead class="bg-slate-50 border-b border-slate-200">
            <tr>
              <th class="px-4 py-3 font-semibold text-slate-700 text-xs uppercase tracking-wider">Emp ID</th>
              <th class="px-4 py-3 font-semibold text-slate-700 text-xs uppercase tracking-wider">Staff Name</th>
              <th class="px-4 py-3 font-semibold text-slate-700 text-xs uppercase tracking-wider">Department</th>
              <th class="px-4 py-3 font-semibold text-slate-700 text-xs uppercase tracking-wider">Designation</th>
              <th class="px-4 py-3 font-semibold text-slate-700 text-xs uppercase tracking-wider">Joining Date</th>
              <th class="px-4 py-3 font-semibold text-slate-700 text-xs uppercase tracking-wider">Salary</th>
              <th class="px-4 py-3 font-semibold text-slate-700 text-xs uppercase tracking-wider">Phone</th>
              <th class="px-4 py-3 font-semibold text-slate-700 text-xs uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="member in staff"
              :key="member.id"
              class="border-b border-slate-100 hover:bg-slate-50/50 transition-colors text-xs"
            >
              <td class="px-4 py-3 font-medium text-slate-900">
                <span class="rounded bg-blue-50 px-2 py-1 text-blue-700 font-semibold">{{ member.employee_id || member.emp_id || `S-${member.id}` }}</span>
              </td>
              <td class="px-4 py-3 font-medium text-slate-900">
                {{ member.name || member.user?.name || 'Staff Member' }}
                <span class="block text-[11px] text-slate-400 font-normal">{{ member.email || member.user?.email || '' }}</span>
              </td>
              <td class="px-4 py-3 text-slate-600">{{ member.department || '-' }}</td>
              <td class="px-4 py-3 text-slate-600">{{ member.designation || member.role || '-' }}</td>
              <td class="px-4 py-3 text-slate-600">{{ member.joining_date || '-' }}</td>
              <td class="px-4 py-3 text-slate-600 font-medium">{{ member.salary ? `$${member.salary}` : '-' }}</td>
              <td class="px-4 py-3 text-slate-600">{{ member.phone || '-' }}</td>
              <td class="px-4 py-3">
                <div class="flex items-center gap-2">
                  <router-link :to="`/staff/${member.id}`" class="text-blue-600 font-medium hover:underline">View</router-link>
                  <router-link :to="`/staff/${member.id}/edit`" class="text-green-600 font-medium hover:underline">Edit</router-link>
                  <button type="button" @click="deleteStaff(member.id)" class="text-red-600 font-medium hover:underline">Delete</button>
                </div>
              </td>
            </tr>
            <tr v-if="!loading && staff.length === 0">
              <td colspan="8" class="px-6 py-10 text-center text-slate-500">No staff members found.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
