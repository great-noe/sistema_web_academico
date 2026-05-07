const { body, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: 'Datos inválidos', errors: errors.array() });
  }
  next();
};

const registerRules = [
  body('ci').trim().notEmpty().withMessage('El CI es obligatorio'),
  body('rol').isIn(['estudiante', 'docente', 'admin']).withMessage('Rol inválido'),
  body('nombres').trim().notEmpty().withMessage('El nombre es requerido'),
  body('apellidos').trim().notEmpty().withMessage('Los apellidos son requeridos'),
  body('email').isEmail().withMessage('Email inválido').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
  handleValidationErrors,
];

const loginRules = [
  body('email').notEmpty().withMessage('El usuario es requerido'),
  body('password').notEmpty().withMessage('La contraseña es requerida'),
  handleValidationErrors,
];

const updateProfileRules = [
  body('nombres').trim().notEmpty().withMessage('El nombre es requerido'),
  body('apellidos').trim().notEmpty().withMessage('Los apellidos son requeridos'),
  body('email').isEmail().withMessage('Email inválido').normalizeEmail(),
  handleValidationErrors,
];

const updatePasswordRules = [
  body('currentPassword').notEmpty().withMessage('La contraseña actual es requerida'),
  body('newPassword').isLength({ min: 6 }).withMessage('La nueva contraseña debe tener al menos 6 caracteres'),
  handleValidationErrors,
];

module.exports = { registerRules, loginRules, updateProfileRules, updatePasswordRules };