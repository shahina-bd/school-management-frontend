<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'

defineProps({
  sidebarOpen: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['toggle-sidebar'])

const router = useRouter()
const authStore = useAuthStore()

const dropdownOpen = ref(false)
const dropdownRef = ref(null)

const user = computed(() => authStore.currentUser)
const userName = computed(() => user.value?.name || 'Admin')
const userRole = computed(() => user.value?.role || 'Administrator')
const userInitial = computed(() => userName.value.charAt(0).toUpperCase())

const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value
}

const handleClickOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    dropdownOpen.value = false
  }
}

const handleLogout = async () => {
  dropdownOpen.value = false
  await authStore.logout()
  router.push('/login')
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <header class="sticky top-0 z-10 h-16 border-b bg-white">
    <div class="flex h-full items-center justify-between px-6">
      <div class="flex items-center gap-3">
        <!-- Mobile Sidebar Toggle -->
        <button
          type="button"
          class="lg:hidden rounded-lg p-2 hover:bg-slate-100 text-slate-600 focus:outline-none"
          @click="$emit('toggle-sidebar')"
          aria-label="Toggle navigation"
        >
          <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <h2 class="text-lg font-semibold text-slate-800">
          School Management System
        </h2>
      </div>

      <div class="flex items-center gap-4">
        <!-- Notification Button -->
        <button
          type="button"
          class="rounded-lg p-2 hover:bg-slate-100 focus:outline-none"
          title="Notifications"
        >
          🔔
        </button>

        <!-- User Profile Dropdown -->
        <div ref="dropdownRef" class="relative">
          <button
            type="button"
            class="flex items-center gap-3 rounded-lg p-1 hover:bg-slate-50 focus:outline-none transition-colors"
            @click="toggleDropdown"
          >
            <div
              class="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-white font-semibold text-sm"
            >
              {{ userInitial }}
            </div>

            <div class="text-left hidden sm:block">
              <p class="text-sm font-medium text-slate-800 leading-tight">
                {{ userName }}
              </p>

              <p class="text-xs text-slate-500">
                {{ userRole }}
              </p>
            </div>
          </button>

          <!-- Dropdown Menu -->
          <Transition
            enter-active-class="transition ease-out duration-100"
            enter-from-class="transform opacity-0 scale-95"
            enter-to-class="transform opacity-100 scale-100"
            leave-active-class="transition ease-in duration-75"
            leave-from-class="transform opacity-100 scale-100"
            leave-to-class="transform opacity-0 scale-95"
          >
            <div
              v-if="dropdownOpen"
              class="absolute right-0 mt-2 w-48 rounded-lg bg-white py-1 shadow-lg ring-1 ring-black/5 z-50 border border-slate-100"
            >
              <div class="px-4 py-2 border-b border-slate-100 sm:hidden">
                <p class="text-sm font-medium text-slate-800">{{ userName }}</p>
                <p class="text-xs text-slate-500">{{ userRole }}</p>
              </div>

              <button
                type="button"
                class="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 flex items-center gap-2"
                @click="handleLogout"
              >
                <span>🚪</span>
                <span>Sign Out</span>
              </button>
            </div>
          </Transition>
        </div>
      </div>
    </div>
  </header>
</template>
