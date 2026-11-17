<script setup>
import Sidebar from '../components/layout/Sidebar.vue'
import Topbar from '../components/layout/Topbar.vue'
</script>

<template>
  <div class="min-h-screen bg-slate-50">
    <Sidebar />

    <div class="ml-64">
      <Topbar />

      <main class="p-6">
        <router-view />
      </main>
    </div>
  </div>
</template>
