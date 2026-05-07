const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const reportsRouter = require('./routes/reports.routes');
const authRouter = require('./routes/auth.routes');
const cursosRouter = require('./routes/cursos.routes');
const usuariosRouter = require('./routes/usuarios.routes');
const dashboardRouter = require('./routes/dashboard.routes');
const carrerasRouter = require('./routes/carreras.routes');
const env = require('./config/env');

const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { message: 'Demasiadas solicitudes, intente de nuevo más tarde' },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { message: 'Demasiados intentos de inicio de sesión, intente de nuevo más tarde' },
});

app.use(
  cors({
    origin: env.corsOrigin,
  }),
);
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(limiter);
app.use('/api/auth/login', authLimiter);

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    module: 'sistema-academico',
  });
});

app.use('/api/auth', authRouter);
app.use('/api/usuarios', usuariosRouter);
app.use('/api/cursos', cursosRouter);
app.use('/api/reportes', reportsRouter);
app.use('/api/dashboard', dashboardRouter);
app.use('/api/carreras', carrerasRouter);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({
    message: 'Error interno del servidor.',
    detail: err.message,
  });
});

app.use((_req, res) => {
  res.status(404).json({ message: 'Ruta no encontrada' });
});

module.exports = app;
