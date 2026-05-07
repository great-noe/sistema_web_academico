const { pool } = require('../config/db');
const { createUser } = require('../services/usuarios.service');

const usuariosController = {
  // Obtener estudiantes (Admin y Docente)
  async getEstudiantes(req, res) {
    try {
      const result = await pool.query(`
        SELECT u.ci, u.nombres, u.apellidos, u.email, u.created_at,
               e.registro, e.carrera_id, ca.nombre AS carrera
        FROM usuarios u
        LEFT JOIN estudiantes e ON u.ci = e.usuario_ci
        LEFT JOIN carreras ca ON ca.id = e.carrera_id
        WHERE u.rol = 'estudiante'
        ORDER BY u.apellidos ASC, u.nombres ASC
      `);
      res.json(result.rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al obtener estudiantes' });
    }
  },

  // Obtener docentes para asignación de cursos
  async getDocentes(req, res) {
    try {
      const result = await pool.query(`
        SELECT u.ci, u.nombres || ' ' || u.apellidos AS nombre, d.codigo_docente 
        FROM usuarios u
        INNER JOIN docentes d ON u.ci = d.usuario_ci
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
        SELECT ci, rol, nombres, apellidos, email, created_at
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
      const { ci, rol, nombres, apellidos, email, password, carrera_id } = req.body;
      const user = await createUser({ ci, rol, nombres, apellidos, email, password, carrera_id });
      res.status(201).json({ message: 'Usuario creado exitosamente', user });
    } catch (error) {
      console.error(error);
      const status = error.statusCode || 500;
      res.status(status).json({ message: error.message || 'Error al crear usuario' });
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
         WHERE ci = $4 RETURNING ci, rol, nombres, apellidos, email`,
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
      const result = await pool.query('DELETE FROM usuarios WHERE ci = $1 RETURNING ci', [id]);
      
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
