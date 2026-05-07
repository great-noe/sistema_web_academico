<template>
  <div class="placeholder-view">
    <header class="view-header">
      <p class="eyebrow">Módulo</p>
      <h1>Gestión de Estudiantes</h1>
      <p class="lead">Administra inscripciones, historiales académicos y perfiles de estudiantes.</p>
    </header>

    <div class="panel empty-state">
      <div class="empty-icon">👨‍🎓</div>
      <h2>Módulo en construcción</h2>
      <p>Próximamente podrás gestionar toda la información de los estudiantes desde aquí.</p>
      <button class="action-btn">Volver al Dashboard</button>
    </div>
  </div>
</template>

<style scoped>
.placeholder-view {
  display: flex;
  flex-direction: column;
  gap: 32px;
  height: 100%;
}

.view-header h1 {
  font-family: var(--sans);
  font-size: 2.5rem;
  color: var(--heading);
  margin: 8px 0;
  font-weight: 800;
  letter-spacing: -1px;
}

.panel {
  background: white;
  border-radius: var(--radius-xl);
  padding: 60px;
  box-shadow: var(--shadow);
  border: 1px solid var(--line);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  flex: 1;
}

.empty-icon {
  font-size: 5rem;
  margin-bottom: 24px;
}

.empty-state h2 {
  font-size: 2rem;
  color: var(--heading);
  margin: 0 0 16px;
}

.empty-state p {
  font-size: 1.1rem;
  color: var(--muted);
  margin-bottom: 32px;
  max-width: 500px;
}

.action-btn {
  background: var(--accent);
  color: white;
  border: none;
  padding: 14px 28px;
  border-radius: 999px;
  font-weight: bold;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(15, 76, 92, 0.2);
}
</style>
