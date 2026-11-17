<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import BaseInput from '../../components/common/BaseInput.vue'
import BaseButton from '../../components/common/BaseButton.vue'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('admin@school.com')
const password = ref('password')
const rememberMe = ref(false)
const errorMessage = ref('')

const handleSubmit = async () => {
  errorMessage.value = ''
  try {
    await authStore.login({
      email: email.value,
      password: password.value,
      remember: rememberMe.value,
    })
    router.push('/dashboard')
  } catch (err) {
    errorMessage.value = authStore.error || 'Failed to authenticate. Please check your credentials.'
  }
}
</script>

<template>
  <div>
    <div class="mb-6">
      <h3 class="text-xl font-bold text-slate-900">Sign in to your account</h3>
      <p class="text-xs text-slate-500 mt-1">Enter your credentials to access the ERP dashboard</p>
    </div>

    <!-- Error Alert -->
    <div
      v-if="errorMessage"
      class="mb-5 p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-start space-x-2"
    >
      <svg class="w-4 h-4 text-red-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>{{ errorMessage }}</span>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-4">
      <BaseInput
        id="email"
        v-model="email"
        type="email"
        label="Email Address"
        placeholder="admin@school.com"
        required
      >
        <template #prefix>
          <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
          </svg>
        </template>
      </BaseInput>

      <BaseInput
        id="password"
        v-model="password"
        type="password"
        label="Password"
        placeholder="••••••••"
        required
      >
        <template #prefix>
          <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </template>
      </BaseInput>

      <div class="flex items-center justify-between text-xs pt-1">
        <label class="flex items-center text-slate-600 cursor-pointer">
          <input
            v-model="rememberMe"
            type="checkbox"
            class="rounded border-slate-300 text-indigo-600 shadow-xs focus:ring-indigo-500 mr-2"
          />
          Remember me
        </label>
        <a href="#forgot-password" class="text-indigo-600 hover:text-indigo-800 font-semibold">
          Forgot password?
        </a>
      </div>

      <div class="pt-2">
        <BaseButton
          type="submit"
          variant="primary"
          size="lg"
          class="w-full"
          :loading="authStore.loading"
        >
          Sign In
        </BaseButton>
      </div>
    </form>

    <div class="mt-6 pt-4 border-t border-slate-100 text-center text-xs text-slate-600">
      Don't have an account yet?
      <router-link to="/register" class="text-indigo-600 hover:text-indigo-800 font-bold ml-1">
        Register here
      </router-link>
    </div>
  </div>
</template>
