const { pool } = require('../config/db');

const cursosController = {
  // Obtener cursos (Depende del rol)
  async getCursos(req, res) {
    try {
      const { rol, id: usuario_id } = req.user;
      let query = `
        SELECT c.id, c.codigo, c.nombre, c.periodo, c.gestion, c.cupo, c.estado, 
               u.nombres || ' ' || u.apellidos AS docente_nombre,
               (SELECT COUNT(*) FROM curso_estudiantes ce WHERE ce.curso_id = c.id AND ce.estado = 'inscrito') as inscritos
        FROM cursos c
        LEFT JOIN usuarios u ON c.docente_id = u.id
      `;
      let params = [];

      if (rol === 'docente') {
        query += ' WHERE c.docente_id = $1';
        params.push(usuario_id);
      } else if (rol === 'estudiante') {
        // Cursos donde está inscrito el estudiante, incluir la nota si la hay
        query = `
          SELECT c.id, c.codigo, c.nombre, c.periodo, c.gestion, c.cupo, c.estado, 
                 u.nombres || ' ' || u.apellidos AS docente_nombre,
                 (SELECT COUNT(*) FROM curso_estudiantes ce2 WHERE ce2.curso_id = c.id AND ce2.estado = 'inscrito') as inscritos,
                 cal.nota_final, cal.estado_nota
          FROM cursos c
          LEFT JOIN usuarios u ON c.docente_id = u.id
          INNER JOIN curso_estudiantes ce ON c.id = ce.curso_id
          LEFT JOIN calificaciones cal ON c.id = cal.curso_id AND cal.estudiante_id = ce.estudiante_id
          WHERE ce.estudiante_id = $1 AND ce.estado = 'inscrito'
        `;
        params.push(usuario_id);
      }
      
      query += ' ORDER BY c.created_at DESC';

      const result = await pool.query(query, params);
      res.json(result.rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al obtener cursos' });
    }
  },

  // Crear un curso (Admin)
  async createCurso(req, res) {
    try {
      const { codigo, nombre, periodo, gestion, cupo, docente_id } = req.body;

      if (!docente_id) {
        return res.status(400).json({ message: 'Se debe asignar un docente al curso' });
      }

      const result = await pool.query(
        `INSERT INTO cursos (docente_id, codigo, nombre, periodo, gestion, cupo) 
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
        [docente_id, codigo, nombre, periodo, gestion, cupo || 40]
      );
      
      // Obtener nombre del docente asignado para devolver en el response
      const docenteResult = await pool.query('SELECT nombres || \' \' || apellidos AS nombre FROM usuarios WHERE id = $1', [docente_id]);
      const cursoData = { ...result.rows[0], docente_nombre: docenteResult.rows[0]?.nombre };

      res.status(201).json({ message: 'Curso creado exitosamente', curso: cursoData });
    } catch (error) {
      console.error(error);
      if (error.code === '23505') { // Unique constraint violation
        return res.status(400).json({ message: 'El código del curso ya existe' });
      }
      res.status(500).json({ message: 'Error al crear curso' });
    }
  },

  // Actualizar un curso
  async updateCurso(req, res) {
    try {
      const { id } = req.params;
      const { codigo, nombre, periodo, gestion, cupo, estado, docente_id } = req.body;

      const result = await pool.query(
        `UPDATE cursos 
         SET codigo = COALESCE($1, codigo), 
             nombre = COALESCE($2, nombre), 
             periodo = COALESCE($3, periodo), 
             gestion = COALESCE($4, gestion), 
             cupo = COALESCE($5, cupo),
             estado = COALESCE($6, estado),
             docente_id = COALESCE($7, docente_id)
         WHERE id = $8 RETURNING *`,
        [codigo, nombre, periodo, gestion, cupo, estado, docente_id, id]
      );

      if (result.rows.length === 0) return res.status(404).json({ message: 'Curso no encontrado' });

      // Obtener nombre del docente asignado para devolver en el response
      const docenteResult = await pool.query('SELECT nombres || \' \' || apellidos AS nombre FROM usuarios WHERE id = $1', [result.rows[0].docente_id]);
      const cursoData = { ...result.rows[0], docente_nombre: docenteResult.rows[0]?.nombre };

      res.json({ message: 'Curso actualizado', curso: cursoData });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al actualizar curso' });
    }
  },

  // Eliminar un curso
  async deleteCurso(req, res) {
    try {
      const { id } = req.params;
      const result = await pool.query('DELETE FROM cursos WHERE id = $1 RETURNING id', [id]);
      if (result.rows.length === 0) return res.status(404).json({ message: 'Curso no encontrado' });

      res.json({ message: 'Curso eliminado' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al eliminar curso. Es posible que tenga alumnos inscritos.' });
    }
  },

  // RF05: Obtener cursos disponibles para el estudiante (donde no está inscrito)
  async getCursosDisponibles(req, res) {
    try {
      const estudiante_id = req.user.id;
      const result = await pool.query(`
        SELECT c.id, c.codigo, c.nombre, c.periodo, c.gestion, c.cupo, c.estado, 
               u.nombres || ' ' || u.apellidos AS docente_nombre,
               (SELECT COUNT(*) FROM curso_estudiantes ce WHERE ce.curso_id = c.id AND ce.estado = 'inscrito') as inscritos
        FROM cursos c
        LEFT JOIN usuarios u ON c.docente_id = u.id
        WHERE c.estado = 'activo'
          AND c.id NOT IN (
            SELECT curso_id FROM curso_estudiantes WHERE estudiante_id = $1
          )
        ORDER BY c.created_at DESC
      `, [estudiante_id]);
      
      res.json(result.rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al cargar cursos disponibles' });
    }
  },

  // RF05: Inscribirse a un curso
  async inscribir(req, res) {
    try {
      const { id: curso_id } = req.params;
      const estudiante_id = req.user.id;

      // 1. Verificar si el curso existe y está activo
      const curso = await pool.query('SELECT cupo, estado FROM cursos WHERE id = $1', [curso_id]);
      if (curso.rows.length === 0) return res.status(404).json({ message: 'Curso no encontrado' });
      if (curso.rows[0].estado !== 'activo') return res.status(400).json({ message: 'El curso no está activo' });

      // 2. Verificar duplicidad (RF05)
      const inscrito = await pool.query('SELECT id FROM curso_estudiantes WHERE curso_id = $1 AND estudiante_id = $2', [curso_id, estudiante_id]);
      if (inscrito.rows.length > 0) return res.status(400).json({ message: 'Ya estás inscrito en este curso' });

      // 3. Verificar cupo
      const ocupados = await pool.query('SELECT COUNT(*) as count FROM curso_estudiantes WHERE curso_id = $1 AND estado = \'inscrito\'', [curso_id]);
      if (parseInt(ocupados.rows[0].count) >= curso.rows[0].cupo) {
        return res.status(400).json({ message: 'El curso ya no tiene cupos disponibles' });
      }

      // 4. Inscribir
      await pool.query(
        'INSERT INTO curso_estudiantes (curso_id, estudiante_id) VALUES ($1, $2)',
        [curso_id, estudiante_id]
      );

      res.status(201).json({ message: 'Inscripción exitosa' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al inscribirse en el curso' });
    }
  },

  // RF07: Obtener calificaciones de un curso (Docente / Admin)
  async getCalificaciones(req, res) {
    try {
      const { id: curso_id } = req.params;

      // Verificar que el curso pertenezca al docente o sea admin
      if (req.user.rol === 'docente') {
        const check = await pool.query('SELECT id FROM cursos WHERE id = $1 AND docente_id = $2', [curso_id, req.user.id]);
        if (check.rows.length === 0) return res.status(403).json({ message: 'No tienes permisos para ver este curso' });
      }

      // Traer estudiantes inscritos y sus calificaciones si existen
      const result = await pool.query(`
        SELECT u.id AS estudiante_id, u.nombres || ' ' || u.apellidos AS nombre, 
               e.registro, c.nota_final, c.observaciones, c.estado_nota
        FROM curso_estudiantes ce
        INNER JOIN usuarios u ON ce.estudiante_id = u.id
        LEFT JOIN estudiantes e ON u.id = e.usuario_id
        LEFT JOIN calificaciones c ON ce.curso_id = c.curso_id AND ce.estudiante_id = c.estudiante_id
        WHERE ce.curso_id = $1 AND ce.estado = 'inscrito'
        ORDER BY u.apellidos ASC, u.nombres ASC
      `, [curso_id]);

      res.json(result.rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al obtener calificaciones' });
    }
  },

  // RF07: Registrar o actualizar calificaciones de un curso (Docente / Admin)
  async updateCalificaciones(req, res) {
    try {
      const { id: curso_id } = req.params;
      const { calificaciones } = req.body; // Array de { estudiante_id, nota_final, observaciones }

      // Verificar que el curso pertenezca al docente o sea admin
      if (req.user.rol === 'docente') {
        const check = await pool.query('SELECT id FROM cursos WHERE id = $1 AND docente_id = $2', [curso_id, req.user.id]);
        if (check.rows.length === 0) return res.status(403).json({ message: 'No tienes permisos para editar este curso' });
      }

      // Guardar calificaciones (Insert o Update)
      // Como pueden ser varios estudiantes, usamos una transacción o iteración simple
      await pool.query('BEGIN');
      
      for (const calif of calificaciones) {
        const nota = calif.nota_final === '' || calif.nota_final === null ? null : parseFloat(calif.nota_final);
        const obs = calif.observaciones === '' ? null : calif.observaciones;

        // En PostgreSQL 9.5+ se puede usar ON CONFLICT
        await pool.query(`
          INSERT INTO calificaciones (curso_id, estudiante_id, nota_final, observaciones)
          VALUES ($1, $2, $3, $4)
          ON CONFLICT (curso_id, estudiante_id) 
          DO UPDATE SET nota_final = EXCLUDED.nota_final, 
                        observaciones = EXCLUDED.observaciones,
                        updated_at = NOW()
        `, [curso_id, calif.estudiante_id, nota, obs]);
      }

      await pool.query('COMMIT');
      res.json({ message: 'Calificaciones guardadas exitosamente' });
    } catch (error) {
      await pool.query('ROLLBACK');
      console.error(error);
      res.status(500).json({ message: 'Error al guardar calificaciones' });
    }
  }
};

module.exports = cursosController;
