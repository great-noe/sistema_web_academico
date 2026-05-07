<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const username = ref('')
const password = ref('')
const errorMessage = ref('')
const loading = ref(false)

const handleLogin = async () => {
  loading.value = true
  errorMessage.value = ''
  
  // Usamos await directamente o dentro de un async setTimeout
  setTimeout(async () => {
    try {
      const result = await authStore.login(username.value, password.value)
      if (result.success) {
        router.push('/')
      } else {
        errorMessage.value = result.message
      }
    } catch (error) {
      errorMessage.value = 'Error de conexión.'
    } finally {
      loading.value = false
    }
  }, 600) // Simulate network delay
}

const autofill = (role) => {
  username.value = role
  password.value = '123456'
}
</script>

<template>
  <div class="login-wrapper">
    <div class="login-container">
      <div class="login-header">
        <div class="logo">
          <span class="logo-icon">🎓</span>
        </div>
        <h1>Academisys</h1>
        <p>Inicia sesión en tu cuenta</p>
      </div>
      
      <form class="login-form" @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="username">Usuario</label>
          <input 
            type="text" 
            id="username" 
            v-model="username" 
            placeholder="Ingresa tu usuario..."
            required
            autocomplete="username"
          />
        </div>
        
        <div class="form-group">
          <label for="password">Contraseña</label>
          <input 
            type="password" 
            id="password" 
            v-model="password" 
            placeholder="••••••••"
            required
            autocomplete="current-password"
          />
        </div>

        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>

        <button type="submit" class="btn-primary login-btn" :disabled="loading">
          {{ loading ? 'Iniciando sesión...' : 'Ingresar al sistema' }}
        </button>
      </form>

      <div class="test-accounts">
        <p class="eyebrow">Cuentas de prueba (Clic para rellenar)</p>
        <div class="test-badges">
          <button @click="autofill('admin')" type="button" class="badge admin">Admin</button>
          <button @click="autofill('docente')" type="button" class="badge docente">Docente</button>
          <button @click="autofill('estudiante')" type="button" class="badge estudiante">Estudiante</button>
        </div>
        <p class="hint">Contraseña para todos: <strong>123456</strong></p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: var(--bg);
  background-image: 
    radial-gradient(circle at 15% 50%, rgba(79, 70, 229, 0.08), transparent 30%),
    radial-gradient(circle at 85% 30%, rgba(245, 158, 11, 0.08), transparent 30%);
}

.login-container {
  width: 100%;
  max-width: 440px;
  background: white;
  border-radius: var(--radius-xl);
  padding: 48px;
  box-shadow: var(--shadow-hover);
  border: 1px solid var(--line);
  position: relative;
  z-index: 10;
}

.login-header {
  text-align: center;
  margin-bottom: 32px;
}

.logo {
  width: 64px;
  height: 64px;
  background: var(--accent-soft);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
}

.logo-icon {
  font-size: 2rem;
}

.login-header h1 {
  font-size: 2rem;
  margin: 0 0 8px;
  letter-spacing: -0.5px;
}

.login-header p {
  color: var(--muted);
  margin: 0;
  font-size: 1.1rem;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-weight: 600;
  font-size: 0.9rem;
  color: var(--heading);
}

.login-btn {
  margin-top: 8px;
  height: 48px;
  font-size: 1.1rem;
}

.error-message {
  background: #fef2f2;
  color: var(--danger);
  padding: 12px;
  border-radius: var(--radius-md);
  font-size: 0.9rem;
  text-align: center;
  border: 1px solid #fca5a5;
}

.test-accounts {
  margin-top: 40px;
  padding-top: 24px;
  border-top: 1px solid var(--line);
  text-align: center;
}

.test-accounts .eyebrow {
  margin-bottom: 12px;
}

.test-badges {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-bottom: 12px;
}

.badge {
  border: none;
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s;
  font-family: var(--sans-body);
}

.badge:hover {
  transform: translateY(-2px);
}

.badge.admin { background: #f3e8ff; color: #6b21a8; }
.badge.docente { background: #e0f2fe; color: #0369a1; }
.badge.estudiante { background: #dcfce7; color: #15803d; }

.hint {
  font-size: 0.85rem;
  color: var(--muted);
  margin: 0;
}
</style>
