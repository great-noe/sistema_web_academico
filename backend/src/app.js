const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const reportsRouter = require('./routes/reports.routes');
const authRouter = require('./routes/auth.routes');
const cursosRouter = require('./routes/cursos.routes');
const usuariosRouter = require('./routes/usuarios.routes');
const env = require('./config/env');

const app = express();

app.use(
  cors({
    origin: env.corsOrigin,
  }),
);
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({
    message: 'Se produjo un error al generar el reporte.',
    detail: err.message,
  });
});

module.exports = app;
