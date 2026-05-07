import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

import Layout from '../vistas/Layout.vue'
import Dashboard from '../vistas/Dashboard.vue'
import Reportes from '../vistas/Reportes.vue'
import Docentes from '../vistas/Docentes.vue'
import Estudiantes from '../vistas/Estudiantes.vue'
import Usuarios from '../vistas/Usuarios.vue'
import Login from '../vistas/Login.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: Login,
      meta: { requiresAuth: false }
    },
    {
      path: '/',
      component: Layout,
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'Dashboard',
          component: Dashboard
        },
        {
          path: 'reportes',
          name: 'Reportes',
          component: Reportes
        },
        {
          path: 'cursos',
          name: 'Cursos',
          component: () => import('../vistas/Cursos.vue')
        },
        {
          path: 'docentes',
          name: 'Docentes',
          component: Docentes,
          meta: { roles: ['Administrador'] }
        },
        {
          path: 'estudiantes',
          name: 'Estudiantes',
          component: Estudiantes,
          meta: { roles: ['Administrador', 'Docente'] }
        },
        {
          path: 'usuarios',
          name: 'Usuarios',
          component: Usuarios,
          meta: { roles: ['Administrador'] }
        }
      ]
    }
  ]
})

// Navigation Guard
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  // Need to initialize auth state from localStorage if not already done
  // It's normally called from App.vue, but we can safely call it here to be sure
  if (!authStore.user && localStorage.getItem('auth_user')) {
    authStore.init()
  }

  const isAuthenticated = authStore.isAuthenticated
  const userRole = authStore.userRole

  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login')
  } else if (to.path === '/login' && isAuthenticated) {
    next('/')
  } else if (to.meta.roles && !to.meta.roles.includes(userRole)) {
    // If route requires a specific role and user doesn't have it
    next('/')
  } else {
    next()
  }
})

export default router
