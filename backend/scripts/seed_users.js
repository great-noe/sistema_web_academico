const { pool } = require('../src/config/db');
const bcrypt = require('bcryptjs');

async function seedUsers() {
  try {
    const salt = await bcrypt.genSalt(10);
    const defaultPassword = process.env.SEED_PASSWORD || 'academico2025';
    const hash = await bcrypt.hash(defaultPassword, salt);

    console.log('Creando usuarios...');

    // Admin
    await pool.query(
      `INSERT INTO usuarios (ci, rol, nombres, apellidos, email, password_hash) 
       VALUES ('admin', 'admin', 'Carlos', 'Administrador', 'admin@sistema.edu', $1) 
       ON CONFLICT (ci) DO NOTHING`,
      [hash]
    );

    // Docente
    await pool.query(
      `INSERT INTO usuarios (ci, rol, nombres, apellidos, email, password_hash) 
       VALUES ('12345678', 'docente', 'Laura', 'Docente', 'docente@sistema.edu', $1) 
       ON CONFLICT (ci) DO NOTHING`,
      [hash]
    );
    await pool.query(
      `INSERT INTO docentes (usuario_ci, codigo_docente) VALUES ($1, $2) 
       ON CONFLICT (usuario_ci) DO NOTHING`,
      ['12345678', 'DOC-001']
    );

    // Estudiante
    await pool.query(
      `INSERT INTO usuarios (ci, rol, nombres, apellidos, email, password_hash) 
       VALUES ('87654321', 'estudiante', 'Juan', 'Estudiante', 'estudiante@sistema.edu', $1) 
       ON CONFLICT (ci) DO NOTHING`,
      [hash]
    );
    await pool.query(
      `INSERT INTO estudiantes (usuario_ci, registro) VALUES ($1, $2) 
       ON CONFLICT (usuario_ci) DO NOTHING`,
      ['87654321', 'EST-001']
    );

    const pwdDisplay = process.env.SEED_PASSWORD ? 'variable SEED_PASSWORD' : 'academico2025';
    console.log('✅ Usuarios creados correctamente (admin, docente, estudiante) con contraseña: ' + pwdDisplay);
    console.log('   CIs: admin, 12345678, 87654321');
    process.exit(0);
  } catch (error) {
    console.error('Error al poblar usuarios:', error);
    process.exit(1);
  }
}

seedUsers();
