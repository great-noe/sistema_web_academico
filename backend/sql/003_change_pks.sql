BEGIN;

-- =============================================================
-- Migración: cambiar PK de usuarios → ci, materias → codigo
-- =============================================================

-- 1. Eliminar TODAS las FK que referencian usuarios.id
ALTER TABLE IF EXISTS estudiantes      DROP CONSTRAINT IF EXISTS estudiantes_usuario_id_fkey;
ALTER TABLE IF EXISTS docentes         DROP CONSTRAINT IF EXISTS docentes_usuario_id_fkey;
ALTER TABLE IF EXISTS cursos            DROP CONSTRAINT IF EXISTS cursos_docente_id_fkey;
ALTER TABLE IF EXISTS curso_estudiantes DROP CONSTRAINT IF EXISTS curso_estudiantes_estudiante_id_fkey;
ALTER TABLE IF EXISTS calificaciones   DROP CONSTRAINT IF EXISTS calificaciones_estudiante_id_fkey;

-- 2. Eliminar FK que referencian materias.id
ALTER TABLE IF EXISTS materias_prerrequisito DROP CONSTRAINT IF EXISTS materias_prerrequisito_materia_id_fkey;
ALTER TABLE IF EXISTS materias_prerrequisito DROP CONSTRAINT IF EXISTS materias_prerrequisito_prerrequisito_id_fkey;
ALTER TABLE IF EXISTS cursos                  DROP CONSTRAINT IF EXISTS cursos_materia_id_fkey;

-- 3. Eliminar PKs viejas (CASCADE elimina cualquier FK remanente)
ALTER TABLE IF EXISTS usuarios DROP CONSTRAINT IF EXISTS usuarios_pkey CASCADE;
ALTER TABLE IF EXISTS materias DROP CONSTRAINT IF EXISTS materias_pkey CASCADE;

-- 4. Agregar columna ci a usuarios y populatla
ALTER TABLE IF EXISTS usuarios ADD COLUMN IF NOT EXISTS ci VARCHAR(20);

-- Poblar ci para usuarios existentes (usando email prefix como fallback)
UPDATE usuarios SET ci = split_part(email, '@', 1) WHERE ci IS NULL;

-- Hacer ci NOT NULL y PK
ALTER TABLE IF EXISTS usuarios ALTER COLUMN ci SET NOT NULL;
ALTER TABLE IF EXISTS usuarios ADD PRIMARY KEY (ci);

-- Eliminar columna id (ya no es PK)
ALTER TABLE IF EXISTS usuarios DROP COLUMN IF EXISTS id CASCADE;

-- 5. Materias: hacer codigo la PK
ALTER TABLE IF EXISTS materias ADD PRIMARY KEY (codigo);
ALTER TABLE IF EXISTS materias DROP COLUMN IF EXISTS id CASCADE;

-- 6. Cambiar tipo de columnas FK y renombrar
-- estudiantes: usuario_id → usuario_ci
ALTER TABLE IF EXISTS estudiantes ADD COLUMN IF NOT EXISTS usuario_ci VARCHAR(20);
UPDATE estudiantes e SET usuario_ci = u.ci FROM usuarios u WHERE e.usuario_id::text = u.ci;
ALTER TABLE IF EXISTS estudiantes DROP COLUMN IF EXISTS usuario_id;
ALTER TABLE IF EXISTS estudiantes ALTER COLUMN usuario_ci SET NOT NULL;
ALTER TABLE IF EXISTS estudiantes ADD CONSTRAINT estudiantes_usuario_ci_fkey FOREIGN KEY (usuario_ci) REFERENCES usuarios(ci) ON DELETE CASCADE;

-- docentes: usuario_id → usuario_ci
ALTER TABLE IF EXISTS docentes ADD COLUMN IF NOT EXISTS usuario_ci VARCHAR(20);
UPDATE docentes d SET usuario_ci = u.ci FROM usuarios u WHERE d.usuario_id::text = u.ci;
ALTER TABLE IF EXISTS docentes DROP COLUMN IF EXISTS usuario_id;
ALTER TABLE IF EXISTS docentes ALTER COLUMN usuario_ci SET NOT NULL;
ALTER TABLE IF EXISTS docentes ADD CONSTRAINT docentes_usuario_ci_fkey FOREIGN KEY (usuario_ci) REFERENCES usuarios(ci) ON DELETE CASCADE;

-- cursos: docente_id → docente_ci
ALTER TABLE IF EXISTS cursos ADD COLUMN IF NOT EXISTS docente_ci VARCHAR(20);
UPDATE cursos c SET docente_ci = u.ci FROM usuarios u WHERE c.docente_id::text = u.ci;
ALTER TABLE IF EXISTS cursos DROP COLUMN IF EXISTS docente_id;
ALTER TABLE IF EXISTS cursos ALTER COLUMN docente_ci SET NOT NULL;
ALTER TABLE IF EXISTS cursos ADD CONSTRAINT cursos_docente_ci_fkey FOREIGN KEY (docente_ci) REFERENCES usuarios(ci) ON DELETE RESTRICT;

-- cursos: materia_id → materia_codigo
ALTER TABLE IF EXISTS cursos ADD COLUMN IF NOT EXISTS materia_codigo VARCHAR(32);
UPDATE cursos c SET materia_codigo = m.codigo FROM materias m WHERE c.materia_id = m.id;
ALTER TABLE IF EXISTS cursos DROP COLUMN IF EXISTS materia_id;
ALTER TABLE IF EXISTS cursos ADD CONSTRAINT cursos_materia_codigo_fkey FOREIGN KEY (materia_codigo) REFERENCES materias(codigo) ON DELETE SET NULL;

-- curso_estudiantes: estudiante_id → estudiante_ci
ALTER TABLE IF EXISTS curso_estudiantes ADD COLUMN IF NOT EXISTS estudiante_ci VARCHAR(20);
UPDATE curso_estudiantes ce SET estudiante_ci = u.ci FROM usuarios u WHERE ce.estudiante_id::text = u.ci;
ALTER TABLE IF EXISTS curso_estudiantes DROP COLUMN IF EXISTS estudiante_id;
ALTER TABLE IF EXISTS curso_estudiantes ALTER COLUMN estudiante_ci SET NOT NULL;
ALTER TABLE IF EXISTS curso_estudiantes ADD CONSTRAINT curso_estudiantes_estudiante_ci_fkey FOREIGN KEY (estudiante_ci) REFERENCES usuarios(ci) ON DELETE CASCADE;

-- calificaciones: estudiante_id → estudiante_ci
ALTER TABLE IF EXISTS calificaciones ADD COLUMN IF NOT EXISTS estudiante_ci VARCHAR(20);
UPDATE calificaciones c SET estudiante_ci = u.ci FROM usuarios u WHERE c.estudiante_id::text = u.ci;
ALTER TABLE IF EXISTS calificaciones DROP COLUMN IF EXISTS estudiante_id;
ALTER TABLE IF EXISTS calificaciones ALTER COLUMN estudiante_ci SET NOT NULL;
ALTER TABLE IF EXISTS calificaciones ADD CONSTRAINT calificaciones_estudiante_ci_fkey FOREIGN KEY (estudiante_ci) REFERENCES usuarios(ci) ON DELETE CASCADE;

-- materias_prerrequisito: materia_id → materia_codigo, prerrequisito_id → prerrequisito_codigo
ALTER TABLE IF EXISTS materias_prerrequisito ADD COLUMN IF NOT EXISTS materia_codigo VARCHAR(32);
ALTER TABLE IF EXISTS materias_prerrequisito ADD COLUMN IF NOT EXISTS prerrequisito_codigo VARCHAR(32);
UPDATE materias_prerrequisito mp SET materia_codigo = m.codigo FROM materias m WHERE mp.materia_id = m.id;
UPDATE materias_prerrequisito mp SET prerrequisito_codigo = m.codigo FROM materias m WHERE mp.prerrequisito_id = m.id;
ALTER TABLE IF EXISTS materias_prerrequisito DROP COLUMN IF EXISTS materia_id;
ALTER TABLE IF EXISTS materias_prerrequisito DROP COLUMN IF EXISTS prerrequisito_id;
ALTER TABLE IF EXISTS materias_prerrequisito ALTER COLUMN materia_codigo SET NOT NULL;
ALTER TABLE IF EXISTS materias_prerrequisito ALTER COLUMN prerrequisito_codigo SET NOT NULL;
ALTER TABLE IF EXISTS materias_prerrequisito ADD CONSTRAINT mp_materia_codigo_fkey FOREIGN KEY (materia_codigo) REFERENCES materias(codigo) ON DELETE CASCADE;
ALTER TABLE IF EXISTS materias_prerrequisito ADD CONSTRAINT mp_prerrequisito_codigo_fkey FOREIGN KEY (prerrequisito_codigo) REFERENCES materias(codigo) ON DELETE CASCADE;
ALTER TABLE IF EXISTS materias_prerrequisito DROP CONSTRAINT IF EXISTS materias_prerrequisito_pkey;
ALTER TABLE IF EXISTS materias_prerrequisito ADD PRIMARY KEY (materia_codigo, prerrequisito_codigo);

-- Índices actualizados
DROP INDEX IF EXISTS idx_cursos_docente;
DROP INDEX IF EXISTS idx_curso_estudiantes_estudiante;
DROP INDEX IF EXISTS idx_calificaciones_curso_estudiante;
CREATE INDEX IF NOT EXISTS idx_cursos_docente ON cursos (docente_ci, gestion, periodo);
CREATE INDEX IF NOT EXISTS idx_curso_estudiantes_estudiante ON curso_estudiantes (estudiante_ci, estado);
CREATE INDEX IF NOT EXISTS idx_calificaciones_curso_estudiante ON calificaciones (curso_id, estudiante_ci);

COMMIT;
