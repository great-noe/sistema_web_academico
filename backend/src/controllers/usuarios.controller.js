const { pool } = require('../config/db');
const bcrypt = require('bcryptjs');

const usuariosController = {
  // Obtener docentes para asignación de cursos
  async getDocentes(req, res) {
    try {
      const result = await pool.query(`
        SELECT u.id, u.nombres || ' ' || u.apellidos AS nombre, d.codigo_docente 
        FROM usuarios u
        INNER JOIN docentes d ON u.id = d.usuario_id
        WHERE u.rol = 'docente'
        ORDER BY u.nombres ASC
      `);
      res.json(result.rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al obtener docentes' });
    }
  },

  // Obtener todos los usuarios
  async getUsuarios(req, res) {
    try {
      const result = await pool.query(`
        SELECT id, rol, nombres, apellidos, email, created_at
        FROM usuarios
        ORDER BY created_at DESC
      `);
      res.json(result.rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al obtener usuarios' });
    }
  },

  // Crear usuario
  async createUsuario(req, res) {
    try {
      const { rol, nombres, apellidos, email, password } = req.body;
      
      if (!['estudiante', 'docente', 'admin'].includes(rol)) {
        return res.status(400).json({ message: 'Rol inválido' });
      }

      const userExist = await pool.query('SELECT id FROM usuarios WHERE email = $1', [email]);
      if (userExist.rows.length > 0) {
        return res.status(400).json({ message: 'El correo ya está registrado' });
      }

      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

      await pool.query('BEGIN');
      const result = await pool.query(
        `INSERT INTO usuarios (rol, nombres, apellidos, email, password_hash) 
         VALUES ($1, $2, $3, $4, $5) RETURNING id, rol, nombres, apellidos, email`,
        [rol, nombres, apellidos, email, passwordHash]
      );

      const user = result.rows[0];
      if (rol === 'estudiante') {
        await pool.query('INSERT INTO estudiantes (usuario_id) VALUES ($1)', [user.id]);
      } else if (rol === 'docente') {
        await pool.query('INSERT INTO docentes (usuario_id) VALUES ($1)', [user.id]);
      }
      await pool.query('COMMIT');

      res.status(201).json({ message: 'Usuario creado exitosamente', user });
    } catch (error) {
      await pool.query('ROLLBACK');
      console.error(error);
      res.status(500).json({ message: 'Error al crear usuario' });
    }
  },

  // Actualizar usuario
  async updateUsuario(req, res) {
    try {
      const { id } = req.params;
      const { nombres, apellidos, email } = req.body;

      const result = await pool.query(
        `UPDATE usuarios 
         SET nombres = $1, apellidos = $2, email = $3
         WHERE id = $4 RETURNING id, rol, nombres, apellidos, email`,
        [nombres, apellidos, email, id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }

      res.json({ message: 'Usuario actualizado', user: result.rows[0] });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al actualizar usuario' });
    }
  },

  // Eliminar usuario
  async deleteUsuario(req, res) {
    try {
      const { id } = req.params;
      const result = await pool.query('DELETE FROM usuarios WHERE id = $1 RETURNING id', [id]);
      
      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }

      res.json({ message: 'Usuario eliminado correctamente' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al eliminar usuario' });
    }
  }
};

module.exports = usuariosController;
