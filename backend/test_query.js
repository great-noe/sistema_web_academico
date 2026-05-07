const { pool } = require('./src/config/db');
async function test() {
  try {
    const curso_id = 1;
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
    console.log('Calificaciones:', result.rows);
  } catch (e) {
    console.error(e);
  } finally {
    process.exit(0);
  }
}
test();
