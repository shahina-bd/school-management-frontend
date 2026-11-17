import { createRouter, createWebHistory } from 'vue-router'
import AdminLayout from '../layouts/AdminLayout.vue'

const routes = [
  {
    path: '/',
    component: AdminLayout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('../pages/dashboard/Dashboard.vue'),
      },

      // Students
      {
        path: 'students',
        name: 'Students',
        component: () => import('../pages/students/StudentList.vue'),
      },
      {
        path: 'students/create',
        name: 'StudentCreate',
        component: () => import('../pages/students/StudentCreate.vue'),
      },
      {
        path: 'students/:id',
        name: 'StudentShow',
        component: () => import('../pages/students/StudentShow.vue'),
      },
      {
        path: 'students/:id/edit',
        name: 'StudentEdit',
        component: () => import('../pages/students/StudentEdit.vue'),
      },

      // Teachers
      {
        path: 'teachers',
        name: 'Teachers',
        component: () => import('../pages/teachers/TeacherList.vue'),
      },
      {
        path: 'teachers/create',
        name: 'TeacherCreate',
        component: () => import('../pages/teachers/TeacherCreate.vue'),
      },
      {
        path: 'teachers/:id',
        name: 'TeacherShow',
        component: () => import('../pages/teachers/TeacherShow.vue'),
      },
      {
        path: 'teachers/:id/edit',
        name: 'TeacherEdit',
        component: () => import('../pages/teachers/TeacherEdit.vue'),
      },

      // Staff
      {
        path: 'staff',
        name: 'Staff',
        component: () => import('../pages/staff/StaffList.vue'),
      },
      {
        path: 'staff/create',
        name: 'StaffCreate',
        component: () => import('../pages/staff/StaffCreate.vue'),
      },
      {
        path: 'staff/:id',
        name: 'StaffShow',
        component: () => import('../pages/staff/StaffShow.vue'),
      },
      {
        path: 'staff/:id/edit',
        name: 'StaffEdit',
        component: () => import('../pages/staff/StaffEdit.vue'),
      },

      // Classes
      {
        path: 'classes',
        name: 'Classes',
        component: () => import('../pages/classes/ClassList.vue'),
      },

      // Subjects
      {
        path: 'subjects',
        name: 'Subjects',
        component: () => import('../pages/subjects/SubjectList.vue'),
      },

      // Attendance
      {
        path: 'attendance',
        name: 'Attendance',
        component: () => import('../pages/attendance/AttendanceList.vue'),
      },

      // Fees
      {
        path: 'fees',
        name: 'Fees',
        component: () => import('../pages/fees/FeeList.vue'),
      },

      // Expenses
      {
        path: 'expenses',
        name: 'Expenses',
        component: () => import('../pages/expenses/ExpenseList.vue'),
      },

      // Exams
      {
        path: 'exams',
        name: 'Exams',
        component: () => import('../pages/exams/ExamList.vue'),
      },

      // Notices
      {
        path: 'notices',
        name: 'Notices',
        component: () => import('../pages/notices/NoticeList.vue'),
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
