<script setup>
const menuItems = [
  {
    name: 'Dashboard',
    path: '/dashboard',
    icon: '📊',
  },
  {
    name: 'Students',
    path: '/students',
    icon: '🎓',
  },
  {
    name: 'Teachers',
    path: '/teachers',
    icon: '👨‍🏫',
  },
  {
    name: 'Staff',
    path: '/staff',
    icon: '👥',
  },
  {
    name: 'Classes',
    path: '/classes',
    icon: '🏫',
  },
  {
    name: 'Subjects',
    path: '/subjects',
    icon: '📚',
  },
  {
    name: 'Attendance',
    path: '/attendance',
    icon: '✓',
  },
  {
    name: 'Fees',
    path: '/fees',
    icon: '💰',
  },
  {
    name: 'Expenses',
    path: '/expenses',
    icon: '💳',
  },
  {
    name: 'Exams',
    path: '/exams',
    icon: '📝',
  },
  {
    name: 'Results',
    path: '/results',
    icon: '📈',
  },
  {
    name: 'Notices',
    path: '/notices',
    icon: '📢',
  },
]
</script>

<template>
  <aside class="fixed left-0 top-0 h-screen w-64 overflow-y-auto bg-slate-900 text-white">
    <div class="flex h-16 items-center border-b border-slate-700 px-6">
      <h1 class="text-xl font-bold">School ERP</h1>
    </div>

    <nav class="p-4">
      <router-link
        v-for="item in menuItems"
        :key="item.path"
        :to="item.path"
        class="mb-1 flex items-center gap-3 rounded-lg px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white"
        active-class="bg-blue-600 text-white"
      >
        <span>
          {{ item.icon }}
        </span>

        <span>
          {{ item.name }}
        </span>
      </router-link>
    </nav>
  </aside>
</template>
