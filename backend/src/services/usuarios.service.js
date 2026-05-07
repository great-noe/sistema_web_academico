const { pool } = require('../config/db');
const bcrypt = require('bcryptjs');

async function createUser({ ci, rol, nombres, apellidos, email, password, carrera_id }) {
  if (!ci) {
    throw Object.assign(new Error('El CI es obligatorio'), { statusCode: 400 });
  }
  if (!['estudiante', 'docente', 'admin'].includes(rol)) {
    throw Object.assign(new Error('Rol inválido'), { statusCode: 400 });
  }

  const userExist = await pool.query('SELECT ci FROM usuarios WHERE email = $1', [email]);
  if (userExist.rows.length > 0) {
    throw Object.assign(new Error('El correo ya está registrado'), { statusCode: 400 });
  }

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  await pool.query('BEGIN');
  try {
    const result = await pool.query(
      `INSERT INTO usuarios (ci, rol, nombres, apellidos, email, password_hash) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING ci, rol, nombres, apellidos, email`,
      [ci, rol, nombres, apellidos, email, passwordHash]
    );

    const user = result.rows[0];
    if (rol === 'estudiante') {
      const cid = carrera_id || null;
      await pool.query('INSERT INTO estudiantes (usuario_ci, carrera_id) VALUES ($1, $2)', [user.ci, cid]);
    } else if (rol === 'docente') {
      await pool.query('INSERT INTO docentes (usuario_ci) VALUES ($1)', [user.ci]);
    }
    await pool.query('COMMIT');
    return user;
  } catch (error) {
    await pool.query('ROLLBACK');
    throw error;
  }
}

module.exports = { createUser };
