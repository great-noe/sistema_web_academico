<script setup>
import { onMounted, ref } from 'vue'
import { useUsuariosStore } from '../stores/usuarios'

const usuariosStore = useUsuariosStore()

const showModal = ref(false)
const modalMode = ref('crear')
const currentUserId = ref(null)

const formData = ref({
  nombres: '',
  apellidos: '',
  email: '',
  rol: 'estudiante',
  password: ''
})

onMounted(() => {
  usuariosStore.fetchUsuarios()
})

const openModal = (user = null) => {
  if (user) {
    modalMode.value = 'editar'
    currentUserId.value = user.id
    formData.value = {
      nombres: user.nombres,
      apellidos: user.apellidos,
      email: user.email,
      rol: user.rol,
      password: '' // Optional when editing
    }
  } else {
    modalMode.value = 'crear'
    currentUserId.value = null
    formData.value = {
      nombres: '',
      apellidos: '',
      email: '',
      rol: 'estudiante',
      password: ''
    }
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}

const saveUser = async () => {
  let result
  if (modalMode.value === 'crear') {
    if (!formData.value.password) {
      alert('La contraseña es requerida para un nuevo usuario.')
      return
    }
    result = await usuariosStore.crearUsuario(formData.value)
  } else {
    // Para editar no enviamos contraseña aquí
    const dataToUpdate = {
      nombres: formData.value.nombres,
      apellidos: formData.value.apellidos,
      email: formData.value.email
    }
    result = await usuariosStore.editarUsuario(currentUserId.value, dataToUpdate)
  }

  if (result.success) {
    closeModal()
    usuariosStore.fetchUsuarios()
  } else {
    alert(result.message)
  }
}

const deleteUser = async (id) => {
  if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
    const result = await usuariosStore.eliminarUsuario(id)
    if (!result.success) {
      alert(result.message)
    }
  }
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  const d = new Date(dateString)
  return d.toLocaleDateString()
}
</script>

<template>
  <div class="usuarios-view">
    <header class="view-header">
      <div class="header-content">
        <div>
          <p class="eyebrow">Gestión Administrativa</p>
          <h1>Gestión de Usuarios</h1>
          <p class="lead">Administra los accesos, roles e información de todo el personal e institucion.</p>
        </div>
        <button @click="openModal()" class="btn-primary new-btn">
          <span>+</span> Nuevo Usuario
        </button>
      </div>
    </header>

    <div v-if="usuariosStore.loading" class="loading-state">
      Cargando usuarios...
    </div>

    <div v-else-if="usuariosStore.error" class="error-state">
      {{ usuariosStore.error }}
      <button @click="usuariosStore.fetchUsuarios()" class="btn-secondary">Reintentar</button>
    </div>

    <div v-else class="table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th>Rol</th>
            <th>Nombres</th>
            <th>Apellidos</th>
            <th>Email</th>
            <th>Fecha Registro</th>
            <th class="actions-col">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in usuariosStore.usuarios" :key="user.id">
            <td>
              <span class="role-badge" :class="user.rol.toLowerCase()">
                {{ user.rol.charAt(0).toUpperCase() + user.rol.slice(1) }}
              </span>
            </td>
            <td class="fw-bold">{{ user.nombres }}</td>
            <td>{{ user.apellidos }}</td>
            <td class="mono text-muted">{{ user.email }}</td>
            <td class="text-muted">{{ formatDate(user.created_at) }}</td>
            <td class="actions-col">
              <button @click="openModal(user)" class="btn-icon edit" title="Editar">✏️</button>
              <button @click="deleteUser(user.id)" class="btn-icon delete" title="Eliminar">🗑️</button>
            </td>
          </tr>
          <tr v-if="usuariosStore.usuarios.length === 0">
            <td colspan="6" class="text-center empty-td">No hay usuarios registrados.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal Form -->
    <div v-if="showModal" class="modal-backdrop">
      <div class="modal">
        <header class="modal-header">
          <h2>{{ modalMode === 'crear' ? 'Crear Nuevo Usuario' : 'Editar Usuario' }}</h2>
          <button @click="closeModal" class="close-btn">×</button>
        </header>
        <form @submit.prevent="saveUser" class="modal-form">
          <div class="form-row">
            <div class="form-group">
              <label>Nombres</label>
              <input v-model="formData.nombres" type="text" required placeholder="Nombres del usuario" />
            </div>
            <div class="form-group">
              <label>Apellidos</label>
              <input v-model="formData.apellidos" type="text" required placeholder="Apellidos del usuario" />
            </div>
          </div>
          
          <div class="form-group">
            <label>Correo Electrónico</label>
            <input v-model="formData.email" type="email" required placeholder="ejemplo@academisys.edu" />
          </div>

          <div class="form-row" v-if="modalMode === 'crear'">
            <div class="form-group">
              <label>Rol</label>
              <select v-model="formData.rol" required>
                <option value="estudiante">Estudiante</option>
                <option value="docente">Docente</option>
                <option value="admin">Administrador</option>
              </select>
            </div>
            <div class="form-group">
              <label>Contraseña Provisional</label>
              <input v-model="formData.password" type="password" required placeholder="••••••••" />
            </div>
          </div>

          <footer class="modal-actions">
            <button type="button" @click="closeModal" class="btn-secondary">Cancelar</button>
            <button type="submit" class="btn-primary">Guardar Usuario</button>
          </footer>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.usuarios-view {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.view-header .header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.view-header h1 {
  font-family: var(--sans);
  font-size: 2.5rem;
  color: var(--heading);
  margin: 8px 0;
  font-weight: 800;
  letter-spacing: -1px;
}

.new-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1.1rem;
}

.new-btn span {
  font-size: 1.5rem;
  font-weight: normal;
}

.loading-state, .error-state {
  background: white;
  border-radius: var(--radius-lg);
  padding: 48px;
  text-align: center;
  border: 1px solid var(--line);
}

.table-container {
  background: white;
  border-radius: var(--radius-lg);
  border: 1px solid var(--line);
  box-shadow: var(--shadow);
  overflow: hidden;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th {
  text-align: left;
  padding: 16px 24px;
  background: var(--bg);
  color: var(--muted);
  font-size: 0.85rem;
  text-transform: uppercase;
  font-weight: 700;
  border-bottom: 2px solid var(--line);
}

.data-table td {
  padding: 16px 24px;
  border-bottom: 1px solid var(--line);
  vertical-align: middle;
}

.data-table tr:last-child td {
  border-bottom: none;
}

.data-table tbody tr:hover {
  background-color: var(--bg);
}

.role-badge {
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 0.85rem;
  font-weight: 700;
  font-family: var(--sans);
  display: inline-block;
}

.role-badge.admin { background: #f3e8ff; color: #6b21a8; }
.role-badge.docente { background: #e0f2fe; color: #0369a1; }
.role-badge.estudiante { background: #dcfce7; color: #15803d; }

.fw-bold { font-weight: 600; color: var(--heading); }
.text-muted { color: var(--muted); }
.mono { font-family: var(--mono); font-size: 0.9rem; }
.text-center { text-align: center; }
.empty-td { padding: 48px !important; color: var(--muted); }

.actions-col {
  text-align: right;
  width: 120px;
}

.btn-icon {
  background: transparent;
  border: 1px solid var(--line);
  border-radius: var(--radius-sm);
  width: 32px;
  height: 32px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin-left: 8px;
  transition: all 0.2s;
}

.btn-icon:hover {
  background: var(--bg);
  transform: translateY(-2px);
}

.btn-icon.delete:hover {
  background: #fef2f2;
  border-color: #fca5a5;
}

/* Modal Styles */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.modal {
  background: white;
  border-radius: var(--radius-xl);
  width: 100%;
  max-width: 500px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  overflow: hidden;
}

.modal-header {
  padding: 24px 32px;
  border-bottom: 1px solid var(--line);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.5rem;
}

.close-btn {
  background: transparent;
  border: none;
  font-size: 2rem;
  line-height: 1;
  color: var(--muted);
  cursor: pointer;
}

.close-btn:hover {
  color: var(--danger);
}

.modal-form {
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
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

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 12px;
}
</style>
