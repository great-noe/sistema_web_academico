<script setup>
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useThemeStore } from '../stores/theme'
import { computed } from 'vue'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const themeStore = useThemeStore()

// If user somehow gets here without auth (e.g. initial load before guard catches it)
if (!authStore.user) {
  authStore.init()
}

const user = computed(() => authStore.user)

const handleLogout = () => {
  authStore.logout()
}

// Control access to menu items
const canSeeDocentes = computed(() => authStore.hasRole(['Administrador']))
const canSeeEstudiantes = computed(() => authStore.hasRole(['Administrador', 'Docente']))
const canSeeUsuarios = computed(() => authStore.hasRole(['Administrador']))
</script>

<template>
  <div class="app-layout" v-if="user">
    <aside class="sidebar">
      <div class="sidebar-header">
        <div class="logo">
          <span class="logo-icon">🎓</span>
          <h2>Academisys</h2>
        </div>
      </div>
      <nav class="sidebar-nav">
        <router-link to="/" class="nav-item" :class="{ active: route.path === '/' }">
          <span class="icon">📊</span> Dashboard
        </router-link>
        
        <router-link to="/cursos" class="nav-item" :class="{ active: route.path.includes('/cursos') }">
          <span class="icon">📚</span> Cursos y Materias
        </router-link>
        
        <router-link v-if="canSeeDocentes" to="/docentes" class="nav-item" :class="{ active: route.path.includes('/docentes') }">
          <span class="icon">👨‍🏫</span> Docentes
        </router-link>
        
        <router-link v-if="canSeeEstudiantes" to="/estudiantes" class="nav-item" :class="{ active: route.path.includes('/estudiantes') }">
          <span class="icon">👨‍🎓</span> Estudiantes
        </router-link>
        
        <router-link v-if="canSeeUsuarios" to="/usuarios" class="nav-item" :class="{ active: route.path.includes('/usuarios') }">
          <span class="icon">👥</span> Usuarios
        </router-link>
        
        <router-link v-if="canSeeUsuarios" to="/carreras" class="nav-item" :class="{ active: route.path.includes('/carreras') }">
          <span class="icon">📚</span> Carreras
        </router-link>
        
        <router-link to="/reportes" class="nav-item" :class="{ active: route.path.includes('/reportes') }">
          <span class="icon">📄</span> Reportes
        </router-link>
      </nav>
      
      <div class="sidebar-footer">
        <div class="user-profile">
          <div class="avatar">{{ user.avatar }}</div>
          <div class="user-info">
            <span class="name">{{ user.name }}</span>
            <span class="role">{{ user.role }}</span>
          </div>
          <button @click="handleLogout" class="logout-btn" title="Cerrar sesión">
            <span class="icon">🚪</span>
          </button>
        </div>
      </div>
    </aside>

    <main class="main-content">
      <header class="topbar">
        <div class="search-bar">
          <span class="search-icon">🔍</span>
          <input type="text" placeholder="Buscar en el sistema..." />
        </div>
        <div class="topbar-actions">
          <div class="role-badge" :class="user.role.toLowerCase()">
            {{ user.role }}
          </div>
          <button class="action-btn theme-toggle" @click="themeStore.toggle" :title="themeStore.theme === 'light' ? 'Modo oscuro' : 'Modo claro'">
            {{ themeStore.theme === 'light' ? '🌙' : '☀️' }}
          </button>
        </div>
      </header>
      
      <div class="page-content">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
    </main>
  </div>
</template>

<style scoped>
.app-layout {
  display: flex;
  height: 100vh;
  width: 100vw;
  background: var(--bg);
  overflow: hidden;
}

.sidebar {
  width: 280px;
  background: var(--panel-strong);
  border-right: 1px solid var(--line);
  display: flex;
  flex-direction: column;
  z-index: 10;
  box-shadow: 4px 0 24px var(--overlay-light);
}

.sidebar-header {
  padding: 32px 24px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-icon {
  font-size: 2rem;
}

.logo h2 {
  font-family: var(--sans);
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--heading);
  margin: 0;
  letter-spacing: -0.5px;
}

.sidebar-nav {
  flex: 1;
  padding: 0 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 20px;
  text-decoration: none;
  color: var(--muted);
  font-weight: 600;
  border-radius: var(--radius-md);
  transition: all 0.3s ease;
}

.nav-item:hover {
  background: var(--accent-soft);
  color: var(--accent-strong);
  transform: translateX(4px);
}

.nav-item.active {
  background: var(--accent);
  color: white;
  box-shadow: 0 8px 16px var(--accent-soft);
}

.nav-item .icon {
  font-size: 1.25rem;
}

.sidebar-footer {
  padding: 24px;
  border-top: 1px solid var(--line);
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 12px;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--accent-soft);
  color: var(--text);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.2rem;
}

.user-info {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.user-info .name {
  font-weight: 700;
  color: var(--heading);
  font-size: 0.95rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 120px;
}

.user-info .role {
  font-size: 0.8rem;
  color: var(--muted);
}

.logout-btn {
  background: transparent;
  border: none;
  color: var(--muted);
  font-size: 1.2rem;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logout-btn:hover {
  background: rgba(239, 68, 68, 0.1);
  color: var(--danger);
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
}

.topbar {
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 40px;
  background: var(--panel);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--line);
  z-index: 5;
}

.search-bar {
  display: flex;
  align-items: center;
  background: var(--panel-strong);
  border: 1px solid var(--line);
  border-radius: 999px;
  padding: 8px 20px;
  width: 350px;
  box-shadow: inset 0 2px 4px var(--overlay-light);
  transition: all 0.3s ease;
}

.search-bar:focus-within {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px var(--accent-soft);
}

.search-icon {
  color: var(--muted);
  margin-right: 12px;
}

.search-bar input {
  border: none;
  background: transparent;
  width: 100%;
  color: var(--text);
  font-size: 0.95rem;
}

.search-bar input:focus {
  outline: none;
}

.topbar-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.role-badge {
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 0.85rem;
  font-weight: 700;
  font-family: var(--sans);
}

.role-badge.administrador { background: rgba(129, 140, 248, 0.15); color: var(--accent-strong); }
.role-badge.docente { background: rgba(56, 189, 248, 0.15); color: var(--info); }
.role-badge.estudiante { background: rgba(52, 211, 153, 0.15); color: var(--success); }

.action-btn {
  background: var(--panel-strong);
  border: 1px solid var(--line);
  border-radius: 50%;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1.2rem;
  transition: all 0.2s;
}

.theme-toggle {
  font-size: 1.3rem;
}

.action-btn:hover {
  background: var(--accent-soft);
  border-color: var(--accent);
  transform: translateY(-2px);
}

.page-content {
  flex: 1;
  overflow-y: auto;
  padding: 40px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
