const { pool } = require('../config/db');

const dashboardController = {
  async getStats(req, res) {
    try {
      const { rol, id: userId } = req.user;

      if (rol === 'admin') {
        const [docentes, estudiantes, materias, cursos, adminCount] = await Promise.all([
          pool.query("SELECT COUNT(*)::int AS total FROM usuarios WHERE rol = 'docente'"),
          pool.query("SELECT COUNT(*)::int AS total FROM usuarios WHERE rol = 'estudiante'"),
          pool.query('SELECT COUNT(*)::int AS total FROM materias'),
          pool.query('SELECT COUNT(*)::int AS total FROM cursos'),
          pool.query("SELECT COUNT(*)::int AS total FROM usuarios WHERE rol = 'admin'"),
        ]);
        return res.json({
          docentes: docentes.rows[0].total,
          estudiantes: estudiantes.rows[0].total,
          materias: materias.rows[0].total,
          cursos: cursos.rows[0].total,
          administrativos: adminCount.rows[0].total,
          misCursos: 0,
          promedio: 0,
        });
      }

      if (rol === 'docente') {
        const [cursos, estudiantes, docentes, materias] = await Promise.all([
          pool.query('SELECT COUNT(*)::int AS total FROM cursos WHERE docente_ci = $1', [userId]),
          pool.query(`
            SELECT COUNT(DISTINCT ce.estudiante_ci)::int AS total
            FROM curso_estudiantes ce
            INNER JOIN cursos c ON c.id = ce.curso_id
            WHERE c.docente_ci = $1 AND ce.estado = 'inscrito'`, [userId]),
          pool.query("SELECT COUNT(*)::int AS total FROM usuarios WHERE rol = 'docente'"),
          pool.query('SELECT COUNT(*)::int AS total FROM materias'),
        ]);
        return res.json({
          docentes: docentes.rows[0].total,
          estudiantes: estudiantes.rows[0].total,
          materias: materias.rows[0].total,
          cursos: cursos.rows[0].total,
          administrativos: 0,
          misCursos: cursos.rows[0].total,
          promedio: 0,
        });
      }

      if (rol === 'estudiante') {
        const [misCursos, promedioResult, cursosData, docentes] = await Promise.all([
          pool.query("SELECT COUNT(*)::int AS total FROM curso_estudiantes WHERE estudiante_ci = $1 AND estado = 'inscrito'", [userId]),
          pool.query(`
            SELECT COALESCE(ROUND(AVG(nota_final), 1), 0)::float AS promedio
            FROM calificaciones WHERE estudiante_ci = $1`, [userId]),
          pool.query('SELECT COUNT(*)::int AS total FROM cursos'),
          pool.query("SELECT COUNT(*)::int AS total FROM usuarios WHERE rol = 'docente'"),
        ]);
        return res.json({
          docentes: docentes.rows[0].total,
          estudiantes: 0,
          materias: 0,
          cursos: cursosData.rows[0].total,
          administrativos: 0,
          misCursos: misCursos.rows[0].total,
          promedio: promedioResult.rows[0].promedio,
        });
      }

      res.status(403).json({ message: 'Rol no válido' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al obtener estadísticas' });
    }
  },
};

module.exports = dashboardController;
