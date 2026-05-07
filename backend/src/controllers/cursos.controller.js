const { pool } = require('../config/db');

const cursosController = {
  // Obtener cursos (Depende del rol)
  async getCursos(req, res) {
    try {
      const { rol, id: usuario_id } = req.user;
      let query = `
        SELECT c.id, c.codigo, c.nombre, c.periodo, c.gestion, c.cupo, c.estado,
               c.fecha_inicio, c.fecha_fin,
               u.nombres || ' ' || u.apellidos AS docente_nombre,
               (SELECT COUNT(*) FROM curso_estudiantes ce WHERE ce.curso_id = c.id AND ce.estado = 'inscrito') as inscritos
        FROM cursos c
        LEFT JOIN usuarios u ON c.docente_ci = u.ci
      `;
      let params = [];

      if (rol === 'docente') {
        query += ' WHERE c.docente_ci = $1';
        params.push(usuario_id);
      } else if (rol === 'estudiante') {
        query = `
          SELECT c.id, c.codigo, c.nombre, c.periodo, c.gestion, c.cupo, c.estado,
                 c.fecha_inicio, c.fecha_fin,
                 u.nombres || ' ' || u.apellidos AS docente_nombre,
                 (SELECT COUNT(*) FROM curso_estudiantes ce2 WHERE ce2.curso_id = c.id AND ce2.estado = 'inscrito') as inscritos,
                 cal.nota_final, cal.estado_nota
          FROM cursos c
          LEFT JOIN usuarios u ON c.docente_ci = u.ci
          INNER JOIN curso_estudiantes ce ON c.id = ce.curso_id
          LEFT JOIN calificaciones cal ON c.id = cal.curso_id AND cal.estudiante_ci = ce.estudiante_ci
          WHERE ce.estudiante_ci = $1 AND ce.estado = 'inscrito'
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
      const { codigo, nombre, periodo, gestion, cupo, docente_ci, materia_codigo, fecha_inicio } = req.body;

      if (!docente_ci) {
        return res.status(400).json({ message: 'Se debe asignar un docente al curso' });
      }

      if (!fecha_inicio) {
        return res.status(400).json({ message: 'La fecha de inicio es obligatoria' });
      }

      const docente = await pool.query("SELECT ci FROM usuarios WHERE ci = $1 AND rol = 'docente'", [docente_ci]);
      if (docente.rows.length === 0) {
        return res.status(400).json({ message: 'El usuario asignado no existe o no tiene rol docente' });
      }

      // Verificar que el docente no tenga otro curso activo (fecha_fin >= hoy)
      const activo = await pool.query(
        `SELECT id FROM cursos WHERE docente_ci = $1 AND fecha_fin >= CURRENT_DATE AND estado = 'activo'`,
        [docente_ci]
      );
      if (activo.rows.length > 0) {
        return res.status(400).json({ message: 'El docente ya tiene un curso activo. Solo puede impartir un curso a la vez.' });
      }

      // Calcular fecha_fin: 20 días hábiles ≈ 4 semanas (27 días calendario)
      const fInicio = new Date(fecha_inicio);
      const fFin = new Date(fInicio);
      fFin.setDate(fFin.getDate() + 27);
      const fecha_fin = fFin.toISOString().split('T')[0];

      const result = await pool.query(
        `INSERT INTO cursos (docente_ci, materia_codigo, codigo, nombre, periodo, gestion, cupo, fecha_inicio, fecha_fin) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
        [docente_ci, materia_codigo, codigo, nombre, periodo, gestion, cupo || 40, fecha_inicio, fecha_fin]
      );
      
      const docenteResult = await pool.query('SELECT nombres || \' \' || apellidos AS nombre FROM usuarios WHERE ci = $1', [docente_ci]);
      const cursoData = { ...result.rows[0], docente_nombre: docenteResult.rows[0]?.nombre };

      res.status(201).json({ message: 'Curso creado exitosamente', curso: cursoData });
    } catch (error) {
      console.error(error);
      if (error.code === '23505') {
        return res.status(400).json({ message: 'El código del curso ya existe' });
      }
      res.status(500).json({ message: 'Error al crear curso' });
    }
  },

  // Actualizar un curso
  async updateCurso(req, res) {
    try {
      const { id } = req.params;
      const { codigo, nombre, periodo, gestion, cupo, estado, docente_ci, materia_codigo, fecha_inicio } = req.body;

      if (docente_ci) {
        const docente = await pool.query("SELECT ci FROM usuarios WHERE ci = $1 AND rol = 'docente'", [docente_ci]);
        if (docente.rows.length === 0) {
          return res.status(400).json({ message: 'El usuario asignado no existe o no tiene rol docente' });
        }
        // Verificar que el docente no tenga otro curso activo (excluyendo este)
        const activo = await pool.query(
          `SELECT id FROM cursos WHERE docente_ci = $1 AND fecha_fin >= CURRENT_DATE AND estado = 'activo' AND id != $2`,
          [docente_ci, id]
        );
        if (activo.rows.length > 0) {
          return res.status(400).json({ message: 'El docente ya tiene un curso activo. Solo puede impartir un curso a la vez.' });
        }
      }

      // Calcular fecha_fin si se proporciona fecha_inicio
      let fecha_fin = null;
      if (fecha_inicio) {
        const fInicio = new Date(fecha_inicio);
        const fFin = new Date(fInicio);
        fFin.setDate(fFin.getDate() + 27);
        fecha_fin = fFin.toISOString().split('T')[0];
      }

      const result = await pool.query(
        `UPDATE cursos 
         SET codigo = COALESCE($1, codigo), 
             nombre = COALESCE($2, nombre), 
             periodo = COALESCE($3, periodo), 
             gestion = COALESCE($4, gestion), 
             cupo = COALESCE($5, cupo),
             estado = COALESCE($6, estado),
             docente_ci = COALESCE($7, docente_ci),
             materia_codigo = COALESCE($8, materia_codigo),
             fecha_inicio = COALESCE($9, fecha_inicio),
             fecha_fin = COALESCE($10, fecha_fin)
         WHERE id = $11 RETURNING *`,
        [codigo, nombre, periodo, gestion, cupo, estado, docente_ci, materia_codigo, fecha_inicio, fecha_fin, id]
      );

      if (result.rows.length === 0) return res.status(404).json({ message: 'Curso no encontrado' });

      const docenteResult = await pool.query('SELECT nombres || \' \' || apellidos AS nombre FROM usuarios WHERE ci = $1', [result.rows[0].docente_ci]);
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

  // Obtener lista de materias (para formularios)
  async getMaterias(req, res) {
    try {
      const result = await pool.query(`
        SELECT m.codigo, m.nombre, m.semestre, m.creditos, c.nombre AS carrera, c.codigo AS carrera_codigo
        FROM materias m
        INNER JOIN carreras c ON c.id = m.carrera_id
        WHERE m.activo = TRUE
        ORDER BY c.codigo, m.semestre, m.nombre
      `);
      res.json(result.rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al cargar materias' });
    }
  },

  // RF05: Obtener cursos disponibles para el estudiante (solo de su carrera)
  async getCursosDisponibles(req, res) {
    try {
      const estudiante_id = req.user.id;
      const result = await pool.query(`
        SELECT c.id, c.codigo, c.nombre, c.periodo, c.gestion, c.cupo, c.estado,
               c.fecha_inicio, c.fecha_fin,
               u.nombres || ' ' || u.apellidos AS docente_nombre,
               (SELECT COUNT(*) FROM curso_estudiantes ce WHERE ce.curso_id = c.id AND ce.estado = 'inscrito') as inscritos
        FROM cursos c
        LEFT JOIN usuarios u ON c.docente_ci = u.ci
        INNER JOIN materias m ON m.codigo = c.materia_codigo
        WHERE c.estado = 'activo'
          AND c.id NOT IN (
            SELECT curso_id FROM curso_estudiantes WHERE estudiante_ci = $1
          )
          AND m.carrera_id = (
            SELECT e.carrera_id FROM estudiantes e WHERE e.usuario_ci = $1
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
      const estudiante_ci = req.user.id;

      // 1. Verificar si el curso existe y está activo
      const curso = await pool.query('SELECT cupo, estado, fecha_inicio, fecha_fin FROM cursos WHERE id = $1', [curso_id]);
      if (curso.rows.length === 0) return res.status(404).json({ message: 'Curso no encontrado' });
      if (curso.rows[0].estado !== 'activo') return res.status(400).json({ message: 'El curso no está activo' });

      // 2. Verificar que el estudiante no tenga un curso activo sin nota
      const activo = await pool.query(`
        SELECT ce.curso_id
        FROM curso_estudiantes ce
        INNER JOIN cursos c ON c.id = ce.curso_id
        LEFT JOIN calificaciones cal ON cal.curso_id = c.id AND cal.estudiante_ci = ce.estudiante_ci
        WHERE ce.estudiante_ci = $1
          AND ce.estado = 'inscrito'
          AND c.fecha_fin >= CURRENT_DATE
          AND cal.nota_final IS NULL
      `, [estudiante_ci]);
      if (activo.rows.length > 0) {
        return res.status(400).json({ message: 'Ya tienes un curso en curso. Debes esperar a que finalice o el docente suba tu nota para inscribirte en otro.' });
      }

      // 3. Verificar duplicidad (RF05)
      const inscrito = await pool.query('SELECT id FROM curso_estudiantes WHERE curso_id = $1 AND estudiante_ci = $2', [curso_id, estudiante_ci]);
      if (inscrito.rows.length > 0) return res.status(400).json({ message: 'Ya estás inscrito en este curso' });

      // 4. Verificar cupo
      const ocupados = await pool.query('SELECT COUNT(*) as count FROM curso_estudiantes WHERE curso_id = $1 AND estado = \'inscrito\'', [curso_id]);
      if (parseInt(ocupados.rows[0].count) >= curso.rows[0].cupo) {
        return res.status(400).json({ message: 'El curso ya no tiene cupos disponibles' });
      }

      // 5. Inscribir
      await pool.query(
        'INSERT INTO curso_estudiantes (curso_id, estudiante_ci) VALUES ($1, $2)',
        [curso_id, estudiante_ci]
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
        const check = await pool.query('SELECT id FROM cursos WHERE id = $1 AND docente_ci = $2', [curso_id, req.user.id]);
        if (check.rows.length === 0) return res.status(403).json({ message: 'No tienes permisos para ver este curso' });
      }

      // Traer estudiantes inscritos y sus calificaciones si existen
      const result = await pool.query(`
        SELECT u.ci AS estudiante_ci, u.nombres || ' ' || u.apellidos AS nombre, 
               e.registro, c.nota_final, c.observaciones, c.estado_nota
        FROM curso_estudiantes ce
        INNER JOIN usuarios u ON ce.estudiante_ci = u.ci
        LEFT JOIN estudiantes e ON u.ci = e.usuario_ci
        LEFT JOIN calificaciones c ON ce.curso_id = c.curso_id AND ce.estudiante_ci = c.estudiante_ci
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
      const { calificaciones } = req.body; // Array de { estudiante_ci, nota_final, observaciones }

      // Verificar que el curso pertenezca al docente o sea admin
      if (req.user.rol === 'docente') {
        const check = await pool.query('SELECT id FROM cursos WHERE id = $1 AND docente_ci = $2', [curso_id, req.user.id]);
        if (check.rows.length === 0) return res.status(403).json({ message: 'No tienes permisos para editar este curso' });
      }

      // Guardar calificaciones (Insert o Update)
      await pool.query('BEGIN');
      
      for (const calif of calificaciones) {
        const nota = calif.nota_final === '' || calif.nota_final === null ? null : parseFloat(calif.nota_final);
        const obs = calif.observaciones === '' ? null : calif.observaciones;

        await pool.query(`
          INSERT INTO calificaciones (curso_id, estudiante_ci, nota_final, observaciones)
          VALUES ($1, $2, $3, $4)
          ON CONFLICT (curso_id, estudiante_ci) 
          DO UPDATE SET nota_final = EXCLUDED.nota_final, 
                        observaciones = EXCLUDED.observaciones,
                        updated_at = NOW()
        `, [curso_id, calif.estudiante_ci, nota, obs]);
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
