<script setup>
import { ref, onMounted } from 'vue'
import studentService from '../../services/studentService'

const students = ref([])
const loading = ref(false)
const search = ref('')

const mockStudents = [
  { id: 1, student_id: 'STU-101', first_name: 'Alexander', last_name: 'Wright', name: 'Alexander Wright', phone: '+1 555-0192', status: 'Active' },
  { id: 2, student_id: 'STU-102', first_name: 'Sophia', last_name: 'Martinez', name: 'Sophia Martinez', phone: '+1 555-0193', status: 'Active' },
  { id: 3, student_id: 'STU-103', first_name: 'Ethan', last_name: 'Hunt', name: 'Ethan Hunt', phone: '+1 555-0194', status: 'Active' },
  { id: 4, student_id: 'STU-104', first_name: 'Olivia', last_name: 'Taylor', name: 'Olivia Taylor', phone: '+1 555-0195', status: 'Inactive' },
  { id: 5, student_id: 'STU-105', first_name: 'Liam', last_name: 'Johnson', name: 'Liam Johnson', phone: '+1 555-0196', status: 'Active' },
]

const getCustomStudents = () => {
  try {
    return JSON.parse(localStorage.getItem('custom_students') || '[]')
  } catch {
    return []
  }
}

const loadStudents = async () => {
  loading.value = true
  const custom = getCustomStudents()

  try {
    const response = await studentService.getAll({
      search: search.value,
      page: 1,
      per_page: 20,
    })

    const apiData = response.data?.data?.data || response.data?.data || response.data || []
    if (Array.isArray(apiData) && apiData.length > 0) {
      const combined = [...custom, ...apiData]
      students.value = filterList(combined)
    } else {
      students.value = filterList([...custom, ...mockStudents])
    }
  } catch (error) {
    students.value = filterList([...custom, ...mockStudents])
  } finally {
    loading.value = false
  }
}

const filterList = (list) => {
  if (!search.value) return list
  const q = search.value.toLowerCase()
  return list.filter(s =>
    (s.first_name && s.first_name.toLowerCase().includes(q)) ||
    (s.last_name && s.last_name.toLowerCase().includes(q)) ||
    (s.name && s.name.toLowerCase().includes(q)) ||
    (s.student_id && s.student_id.toLowerCase().includes(q))
  )
}

const deleteStudent = async (id) => {
  if (!confirm('Are you sure you want to delete this student?')) return

  try {
    await studentService.delete(id)
  } catch (error) {
    console.error(error)
  } finally {
    // Remove from local storage custom items if present
    const custom = getCustomStudents().filter(s => s.id !== id)
    localStorage.setItem('custom_students', JSON.stringify(custom))
    students.value = students.value.filter(s => s.id !== id)
  }
}

onMounted(loadStudents)
</script>

<template>
  <div>
    <!-- Header -->
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-slate-800">
          Students
        </h1>

        <p class="text-slate-500">
          Manage all students.
        </p>
      </div>

      <router-link
        to="/students/create"
        class="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 font-medium text-sm"
      >
        + Add Student
      </router-link>
    </div>

    <!-- Search -->
    <div class="mb-5 rounded-xl bg-white p-4 shadow-sm">
      <input
        v-model="search"
        @keyup.enter="loadStudents"
        type="text"
        placeholder="Search student..."
        class="w-full rounded-lg border border-slate-300 px-4 py-2 outline-none focus:border-blue-500 text-sm"
      />
    </div>

    <!-- Table -->
    <div class="overflow-hidden rounded-xl bg-white shadow-sm border border-slate-100">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead class="bg-slate-50 border-b border-slate-200">
            <tr>
              <th class="px-4 py-3 font-semibold text-slate-700 text-xs uppercase tracking-wider">
                Admission No
              </th>
              <th class="px-4 py-3 font-semibold text-slate-700 text-xs uppercase tracking-wider">
                Roll No
              </th>
              <th class="px-4 py-3 font-semibold text-slate-700 text-xs uppercase tracking-wider">
                Student Name
              </th>
              <th class="px-4 py-3 font-semibold text-slate-700 text-xs uppercase tracking-wider">
                Gender
              </th>
              <th class="px-4 py-3 font-semibold text-slate-700 text-xs uppercase tracking-wider">
                DOB
              </th>
              <th class="px-4 py-3 font-semibold text-slate-700 text-xs uppercase tracking-wider">
                Blood Group
              </th>
              <th class="px-4 py-3 font-semibold text-slate-700 text-xs uppercase tracking-wider">
                Admission Date
              </th>
              <th class="px-4 py-3 font-semibold text-slate-700 text-xs uppercase tracking-wider">
                Phone
              </th>
              <th class="px-4 py-3 font-semibold text-slate-700 text-xs uppercase tracking-wider">
                Status
              </th>
              <th class="px-4 py-3 font-semibold text-slate-700 text-xs uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="student in students"
              :key="student.id"
              class="border-b border-slate-100 hover:bg-slate-50/50 transition-colors text-xs"
            >
              <td class="px-4 py-3 font-medium text-slate-900">
                <span class="rounded bg-blue-50 px-2 py-1 text-blue-700 font-semibold">
                  {{ student.admission_number || student.student_id || `STU-${student.id}` }}
                </span>
              </td>

              <td class="px-4 py-3 text-slate-700">
                {{ student.roll_number || '-' }}
              </td>

              <td class="px-4 py-3 font-medium text-slate-900">
                {{ student.name || student.user?.name || (student.first_name ? `${student.first_name} ${student.last_name || ''}`.trim() : 'Student') }}
                <span v-if="student.user?.email || student.email" class="block text-[11px] text-slate-400 font-normal">
                  {{ student.user?.email || student.email }}
                </span>
              </td>

              <td class="px-4 py-3 text-slate-600 capitalize">
                {{ student.gender || '-' }}
              </td>

              <td class="px-4 py-3 text-slate-600">
                {{ student.dob || student.date_of_birth || '-' }}
              </td>

              <td class="px-4 py-3 text-slate-600 font-semibold">
                {{ student.blood_group || '-' }}
              </td>

              <td class="px-4 py-3 text-slate-600">
                {{ student.admission_date || '-' }}
              </td>

              <td class="px-4 py-3 text-slate-600">
                {{ student.phone || student.user?.phone || '-' }}
              </td>

              <td class="px-4 py-3">
                <span
                  class="rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize"
                  :class="student.status === 'Inactive' || student.status === 'inactive' ? 'bg-slate-100 text-slate-600' : 'bg-green-100 text-green-700'"
                >
                  {{ student.status || 'Active' }}
                </span>
              </td>

              <td class="px-4 py-3">
                <div class="flex items-center gap-2">
                  <router-link
                    :to="`/students/${student.id}`"
                    class="text-blue-600 font-medium hover:underline"
                  >
                    View
                  </router-link>

                  <router-link
                    :to="`/students/${student.id}/edit`"
                    class="text-green-600 font-medium hover:underline"
                  >
                    Edit
                  </router-link>

                  <button
                    type="button"
                    @click="deleteStudent(student.id)"
                    class="text-red-600 font-medium hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>

            <tr v-if="!loading && students.length === 0">
              <td
                colspan="10"
                class="px-6 py-10 text-center text-slate-500"
              >
                No students found.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
