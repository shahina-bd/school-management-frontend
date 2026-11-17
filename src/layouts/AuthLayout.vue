<script setup>
</script>

<template>
  <div class="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
    <!-- Ambient background glows -->
    <div class="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/30 rounded-full blur-3xl pointer-events-none"></div>
    <div class="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none"></div>

    <div class="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center">
      <div class="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-600 text-white font-black text-2xl shadow-xl shadow-indigo-600/40 mb-4">
        S
      </div>
      <h2 class="text-3xl font-black tracking-tight text-white">
        EduERP System
      </h2>
      <p class="mt-2 text-sm text-slate-400">
        School Management & Administration Portal
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4 sm:px-0">
      <div class="bg-white/95 backdrop-blur-md py-8 px-6 shadow-2xl rounded-3xl border border-slate-100 sm:px-10">
        <router-view />
      </div>
      <div class="mt-6 text-center text-xs text-slate-500">
        &copy; {{ new Date().getFullYear() }} EduERP Inc. All rights reserved.
      </div>
    </div>
  </div>
</template>
