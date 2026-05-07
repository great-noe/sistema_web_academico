const express = require('express');
const router = express.Router();
const { pool } = require('../config/db');
const { authMiddleware, roleMiddleware } = require('../middlewares/auth.middleware');

// GET /api/carreras — lista carreras con sus materias
router.get('/', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT c.id, c.codigo, c.nombre, c.semestres, c.activo,
        COALESCE(json_agg(
          json_build_object(
            'codigo', m.codigo,
            'nombre', m.nombre,
            'semestre', m.semestre,
            'creditos', m.creditos,
            'tipo_valor', m.tipo_valor,
            'activo', m.activo
          )
          ORDER BY m.semestre, m.nombre
        ) FILTER (WHERE m.codigo IS NOT NULL), '[]') AS materias
      FROM carreras c
      LEFT JOIN materias m ON m.carrera_id = c.id
      GROUP BY c.id, c.codigo, c.nombre, c.semestres, c.activo
      ORDER BY c.codigo
    `);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al cargar carreras' });
  }
});

// PATCH /api/carreras/:codigo/toggle — toggle activo de carrera
router.patch('/:codigo/toggle', authMiddleware, roleMiddleware(['admin']), async (req, res) => {
  try {
    const result = await pool.query(
      'UPDATE carreras SET activo = NOT activo WHERE codigo = $1 RETURNING id, codigo, nombre, activo',
      [req.params.codigo]
    );
    if (result.rows.length === 0) return res.status(404).json({ message: 'Carrera no encontrada' });
    res.json({ message: 'Estado actualizado', carrera: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar carrera' });
  }
});

// PATCH /api/carreras/materias/:codigo/toggle — toggle activo de materia
router.patch('/materias/:codigo/toggle', authMiddleware, roleMiddleware(['admin']), async (req, res) => {
  try {
    const result = await pool.query(
      'UPDATE materias SET activo = NOT activo WHERE codigo = $1 RETURNING codigo, nombre, activo',
      [req.params.codigo]
    );
    if (result.rows.length === 0) return res.status(404).json({ message: 'Materia no encontrada' });
    res.json({ message: 'Estado actualizado', materia: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar materia' });
  }
});

module.exports = router;
