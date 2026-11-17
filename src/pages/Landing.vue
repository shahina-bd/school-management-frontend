<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import BaseButton from '../components/common/BaseButton.vue'

const router = useRouter()
const authStore = useAuthStore()

const isAuthenticated = computed(() => authStore.isAuthenticated)

const features = [
  {
    title: 'Student Information System',
    description: 'Complete student profiles, enrollment tracking, class allocations, and academic histories.',
    icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z',
  },
  {
    title: 'Attendance & Tracking',
    description: 'Daily automated student and staff attendance logging with instant reporting.',
    icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4',
  },
  {
    title: 'Fee Collection & Finance',
    description: 'Invoice generation, online payment integration, and expense ledger monitoring.',
    icon: 'M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z',
  },
  {
    title: 'Exams & Grading System',
    description: 'Schedule examinations, publish marks, generate report cards, and track GPA trends.',
    icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
  },
  {
    title: 'Faculty & Staff Directory',
    description: 'Manage teacher profiles, subject assignments, departments, and payroll details.',
    icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z',
  },
  {
    title: 'Notice Board & Events',
    description: 'Instant school-wide digital announcements, circulars, and event calendar management.',
    icon: 'M11 58h2a2 2 0 002-2v-6a2 2 0 00-2-2h-2a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2h3.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293h7.172a1 1 0 00.707-.293l2.414-2.414A1 1 0 0118.586 17H19z',
  },
]
</script>

<template>
  <div class="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white relative overflow-hidden">
    <!-- Ambient Background Glows -->
    <div class="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none"></div>
    <div class="absolute top-1/3 -right-40 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none"></div>

    <!-- Navigation Header -->
    <header class="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-8 py-4">
      <div class="max-w-7xl mx-auto flex items-center justify-between">
        <router-link to="/" class="flex items-center space-x-3">
          <div class="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-600/40">
            S
          </div>
          <div>
            <span class="text-xl font-bold text-white tracking-wide">EduERP</span>
            <span class="block text-[10px] text-indigo-400 uppercase tracking-widest font-medium">School Management System</span>
          </div>
        </router-link>

        <div class="flex items-center space-x-4">
          <template v-if="isAuthenticated">
            <router-link to="/dashboard">
              <BaseButton variant="primary" size="md">
                Go to Dashboard &rarr;
              </BaseButton>
            </router-link>
          </template>
          <template v-else>
            <router-link to="/login">
              <BaseButton variant="outline" size="md" class="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white">
                Sign In
              </BaseButton>
            </router-link>
            <router-link to="/login">
              <BaseButton variant="primary" size="md">
                Access Portal
              </BaseButton>
            </router-link>
          </template>
        </div>
      </div>
    </header>

    <!-- Hero Section -->
    <section class="relative z-10 py-20 px-4 sm:px-8 text-center max-w-5xl mx-auto flex-1 flex flex-col items-center justify-center">
      <span class="px-4 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-xs font-semibold uppercase tracking-wider text-indigo-400 mb-6">
        Next-Generation School Operating System
      </span>

      <h1 class="text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight">
        Modernize your school’s <br />
        <span class="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          Academics & Operations
        </span>
      </h1>

      <p class="mt-6 text-slate-400 text-base sm:text-lg max-w-2xl leading-relaxed">
        An all-in-one cloud platform empowering administrators, teachers, students, and parents with seamless admissions, attendance, fees, exams, and record management.
      </p>

      <div class="mt-8 flex flex-wrap items-center justify-center gap-4">
        <router-link :to="isAuthenticated ? '/dashboard' : '/login'">
          <BaseButton variant="primary" size="lg" class="shadow-xl shadow-indigo-600/30">
            {{ isAuthenticated ? 'Go to Admin Dashboard' : 'Open Admin Portal' }}
          </BaseButton>
        </router-link>
        <a href="#features">
          <BaseButton variant="outline" size="lg" class="border-slate-800 text-slate-300 hover:bg-slate-800">
            Explore Features
          </BaseButton>
        </a>
      </div>

      <!-- Quick Metrics Ribbon -->
      <div class="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-4xl p-6 bg-slate-800/50 border border-slate-800 rounded-3xl backdrop-blur-md">
        <div>
          <div class="text-3xl font-extrabold text-white">100%</div>
          <div class="text-xs text-slate-400 mt-1 font-medium">Digital Workflows</div>
        </div>
        <div>
          <div class="text-3xl font-extrabold text-indigo-400">15+</div>
          <div class="text-xs text-slate-400 mt-1 font-medium">Integrated Modules</div>
        </div>
        <div>
          <div class="text-3xl font-extrabold text-emerald-400">99.9%</div>
          <div class="text-xs text-slate-400 mt-1 font-medium">Uptime Guarantee</div>
        </div>
        <div>
          <div class="text-3xl font-extrabold text-purple-400">24/7</div>
          <div class="text-xs text-slate-400 mt-1 font-medium">Support & Security</div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section id="features" class="relative z-10 py-20 px-4 sm:px-8 bg-slate-950/60 border-t border-slate-800">
      <div class="max-w-7xl mx-auto">
        <div class="text-center max-w-2xl mx-auto mb-16">
          <h2 class="text-3xl font-extrabold text-white">Comprehensive ERP Modules</h2>
          <p class="text-slate-400 text-sm mt-3">Built specifically for K-12 schools, academies, and educational institutions.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="feat in features"
            :key="feat.title"
            class="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/5 transition-all group"
          >
            <div class="w-12 h-12 rounded-xl bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" :d="feat.icon" />
              </svg>
            </div>
            <h3 class="text-lg font-bold text-white mb-2">{{ feat.title }}</h3>
            <p class="text-xs text-slate-400 leading-relaxed">{{ feat.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="border-t border-slate-800 py-8 px-4 text-center text-xs text-slate-500">
      <div class="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <span>&copy; {{ new Date().getFullYear() }} EduERP System. All rights reserved.</span>
        <div class="flex items-center space-x-6">
          <router-link to="/login" class="hover:text-slate-300">Portal Login</router-link>
          <a href="#features" class="hover:text-slate-300">Features</a>
        </div>
      </div>
    </footer>
  </div>
</template>
