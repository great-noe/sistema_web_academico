const { pool } = require('../src/config/db');
const bcrypt = require('bcryptjs');

async function seedUsers() {
  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash('123456', salt);

    console.log('Creando usuarios...');

    // Admin
    await pool.query(
      `INSERT INTO usuarios (rol, nombres, apellidos, email, password_hash) 
       VALUES ('admin', 'Carlos', 'Administrador', 'admin', $1) 
       ON CONFLICT (email) DO NOTHING`,
      [hash]
    );

    // Docente
    const docenteResult = await pool.query(
      `INSERT INTO usuarios (rol, nombres, apellidos, email, password_hash) 
       VALUES ('docente', 'Laura', 'Docente', 'docente', $1) 
       ON CONFLICT (email) DO NOTHING RETURNING id`,
      [hash]
    );
    if (docenteResult.rows.length > 0) {
      await pool.query('INSERT INTO docentes (usuario_id, codigo_docente) VALUES ($1, $2)', [docenteResult.rows[0].id, 'DOC-001']);
    }

    // Estudiante
    const estudianteResult = await pool.query(
      `INSERT INTO usuarios (rol, nombres, apellidos, email, password_hash) 
       VALUES ('estudiante', 'Juan', 'Estudiante', 'estudiante', $1) 
       ON CONFLICT (email) DO NOTHING RETURNING id`,
      [hash]
    );
    if (estudianteResult.rows.length > 0) {
      await pool.query('INSERT INTO estudiantes (usuario_id, registro) VALUES ($1, $2)', [estudianteResult.rows[0].id, 'EST-001']);
    }

    console.log('✅ Usuarios creados correctamente (admin, docente, estudiante) con contraseña: 123456');
    process.exit(0);
  } catch (error) {
    console.error('Error al poblar usuarios:', error);
    process.exit(1);
  }
}

seedUsers();
