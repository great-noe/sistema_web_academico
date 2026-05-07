BEGIN;

INSERT INTO carreras (codigo, nombre, semestres, descripcion, es_boceto)
VALUES
  ('SIS', 'Ingenieria de Sistemas', 9, 'Plan referencial importado desde carreras.pdf', TRUE),
  ('MED', 'Medicina', 10, 'Plan referencial importado desde carreras.pdf', TRUE),
  ('CON', 'Contaduria Publica', 8, 'Plan referencial importado desde carreras.pdf', TRUE),
  ('ICO', 'Ingenieria Comercial', 8, 'Plan referencial importado desde carreras.pdf', TRUE),
  ('ADM', 'Administracion de Empresas', 8, 'Plan referencial importado desde carreras.pdf', TRUE),
  ('DER', 'Derecho', 8, 'Plan referencial importado desde carreras.pdf', TRUE),
  ('IND', 'Ingenieria Industrial', 9, 'Plan referencial importado desde carreras.pdf', TRUE),
  ('RED', 'Ingenieria en Redes y Telecomunicaciones', 9, 'Plan referencial importado desde carreras.pdf', TRUE),
  ('PET', 'Ingenieria en Gestion Petrolera', 9, 'Plan referencial importado desde carreras.pdf', TRUE)
ON CONFLICT (codigo) DO UPDATE
SET
  nombre = EXCLUDED.nombre,
  semestres = EXCLUDED.semestres,
  descripcion = EXCLUDED.descripcion,
  es_boceto = EXCLUDED.es_boceto;

CREATE TEMP TABLE seed_materias_raw (
  carrera_codigo VARCHAR(16) NOT NULL,
  semestre INTEGER NOT NULL,
  nombre VARCHAR(180) NOT NULL,
  area_nombre VARCHAR(150) NOT NULL,
  valor_referencial INTEGER NOT NULL,
  tipo_valor VARCHAR(4) NOT NULL,
  horas_teoricas INTEGER,
  horas_practicas INTEGER,
  fuente VARCHAR(80) NOT NULL
) ON COMMIT DROP;

COPY seed_materias_raw (
  carrera_codigo,
  semestre,
  nombre,
  area_nombre,
  valor_referencial,
  tipo_valor,
  horas_teoricas,
  horas_practicas,
  fuente
) FROM STDIN WITH (FORMAT text, DELIMITER E'\t', NULL '\N');
SIS	1	Metodologia de la Inv. Cientifica	Cs. Basicas	5	CR	\N	\N	carreras.pdf
SIS	1	Fundamentos de Matematicas	Cs. de la Ingenieria	5	CR	\N	\N	carreras.pdf
SIS	1	Ingles Tecnico I	Ingenieria Aplicada	5	CR	\N	\N	carreras.pdf
SIS	1	Programacion Basica	Cs. Complementarias	5	CR	\N	\N	carreras.pdf
SIS	1	Hardware, Software y Redes	Cs. Complementarias	5	CR	\N	\N	carreras.pdf
SIS	1	Estructuras Discretas	Innovacion Tecnologica	5	CR	\N	\N	carreras.pdf
SIS	2	Algebra Lineal	Cs. Basicas	6	CR	\N	\N	carreras.pdf
SIS	2	Calculo I	Cs. de la Ingenieria	6	CR	\N	\N	carreras.pdf
SIS	2	Fisica I	Ingenieria Aplicada	5	CR	\N	\N	carreras.pdf
SIS	2	Programacion I	Cs. Complementarias	6	CR	\N	\N	carreras.pdf
SIS	2	Sistemas Operativos I	Cs. Complementarias	6	CR	\N	\N	carreras.pdf
SIS	2	Etica y Ciudadania Global	Innovacion Tecnologica	5	CR	\N	\N	carreras.pdf
SIS	3	Estadistica Descriptiva	Cs. Basicas	5	CR	\N	\N	carreras.pdf
SIS	3	Calculo II	Cs. de la Ingenieria	6	CR	\N	\N	carreras.pdf
SIS	3	Gestion Financiera para TIC	Ingenieria Aplicada	6	CR	\N	\N	carreras.pdf
SIS	3	Programacion II	Cs. Complementarias	6	CR	\N	\N	carreras.pdf
SIS	3	Sistemas Operativos II	Cs. Complementarias	5	CR	\N	\N	carreras.pdf
SIS	3	Sistemas Digitales I	Innovacion Tecnologica	6	CR	\N	\N	carreras.pdf
SIS	4	Investigacion Operativa I	Cs. Basicas	6	CR	\N	\N	carreras.pdf
SIS	4	Redes I	Cs. de la Ingenieria	6	CR	\N	\N	carreras.pdf
SIS	4	Analisis Numerico	Ingenieria Aplicada	6	CR	\N	\N	carreras.pdf
SIS	4	Programacion III	Cs. Complementarias	6	CR	\N	\N	carreras.pdf
SIS	4	Base de Datos I	Cs. Complementarias	6	CR	\N	\N	carreras.pdf
SIS	4	Teoria de la Computacion	Innovacion Tecnologica	5	CR	\N	\N	carreras.pdf
SIS	5	Estadistica Inferencial	Cs. Basicas	5	CR	\N	\N	carreras.pdf
SIS	5	Redes II	Cs. de la Ingenieria	6	CR	\N	\N	carreras.pdf
SIS	5	Estructuras de Datos	Ingenieria Aplicada	6	CR	\N	\N	carreras.pdf
SIS	5	Desarrollo Web I	Cs. Complementarias	6	CR	\N	\N	carreras.pdf
SIS	5	Base de Datos II	Cs. Complementarias	6	CR	\N	\N	carreras.pdf
SIS	5	Sistemas de Informacion I	Innovacion Tecnologica	6	CR	\N	\N	carreras.pdf
SIS	6	Machine Learning	Cs. Basicas	6	CR	\N	\N	carreras.pdf
SIS	6	Desarrollo de Sistemas I	Cs. de la Ingenieria	6	CR	\N	\N	carreras.pdf
SIS	6	Desarrollo Web II	Ingenieria Aplicada	6	CR	\N	\N	carreras.pdf
SIS	6	Administracion de Base de Datos	Cs. Complementarias	6	CR	\N	\N	carreras.pdf
SIS	6	Sistemas de Informacion II	Innovacion Tecnologica	6	CR	\N	\N	carreras.pdf
SIS	6	Emprendedurismo e Innovacion	Innovacion Tecnologica	6	CR	\N	\N	carreras.pdf
SIS	7	Deep Learning	Cs. Basicas	6	CR	\N	\N	carreras.pdf
SIS	7	Desarrollo de Sistemas II	Cs. de la Ingenieria	6	CR	\N	\N	carreras.pdf
SIS	7	Aplicaciones Moviles	Ingenieria Aplicada	6	CR	\N	\N	carreras.pdf
SIS	7	Seguridad Informatica	Cs. Complementarias	6	CR	\N	\N	carreras.pdf
SIS	7	Gerenciamiento TIC	Innovacion Tecnologica	6	CR	\N	\N	carreras.pdf
SIS	7	Electiva 1	Cs. Complementarias	4	CR	\N	\N	carreras.pdf
SIS	8	Vision Computacional	Cs. Basicas	6	CR	\N	\N	carreras.pdf
SIS	8	Auditoria de Sistemas	Cs. de la Ingenieria	6	CR	\N	\N	carreras.pdf
SIS	8	Administracion de Servidores	Ingenieria Aplicada	6	CR	\N	\N	carreras.pdf
SIS	8	Servicios de Infraestructura Nube	Cs. Complementarias	6	CR	\N	\N	carreras.pdf
SIS	8	Direccion de Proyectos	Innovacion Tecnologica	6	CR	\N	\N	carreras.pdf
SIS	8	Electiva 2	Innovacion Tecnologica	4	CR	\N	\N	carreras.pdf
SIS	9	Inteligencia de Negocios	Cs. Basicas	6	CR	\N	\N	carreras.pdf
SIS	9	Calidad de Software	Cs. de la Ingenieria	6	CR	\N	\N	carreras.pdf
SIS	9	DevOps	Ingenieria Aplicada	6	CR	\N	\N	carreras.pdf
SIS	9	Tecnologia de Base de Datos	Cs. Complementarias	6	CR	\N	\N	carreras.pdf
SIS	9	Internet de las Cosas	Innovacion Tecnologica	6	CR	\N	\N	carreras.pdf
SIS	9	Negocios Electronicos	Cs. Complementarias	6	CR	\N	\N	carreras.pdf
MED	1	Anatomia Humana I	Biomedicas	200	TH	\N	\N	carreras.pdf
MED	1	Embriologia y Genetica I	Biomedicas	100	TH	\N	\N	carreras.pdf
MED	1	Biofisica	Biomedicas	100	TH	\N	\N	carreras.pdf
MED	1	Bioquimica	Biomedicas	100	TH	\N	\N	carreras.pdf
MED	1	Matematicas	Biomedicas	80	TH	\N	\N	carreras.pdf
MED	1	Comunicacion y Redaccion	Biomedicas	80	TH	\N	\N	carreras.pdf
MED	2	Anatomia Humana II	Biomedicas	200	TH	\N	\N	carreras.pdf
MED	2	Embriologia y Genetica II	Biomedicas	100	TH	\N	\N	carreras.pdf
MED	2	Microbiologia	Biomedicas	100	TH	\N	\N	carreras.pdf
MED	2	Histologia	Biomedicas	100	TH	\N	\N	carreras.pdf
MED	2	Salud Publica I	Salud Publica	100	TH	\N	\N	carreras.pdf
MED	2	Taller de Primeros Auxilios	Biomedicas	80	TH	\N	\N	carreras.pdf
MED	3	Fisiologia	Biomedicas	200	TH	\N	\N	carreras.pdf
MED	3	Parasitologia	Biomedicas	100	TH	\N	\N	carreras.pdf
MED	3	Salud Publica II	Salud Publica	100	TH	\N	\N	carreras.pdf
MED	3	Neuroanatomia	Biomedicas	100	TH	\N	\N	carreras.pdf
MED	3	Bioetica	Salud Publica	80	TH	\N	\N	carreras.pdf
MED	4	Fisiopatologia	Biomedicas	200	TH	\N	\N	carreras.pdf
MED	4	Mecanismo de la Enfermedad	Biomedicas	100	TH	\N	\N	carreras.pdf
MED	4	Salud Publica III	Salud Publica	100	TH	\N	\N	carreras.pdf
MED	4	Inmunologia	Biomedicas	100	TH	\N	\N	carreras.pdf
MED	4	Psicologia Medica	Salud Publica	80	TH	\N	\N	carreras.pdf
MED	5	Semiologia I	Clinica	200	TH	\N	\N	carreras.pdf
MED	5	Farmacologia I	Clinica	100	TH	\N	\N	carreras.pdf
MED	5	Patologia General	Biomedicas	100	TH	\N	\N	carreras.pdf
MED	5	Imagenologia I	Clinica	100	TH	\N	\N	carreras.pdf
MED	6	Semiologia II	Clinica	200	TH	\N	\N	carreras.pdf
MED	6	Farmacologia II	Clinica	100	TH	\N	\N	carreras.pdf
MED	6	Patologia Especial	Clinica	100	TH	\N	\N	carreras.pdf
MED	6	Imagenologia II	Clinica	100	TH	\N	\N	carreras.pdf
MED	7	Medicina Interna I	Clinica	300	TH	\N	\N	carreras.pdf
MED	7	Cirugia I	Cirugia	200	TH	\N	\N	carreras.pdf
MED	7	Medicina Legal	Clinica	80	TH	\N	\N	carreras.pdf
MED	8	Medicina Interna II	Clinica	300	TH	\N	\N	carreras.pdf
MED	8	Cirugia II	Cirugia	200	TH	\N	\N	carreras.pdf
MED	8	Ginecologia y Obstetricia I	Especialidades	150	TH	\N	\N	carreras.pdf
MED	9	Pediatria	Especialidades	200	TH	\N	\N	carreras.pdf
MED	9	Ginecologia y Obstetricia II	Especialidades	150	TH	\N	\N	carreras.pdf
MED	9	Psiquiatria	Clinica	100	TH	\N	\N	carreras.pdf
MED	10	Internado Rotatorio I	Practica	800	TH	\N	\N	carreras.pdf
CON	1	Administracion I	Contabilidad y Normativa	5	CR	\N	\N	carreras.pdf
CON	1	Matematica Aplicada	Gestion Financiera	6	CR	\N	\N	carreras.pdf
CON	1	Metodologia de la Inv. Cientifica	TIC y Analitica	5	CR	\N	\N	carreras.pdf
CON	1	Liderazgo y Comunicacion	Auditoria y Control	5	CR	\N	\N	carreras.pdf
CON	1	Introduccion a la Economia	Auditoria y Control	5	CR	\N	\N	carreras.pdf
CON	1	Contabilidad Empresarial I	Contabilidad y Normativa	6	CR	\N	\N	carreras.pdf
CON	2	Administracion II	Contabilidad y Normativa	5	CR	\N	\N	carreras.pdf
CON	2	Calculo I	Gestion Financiera	6	CR	\N	\N	carreras.pdf
CON	2	Estadistica Descriptiva	TIC y Analitica	5	CR	\N	\N	carreras.pdf
CON	2	Microeconomia I	Auditoria y Control	5	CR	\N	\N	carreras.pdf
CON	2	Contabilidad Empresarial II	Contabilidad y Normativa	6	CR	\N	\N	carreras.pdf
CON	2	Etica y Ciudadania Global	TIC y Analitica	5	CR	\N	\N	carreras.pdf
CON	3	Estadistica Inferencial	TIC y Analitica	5	CR	\N	\N	carreras.pdf
CON	3	Macroeconomia	Auditoria y Control	5	CR	\N	\N	carreras.pdf
CON	3	Derecho Societario	Contabilidad y Normativa	5	CR	\N	\N	carreras.pdf
CON	3	Matematica Financiera	Gestion Financiera	5	CR	\N	\N	carreras.pdf
CON	3	Informatica Aplicada con IA	TIC y Analitica	6	CR	\N	\N	carreras.pdf
CON	3	Contabilidad Empresarial III	Contabilidad y Normativa	6	CR	\N	\N	carreras.pdf
CON	4	Finanzas Corporativas I	Gestion Financiera	6	CR	\N	\N	carreras.pdf
CON	4	Tributacion Aplicada I	Contabilidad y Normativa	5	CR	\N	\N	carreras.pdf
CON	4	Contabilidad de Costos I	Contabilidad y Normativa	6	CR	\N	\N	carreras.pdf
CON	4	Contabilidad Internacional	Contabilidad y Normativa	5	CR	\N	\N	carreras.pdf
CON	4	Analisis de Datos con IA	TIC y Analitica	5	CR	\N	\N	carreras.pdf
CON	4	Contabilidad Empresarial IV	Contabilidad y Normativa	6	CR	\N	\N	carreras.pdf
CON	5	Finanzas Corporativas II	Gestion Financiera	6	CR	\N	\N	carreras.pdf
CON	5	Tributacion Aplicada II	Contabilidad y Normativa	5	CR	\N	\N	carreras.pdf
CON	5	Contabilidad de Costos II	Contabilidad y Normativa	6	CR	\N	\N	carreras.pdf
CON	5	Contabilidad de Sociedades	Contabilidad y Normativa	5	CR	\N	\N	carreras.pdf
CON	5	Contabilidad de Servicios	Contabilidad y Normativa	5	CR	\N	\N	carreras.pdf
CON	5	Contabilidad Bancaria	Contabilidad y Normativa	5	CR	\N	\N	carreras.pdf
CON	6	Presupuesto y Planificacion	Gestion Financiera	5	CR	\N	\N	carreras.pdf
CON	6	Contabilidad Extractiva	Contabilidad y Normativa	5	CR	\N	\N	carreras.pdf
CON	6	Contabilidad Agropecuaria	Contabilidad y Normativa	5	CR	\N	\N	carreras.pdf
CON	6	Taller de Gestion Contable	Contabilidad y Normativa	7	CR	\N	\N	carreras.pdf
CON	6	Contabilidad Integrada	Contabilidad y Normativa	5	CR	\N	\N	carreras.pdf
CON	6	Auditoria Financiera I	Auditoria y Control	6	CR	\N	\N	carreras.pdf
CON	7	Auditoria Financiera II	Auditoria y Control	6	CR	\N	\N	carreras.pdf
CON	7	Auditoria de Sistemas	Auditoria y Control	5	CR	\N	\N	carreras.pdf
CON	7	Preparacion y Eval. Proyectos	Gestion Financiera	7	CR	\N	\N	carreras.pdf
CON	7	Auditoria Tributaria y Fiscal	Auditoria y Control	6	CR	\N	\N	carreras.pdf
CON	7	Taller de Auditoria Financiera	Auditoria y Control	7	CR	\N	\N	carreras.pdf
CON	7	Electiva 1	Especializacion	4	CR	\N	\N	carreras.pdf
CON	8	Auditoria Gubernamental	Auditoria y Control	5	CR	\N	\N	carreras.pdf
CON	8	Tributacion Especializada	Contabilidad y Normativa	5	CR	\N	\N	carreras.pdf
CON	8	Auditoria Operativa	Auditoria y Control	5	CR	\N	\N	carreras.pdf
CON	8	Gestion Estrategica	Gestion Financiera	6	CR	\N	\N	carreras.pdf
CON	8	Electiva 2	Especializacion	4	CR	\N	\N	carreras.pdf
CON	8	Taller de Grado	Auditoria y Control	7	CR	\N	\N	carreras.pdf
ICO	1	Metodologia de la Investigacion	Gestion Estrategica	5	CR	\N	\N	carreras.pdf
ICO	1	Administracion I	Marketing	5	CR	\N	\N	carreras.pdf
ICO	1	Liderazgo y Comunicacion	Gestion Economica	5	CR	\N	\N	carreras.pdf
ICO	1	Matematica Aplicada	Negocios Digitales	6	CR	\N	\N	carreras.pdf
ICO	1	Introduccion a la Economia	Gestion Economica	5	CR	\N	\N	carreras.pdf
ICO	1	Contabilidad Empresarial I	Gestion Financiera	5	CR	\N	\N	carreras.pdf
ICO	2	Etica y Ciudadania Global	Gestion Estrategica	5	CR	\N	\N	carreras.pdf
ICO	2	Administracion II	Marketing	5	CR	\N	\N	carreras.pdf
ICO	2	Fundamentos de Marketing	Marketing	5	CR	\N	\N	carreras.pdf
ICO	2	Calculo I	Gestion Economica	6	CR	\N	\N	carreras.pdf
ICO	2	Estadistica Descriptiva	Gestion Economica	5	CR	\N	\N	carreras.pdf
ICO	2	Contabilidad Empresarial II	Gestion Financiera	6	CR	\N	\N	carreras.pdf
ICO	3	Estadistica Inferencial	Gestion Economica	5	CR	\N	\N	carreras.pdf
ICO	3	Microeconomia I	Gestion Economica	5	CR	\N	\N	carreras.pdf
ICO	3	Investigacion de Mercados I	Marketing	6	CR	\N	\N	carreras.pdf
ICO	3	Matematica Financiera	Gestion Financiera	5	CR	\N	\N	carreras.pdf
ICO	3	Contabilidad de Costos I	Gestion Financiera	6	CR	\N	\N	carreras.pdf
ICO	3	Marketing Operativo	Marketing	6	CR	\N	\N	carreras.pdf
ICO	4	Macroeconomia	Gestion Economica	5	CR	\N	\N	carreras.pdf
ICO	4	Investigacion de Mercados II	Marketing	6	CR	\N	\N	carreras.pdf
ICO	4	Marketing y Analisis Digital	Marketing	6	CR	\N	\N	carreras.pdf
ICO	4	Finanzas Corporativas I	Gestion Financiera	6	CR	\N	\N	carreras.pdf
ICO	4	Gerencia de Ventas	Marketing	5	CR	\N	\N	carreras.pdf
ICO	4	Analisis de Datos Estrategicos	Negocios Digitales	6	CR	\N	\N	carreras.pdf
ICO	5	Finanzas Corporativas II	Gestion Financiera	6	CR	\N	\N	carreras.pdf
ICO	5	Marketing Estrategico	Marketing	6	CR	\N	\N	carreras.pdf
ICO	5	Econometria	Gestion Economica	6	CR	\N	\N	carreras.pdf
ICO	5	Comercio Internacional	Gestion Economica	5	CR	\N	\N	carreras.pdf
ICO	5	Gestion del Talento Humano	Gestion Estrategica	5	CR	\N	\N	carreras.pdf
ICO	5	Marketing Digital	Marketing	6	CR	\N	\N	carreras.pdf
ICO	6	Design Thinking	Negocios Digitales	5	CR	\N	\N	carreras.pdf
ICO	6	Trading y Mercados Digitales	Negocios Digitales	5	CR	\N	\N	carreras.pdf
ICO	6	Gestion de la Calidad	Gestion Estrategica	6	CR	\N	\N	carreras.pdf
ICO	6	Marketing Internacional	Marketing	5	CR	\N	\N	carreras.pdf
ICO	6	Responsabilidad Social Emp.	Gestion Estrategica	5	CR	\N	\N	carreras.pdf
ICO	6	Electiva 1	Gestion Estrategica	4	CR	\N	\N	carreras.pdf
ICO	7	Prep. y Evaluacion de Proyectos	Gestion Financiera	7	CR	\N	\N	carreras.pdf
ICO	7	Gestion Cadena Suministros	Gestion Estrategica	7	CR	\N	\N	carreras.pdf
ICO	7	Emprendedurismo e Innovacion	Negocios Digitales	6	CR	\N	\N	carreras.pdf
ICO	7	Modelos Negocios Sostenibles	Gestion Estrategica	6	CR	\N	\N	carreras.pdf
ICO	7	Gerencia Estrategica	Gestion Estrategica	6	CR	\N	\N	carreras.pdf
ICO	7	Electiva 2	Gestion Estrategica	4	CR	\N	\N	carreras.pdf
ICO	8	Gerencia de Proyectos	Gestion Estrategica	7	CR	\N	\N	carreras.pdf
ICO	8	Simulacion Empresarial Digital	Negocios Digitales	5	CR	\N	\N	carreras.pdf
ICO	8	Comunicacion y Redaccion Pub.	Marketing	6	CR	\N	\N	carreras.pdf
ICO	8	Taller de Grado	Gestion Estrategica	7	CR	\N	\N	carreras.pdf
ICO	8	Electiva 3	Gestion Estrategica	4	CR	\N	\N	carreras.pdf
ADM	1	Metodologia de la Investigacion	Gestion Empresarial	5	CR	\N	\N	carreras.pdf
ADM	1	Administracion I	Gestion Empresarial	5	CR	\N	\N	carreras.pdf
ADM	1	Liderazgo y Comunicacion	Gestion Empresarial	5	CR	\N	\N	carreras.pdf
ADM	1	Matematica Aplicada	Gestion Contable	6	CR	\N	\N	carreras.pdf
ADM	1	Introduccion a la Economia	Negocios y Proyectos	5	CR	\N	\N	carreras.pdf
ADM	1	Contabilidad Empresarial I	Gestion Contable	5	CR	\N	\N	carreras.pdf
ADM	2	Etica y Ciudadania Global	Gestion Empresarial	5	CR	\N	\N	carreras.pdf
ADM	2	Administracion II	Gestion Empresarial	5	CR	\N	\N	carreras.pdf
ADM	2	Diseno Organizacional	Talento Humano	5	CR	\N	\N	carreras.pdf
ADM	2	Calculo I	Gestion Contable	6	CR	\N	\N	carreras.pdf
ADM	2	Estadistica Descriptiva	Negocios y Proyectos	5	CR	\N	\N	carreras.pdf
ADM	2	Contabilidad Empresarial II	Gestion Contable	6	CR	\N	\N	carreras.pdf
ADM	3	Estadistica Inferencial	Negocios y Proyectos	5	CR	\N	\N	carreras.pdf
ADM	3	Microeconomia I	Negocios y Proyectos	5	CR	\N	\N	carreras.pdf
ADM	3	Investigacion de Mercados I	Negocios y Proyectos	6	CR	\N	\N	carreras.pdf
ADM	3	Matematica Financiera	Gestion Contable	5	CR	\N	\N	carreras.pdf
ADM	3	Contabilidad de Costos I	Gestion Contable	6	CR	\N	\N	carreras.pdf
ADM	3	Gestion del Talento Humano I	Talento Humano	5	CR	\N	\N	carreras.pdf
ADM	4	Macroeconomia	Negocios y Proyectos	5	CR	\N	\N	carreras.pdf
ADM	4	Investigacion de Mercados II	Negocios y Proyectos	6	CR	\N	\N	carreras.pdf
ADM	4	Finanzas Corporativas I	Gestion Contable	6	CR	\N	\N	carreras.pdf
ADM	4	Derecho Societario	Negocios y Proyectos	5	CR	\N	\N	carreras.pdf
ADM	4	Presupuesto y Planificacion	Gestion Contable	5	CR	\N	\N	carreras.pdf
ADM	4	Gestion del Talento Humano II	Talento Humano	5	CR	\N	\N	carreras.pdf
ADM	5	Finanzas Corporativas II	Gestion Contable	6	CR	\N	\N	carreras.pdf
ADM	5	Tributacion Aplicada I	Gestion Contable	5	CR	\N	\N	carreras.pdf
ADM	5	Mercado de Valores	Gestion Contable	6	CR	\N	\N	carreras.pdf
ADM	5	Marketing y Comercializacion	Negocios y Proyectos	6	CR	\N	\N	carreras.pdf
ADM	5	Inteligencia de Negocios	Negocios y Proyectos	6	CR	\N	\N	carreras.pdf
ADM	5	Gestion de la Calidad	Gestion Empresarial	6	CR	\N	\N	carreras.pdf
ADM	6	Administracion Publica I	Gestion Empresarial	5	CR	\N	\N	carreras.pdf
ADM	6	Negociacion y Resolucion Conf.	Talento Humano	5	CR	\N	\N	carreras.pdf
ADM	6	Responsabilidad Social Emp.	Gestion Empresarial	5	CR	\N	\N	carreras.pdf
ADM	6	Comportamiento Organizacional	Talento Humano	5	CR	\N	\N	carreras.pdf
ADM	6	Electiva 1	Negocios y Proyectos	4	CR	\N	\N	carreras.pdf
ADM	7	Prep. y Evaluacion de Proyectos	Negocios y Proyectos	7	CR	\N	\N	carreras.pdf
ADM	7	Gerencia Estrategica	Gestion Empresarial	6	CR	\N	\N	carreras.pdf
ADM	7	Emprendedurismo e Innovacion	Negocios y Proyectos	6	CR	\N	\N	carreras.pdf
ADM	7	Administracion Publica II	Gestion Empresarial	5	CR	\N	\N	carreras.pdf
ADM	7	Electiva 2	Negocios y Proyectos	4	CR	\N	\N	carreras.pdf
ADM	8	Gerencia de Proyectos	Negocios y Proyectos	7	CR	\N	\N	carreras.pdf
ADM	8	Gestion de Incubacion Startups	Negocios y Proyectos	6	CR	\N	\N	carreras.pdf
ADM	8	Taller de Grado	Negocios y Proyectos	7	CR	\N	\N	carreras.pdf
ADM	8	Electiva 3	Negocios y Proyectos	4	CR	\N	\N	carreras.pdf
DER	1	Metodologia de la Investigacion	Justicia Restaurativa	5	CR	\N	\N	carreras.pdf
DER	1	Teoria General del Derecho	Litigacion	5	CR	\N	\N	carreras.pdf
DER	1	Derecho Civil I	Interpretacion	5	CR	\N	\N	carreras.pdf
DER	1	Oratoria Juridica	Pluralismo Juridico	5	CR	\N	\N	carreras.pdf
DER	1	Criminologia y Cs. Forenses	Justicia Restaurativa	5	CR	\N	\N	carreras.pdf
DER	1	Derechos Humanos	Derecho Ecologico	5	CR	\N	\N	carreras.pdf
DER	2	Etica y Ciudadania Global	Justicia Restaurativa	5	CR	\N	\N	carreras.pdf
DER	2	Derecho Civil II	Interpretacion	5	CR	\N	\N	carreras.pdf
DER	2	Derecho Constitucional I	Litigacion	5	CR	\N	\N	carreras.pdf
DER	2	Interpretacion y Arg. Juridica	Interpretacion	5	CR	\N	\N	carreras.pdf
DER	2	Derecho Penal I	Litigacion	5	CR	\N	\N	carreras.pdf
DER	2	Derecho Romano	Pluralismo Juridico	5	CR	\N	\N	carreras.pdf
DER	3	Derecho Civil III	Interpretacion	5	CR	\N	\N	carreras.pdf
DER	3	Derecho Constitucional II	Litigacion	5	CR	\N	\N	carreras.pdf
DER	3	Derecho Penal II	Litigacion	5	CR	\N	\N	carreras.pdf
DER	3	Derecho Administrativo I	Pluralismo Juridico	5	CR	\N	\N	carreras.pdf
DER	3	LegalTech I	Derecho Digital	5	CR	\N	\N	carreras.pdf
DER	3	Sociologia Juridica	Pluralismo Juridico	5	CR	\N	\N	carreras.pdf
DER	4	Derecho Civil IV	Interpretacion	5	CR	\N	\N	carreras.pdf
DER	4	Derecho Administrativo II	Pluralismo Juridico	5	CR	\N	\N	carreras.pdf
DER	4	Derecho Procesal Org. Judicial	Litigacion	5	CR	\N	\N	carreras.pdf
DER	4	Derecho Internacional Publico	Pluralismo Juridico	5	CR	\N	\N	carreras.pdf
DER	4	LegalTech II	Derecho Digital	5	CR	\N	\N	carreras.pdf
DER	4	Redaccion Juridica	Pluralismo Juridico	5	CR	\N	\N	carreras.pdf
DER	5	Derecho Civil V	Interpretacion	5	CR	\N	\N	carreras.pdf
DER	5	Derecho de Familia	Pluralismo Juridico	5	CR	\N	\N	carreras.pdf
DER	5	Derecho Procesal Civil I	Litigacion	5	CR	\N	\N	carreras.pdf
DER	5	Derecho Procesal Penal	Litigacion	5	CR	\N	\N	carreras.pdf
DER	5	Derecho Laboral	Pluralismo Juridico	5	CR	\N	\N	carreras.pdf
DER	5	Derecho Ecologico	Derecho Ecologico	5	CR	\N	\N	carreras.pdf
DER	6	Derecho Procesal Civil II	Litigacion	5	CR	\N	\N	carreras.pdf
DER	6	Practica Forense Penal	Litigacion	5	CR	\N	\N	carreras.pdf
DER	6	Derecho Societario	Pluralismo Juridico	5	CR	\N	\N	carreras.pdf
DER	6	Derecho Autonomico	Pluralismo Juridico	5	CR	\N	\N	carreras.pdf
DER	6	Justicia Restaurativa	Justicia Restaurativa	5	CR	\N	\N	carreras.pdf
DER	6	Derecho Agroambiental	Derecho Ecologico	5	CR	\N	\N	carreras.pdf
DER	7	Derecho Tributario	Pluralismo Juridico	5	CR	\N	\N	carreras.pdf
DER	7	Derecho Notarial	Pluralismo Juridico	5	CR	\N	\N	carreras.pdf
DER	7	Litigacion Estrategica	Litigacion	5	CR	\N	\N	carreras.pdf
DER	7	Medicina Legal	Justicia Restaurativa	5	CR	\N	\N	carreras.pdf
DER	7	Taller de Grado I	Litigacion	7	CR	\N	\N	carreras.pdf
DER	7	Electiva 1	Especializacion	4	CR	\N	\N	carreras.pdf
DER	8	Derecho Internacional Privado	Pluralismo Juridico	5	CR	\N	\N	carreras.pdf
DER	8	Conciliacion y Arbitraje	Justicia Restaurativa	5	CR	\N	\N	carreras.pdf
DER	8	Filosofia del Derecho	Pluralismo Juridico	5	CR	\N	\N	carreras.pdf
DER	8	Taller de Grado II	Litigacion	7	CR	\N	\N	carreras.pdf
DER	8	Electiva 2	Especializacion	4	CR	\N	\N	carreras.pdf
IND	1	Fundamentos de Matematicas	Cs. Basicas	5	CR	\N	\N	carreras.pdf
IND	1	Quimica General	Ingenieria Aplicada	5	CR	\N	\N	carreras.pdf
IND	1	Fisica I	Innovacion Tecnologica	5	CR	\N	\N	carreras.pdf
IND	1	Metodologia de la Investigacion	Cs. Basicas	5	CR	\N	\N	carreras.pdf
IND	1	Programacion Basica	Innovacion Tecnologica	5	CR	\N	\N	carreras.pdf
IND	1	Ingles Tecnico I	Cs. de la Ingenieria	5	CR	\N	\N	carreras.pdf
IND	2	Algebra Lineal	Cs. Basicas	6	CR	\N	\N	carreras.pdf
IND	2	Calculo I	Cs. Basicas	6	CR	\N	\N	carreras.pdf
IND	2	Fisica II	Innovacion Tecnologica	5	CR	\N	\N	carreras.pdf
IND	2	Quimica Organica	Ingenieria Aplicada	6	CR	\N	\N	carreras.pdf
IND	2	Dibujo Computarizado	Innovacion Tecnologica	5	CR	\N	\N	carreras.pdf
IND	2	Etica y Ciudadania Global	Cs. de la Ingenieria	5	CR	\N	\N	carreras.pdf
IND	3	Calculo II	Cs. Basicas	6	CR	\N	\N	carreras.pdf
IND	3	Termodinamica	Innovacion Tecnologica	6	CR	\N	\N	carreras.pdf
IND	3	Estadistica Descriptiva	Cs. Basicas	5	CR	\N	\N	carreras.pdf
IND	3	Contabilidad Empresarial I	Ingenieria Aplicada	5	CR	\N	\N	carreras.pdf
IND	3	Introduccion a la Economia	Ingenieria Aplicada	5	CR	\N	\N	carreras.pdf
IND	3	Electrotecnia Industrial	Innovacion Tecnologica	6	CR	\N	\N	carreras.pdf
IND	4	Dinamica de Fluidos	Innovacion Tecnologica	6	CR	\N	\N	carreras.pdf
IND	4	Operaciones Unitarias I	Innovacion Tecnologica	6	CR	\N	\N	carreras.pdf
IND	4	Investigacion Operativa I	Cs. Basicas	6	CR	\N	\N	carreras.pdf
IND	4	Estadistica Inferencial	Cs. Basicas	5	CR	\N	\N	carreras.pdf
IND	4	Contabilidad de Costos I	Ingenieria Aplicada	6	CR	\N	\N	carreras.pdf
IND	4	Gestion del Talento Humano	Cs. de la Ingenieria	5	CR	\N	\N	carreras.pdf
IND	5	Operaciones Unitarias II	Innovacion Tecnologica	6	CR	\N	\N	carreras.pdf
IND	5	Investigacion Operativa II	Cs. Basicas	6	CR	\N	\N	carreras.pdf
IND	5	Procesos Industriales I	Innovacion Tecnologica	6	CR	\N	\N	carreras.pdf
IND	5	Control Estadistico de Calidad	Cs. Basicas	6	CR	\N	\N	carreras.pdf
IND	5	Ingenieria de Metodos	Innovacion Tecnologica	6	CR	\N	\N	carreras.pdf
IND	6	Procesos Industriales II	Innovacion Tecnologica	6	CR	\N	\N	carreras.pdf
IND	6	Gestion de la Calidad	Cs. de la Ingenieria	6	CR	\N	\N	carreras.pdf
IND	6	Produccion y Manufactura I	Innovacion Tecnologica	5	CR	\N	\N	carreras.pdf
IND	6	Gestion del Mantenimiento	Innovacion Tecnologica	6	CR	\N	\N	carreras.pdf
IND	6	Investigacion de Mercados I	Ingenieria Aplicada	6	CR	\N	\N	carreras.pdf
IND	7	IA para la Innovacion	Innovacion Tecnologica	6	CR	\N	\N	carreras.pdf
IND	7	Produccion y Manufactura II	Innovacion Tecnologica	5	CR	\N	\N	carreras.pdf
IND	7	Seguridad e Higiene Industrial	Innovacion Tecnologica	5	CR	\N	\N	carreras.pdf
IND	7	Automatizacion Industrial	Innovacion Tecnologica	6	CR	\N	\N	carreras.pdf
IND	7	Ingenieria Financiera	Ingenieria Aplicada	5	CR	\N	\N	carreras.pdf
IND	7	Electiva 1	Innovacion Tecnologica	4	CR	\N	\N	carreras.pdf
IND	8	IA y Robotica	Innovacion Tecnologica	6	CR	\N	\N	carreras.pdf
IND	8	Gerencia Estrategica	Cs. de la Ingenieria	6	CR	\N	\N	carreras.pdf
IND	8	Gestion de Datos	Innovacion Tecnologica	6	CR	\N	\N	carreras.pdf
IND	8	Marketing Digital	Ingenieria Aplicada	6	CR	\N	\N	carreras.pdf
IND	8	Prep. y Evaluacion de Proyectos	Ingenieria Aplicada	7	CR	\N	\N	carreras.pdf
IND	8	Electiva 2	Innovacion Tecnologica	4	CR	\N	\N	carreras.pdf
IND	9	Gerencia de Proyectos	Cs. de la Ingenieria	7	CR	\N	\N	carreras.pdf
IND	9	Instalaciones Industriales	Innovacion Tecnologica	6	CR	\N	\N	carreras.pdf
IND	9	Gestion Ambiental	Innovacion Tecnologica	5	CR	\N	\N	carreras.pdf
IND	9	Electiva 3	Innovacion Tecnologica	4	CR	\N	\N	carreras.pdf
RED	1	Programacion Basica	Cs. de la Ingenieria	5	CR	\N	\N	carreras.pdf
RED	1	Hardware, Software y Redes	Cs. Complementarias	5	CR	\N	\N	carreras.pdf
RED	1	Metodologia de la Investigacion	Cs. Basicas	5	CR	\N	\N	carreras.pdf
RED	1	Fundamentos de Matematicas	Cs. Basicas	5	CR	\N	\N	carreras.pdf
RED	1	Ingles Tecnico I	Cs. Complementarias	5	CR	\N	\N	carreras.pdf
RED	1	Estructuras Discretas	Cs. Complementarias	5	CR	\N	\N	carreras.pdf
RED	2	Programacion I	Cs. de la Ingenieria	6	CR	\N	\N	carreras.pdf
RED	2	Sistemas Operativos I	Cs. Complementarias	6	CR	\N	\N	carreras.pdf
RED	2	Calculo I	Cs. Basicas	6	CR	\N	\N	carreras.pdf
RED	2	Algebra Lineal	Cs. Basicas	6	CR	\N	\N	carreras.pdf
RED	2	Fisica I	Cs. Basicas	5	CR	\N	\N	carreras.pdf
RED	2	Etica y Ciudadania Global	Cs. Complementarias	5	CR	\N	\N	carreras.pdf
RED	3	Programacion II	Cs. de la Ingenieria	6	CR	\N	\N	carreras.pdf
RED	3	Sistemas Operativos II	Cs. Complementarias	5	CR	\N	\N	carreras.pdf
RED	3	Redes I	Ingenieria Aplicada	6	CR	\N	\N	carreras.pdf
RED	3	Estadistica Descriptiva	Cs. Basicas	5	CR	\N	\N	carreras.pdf
RED	3	Sistemas Digitales I	Cs. Basicas	6	CR	\N	\N	carreras.pdf
RED	3	Fundamentos de Telecom	Ingenieria Aplicada	6	CR	\N	\N	carreras.pdf
RED	4	Base de Datos I	Cs. de la Ingenieria	6	CR	\N	\N	carreras.pdf
RED	4	Redes II	Ingenieria Aplicada	6	CR	\N	\N	carreras.pdf
RED	4	Redaccion Cientifica	Cs. Basicas	5	CR	\N	\N	carreras.pdf
RED	4	Criptografia Aplicada	Ciberseguridad	6	CR	\N	\N	carreras.pdf
RED	4	Antenas y Propagacion	Ingenieria Aplicada	6	CR	\N	\N	carreras.pdf
RED	4	Fundamentos de Seguridad Info	Ciberseguridad	6	CR	\N	\N	carreras.pdf
RED	5	Programacion Web	Cs. de la Ingenieria	6	CR	\N	\N	carreras.pdf
RED	5	Redes III	Ingenieria Aplicada	6	CR	\N	\N	carreras.pdf
RED	5	Hacking Etico	Ciberseguridad	6	CR	\N	\N	carreras.pdf
RED	5	Sistemas IoT Esenciales	IoT y Nube	6	CR	\N	\N	carreras.pdf
RED	5	Protocolos IP Multimedia	Ingenieria Aplicada	6	CR	\N	\N	carreras.pdf
RED	5	Pentesting	Ciberseguridad	6	CR	\N	\N	carreras.pdf
RED	6	Seguridad de Redes	Ciberseguridad	6	CR	\N	\N	carreras.pdf
RED	6	Emprendedurismo e Innovacion	Ingenieria Aplicada	6	CR	\N	\N	carreras.pdf
RED	6	Redes Definidas por Software	Ingenieria Aplicada	6	CR	\N	\N	carreras.pdf
RED	6	Programacion IoT y Datos	IoT y Nube	6	CR	\N	\N	carreras.pdf
RED	6	Fundamentos de Cloud	IoT y Nube	6	CR	\N	\N	carreras.pdf
RED	6	Seguridad Cloud	IoT y Nube	6	CR	\N	\N	carreras.pdf
RED	7	Administracion de Servidores	Cs. Complementarias	6	CR	\N	\N	carreras.pdf
RED	7	Ingenieria Forense	Ciberseguridad	6	CR	\N	\N	carreras.pdf
RED	7	Arquitectura Soluciones Nube	IoT y Nube	6	CR	\N	\N	carreras.pdf
RED	7	Automatizacion y Entrega Cont.	IoT y Nube	6	CR	\N	\N	carreras.pdf
RED	7	Seguridad Apps Web	Ciberseguridad	6	CR	\N	\N	carreras.pdf
RED	7	Electiva 1	Complementaria	4	CR	\N	\N	carreras.pdf
RED	8	Redes para la Nube	IoT y Nube	6	CR	\N	\N	carreras.pdf
RED	8	Contenedores y Orquestacion	IoT y Nube	6	CR	\N	\N	carreras.pdf
RED	8	Ingenieria Social	Ciberseguridad	6	CR	\N	\N	carreras.pdf
RED	8	Continuidad del Negocio	Ciberseguridad	6	CR	\N	\N	carreras.pdf
RED	8	Normativa y Etica Ciber	Ciberseguridad	6	CR	\N	\N	carreras.pdf
RED	8	Electiva 2	Complementaria	4	CR	\N	\N	carreras.pdf
RED	9	Diseno Infraestructura Segura	Ciberseguridad	6	CR	\N	\N	carreras.pdf
RED	9	Cloud para IoT	IoT y Nube	4	CR	\N	\N	carreras.pdf
RED	9	Diseno Sistemas Inalambricos	Ingenieria Aplicada	6	CR	\N	\N	carreras.pdf
PET	1	Fundamentos de Matematicas	Matematicas	6	CR	\N	\N	carreras.pdf
PET	1	Fisica I	Fisica	5	CR	\N	\N	carreras.pdf
PET	1	Quimica General e Inorganica	Quimica	5	CR	\N	\N	carreras.pdf
PET	1	Tecnicas de Investigacion	Investigacion	5	CR	\N	\N	carreras.pdf
PET	1	Ingles I	Lengua Extranjera	5	CR	\N	\N	carreras.pdf
PET	2	Calculo I	Matematicas	6	CR	\N	\N	carreras.pdf
PET	2	Fisica II	Fisica	5	CR	\N	\N	carreras.pdf
PET	2	Quimica Organica	Quimica	5	CR	\N	\N	carreras.pdf
PET	2	Geologia Estructural	Geologia	5	CR	\N	\N	carreras.pdf
PET	2	Informatica para Ingenieria	Sistemas	6	CR	\N	\N	carreras.pdf
PET	2	Deontologia y Prosocialidad	Humanidades	5	CR	\N	\N	carreras.pdf
PET	3	Calculo II	Matematicas	6	CR	\N	\N	carreras.pdf
PET	3	Termodinamica	Quimica	5	CR	\N	\N	carreras.pdf
PET	3	Estadistica Descriptiva	Matematicas	5	CR	\N	\N	carreras.pdf
PET	3	Geologia del Petroleo	Geologia	6	CR	\N	\N	carreras.pdf
PET	3	Introduccion a la Economia	Economia	5	CR	\N	\N	carreras.pdf
PET	3	Dibujo Industrial Computarizado	Sistemas	5	CR	\N	\N	carreras.pdf
PET	4	Estadistica Inferencial	Matematicas	5	CR	\N	\N	carreras.pdf
PET	4	Mecanica de Fluidos	Fisica	5	CR	\N	\N	carreras.pdf
PET	4	Resistencia de Materiales	Fisica	6	CR	\N	\N	carreras.pdf
PET	4	Reservorios I	Reservorios	5	CR	\N	\N	carreras.pdf
PET	4	Petrofisica y Registro Pozo	Reservorios	5	CR	\N	\N	carreras.pdf
PET	4	Cadena de Valor Gas Natural	Produccion	5	CR	\N	\N	carreras.pdf
PET	5	Investigacion Operativa I	Matematicas	6	CR	\N	\N	carreras.pdf
PET	5	Reservorios II	Reservorios	5	CR	\N	\N	carreras.pdf
PET	5	Elementos de Perforacion	Perforacion	6	CR	\N	\N	carreras.pdf
PET	5	Ingenieria Economica	Economia	5	CR	\N	\N	carreras.pdf
PET	5	Fluidos de Perforacion	Perforacion	5	CR	\N	\N	carreras.pdf
PET	5	Tecnologia del Gas Natural	Produccion	5	CR	\N	\N	carreras.pdf
PET	6	Ingenieria de Reservorios Gas	Reservorios	5	CR	\N	\N	carreras.pdf
PET	6	Ingenieria de Perforacion	Perforacion	6	CR	\N	\N	carreras.pdf
PET	6	Produccion Petrolera I	Produccion	6	CR	\N	\N	carreras.pdf
PET	6	Cementacion de Pozos	Perforacion	5	CR	\N	\N	carreras.pdf
PET	6	Seguridad e Higiene	Industrial	5	CR	\N	\N	carreras.pdf
PET	6	Metodos y Tecnicas de Inv.	Investigacion	5	CR	\N	\N	carreras.pdf
PET	7	Caracterizacion de Yacimientos	Reservorios	5	CR	\N	\N	carreras.pdf
PET	7	Perforacion de Pozos Horiz.	Perforacion	5	CR	\N	\N	carreras.pdf
PET	7	Produccion Petrolera II	Produccion	6	CR	\N	\N	carreras.pdf
PET	7	Derecho Petrolero	Legal	5	CR	\N	\N	carreras.pdf
PET	7	Emprendedurismo	Gestion	5	CR	\N	\N	carreras.pdf
PET	8	Recuperacion Mejorada	Reservorios	5	CR	\N	\N	carreras.pdf
PET	8	Transporte y Almacenaje	Produccion	5	CR	\N	\N	carreras.pdf
PET	8	Refinacion e Industrializacion	Produccion	5	CR	\N	\N	carreras.pdf
PET	8	Manejo de Produccion Hidroc.	Produccion	5	CR	\N	\N	carreras.pdf
PET	8	Planeacion y Adm. Proyectos	Gestion	6	CR	\N	\N	carreras.pdf
PET	9	Simulacion de Reservorios	Reservorios	6	CR	\N	\N	carreras.pdf
PET	9	Gestion Ambiental Petrolera	Industrial	5	CR	\N	\N	carreras.pdf
PET	9	Comercializacion Hidroc.	Economia	5	CR	\N	\N	carreras.pdf
PET	9	Taller de Grado	Investigacion	7	CR	\N	\N	carreras.pdf
\.

INSERT INTO areas_academicas (carrera_id, nombre)
SELECT DISTINCT c.id, smr.area_nombre
FROM seed_materias_raw smr
INNER JOIN carreras c ON c.codigo = smr.carrera_codigo
ON CONFLICT (carrera_id, nombre) DO NOTHING;

WITH materias_ranked AS (
  SELECT
    smr.*,
    ROW_NUMBER() OVER (
      PARTITION BY smr.carrera_codigo
      ORDER BY smr.semestre, smr.nombre
    ) AS orden_interno
  FROM seed_materias_raw smr
)
INSERT INTO materias (
  carrera_id,
  area_id,
  codigo,
  nombre,
  semestre,
  tipo_valor,
  creditos,
  carga_horaria_total,
  horas_teoricas,
  horas_practicas,
  fuente,
  es_boceto
)
SELECT
  c.id,
  aa.id,
  CONCAT(mr.carrera_codigo, '-', LPAD(mr.semestre::TEXT, 2, '0'), '-', LPAD(mr.orden_interno::TEXT, 3, '0')),
  mr.nombre,
  mr.semestre,
  mr.tipo_valor,
  CASE WHEN mr.tipo_valor = 'CR' THEN mr.valor_referencial END,
  CASE WHEN mr.tipo_valor = 'TH' THEN mr.valor_referencial END,
  mr.horas_teoricas,
  mr.horas_practicas,
  mr.fuente,
  TRUE
FROM materias_ranked mr
INNER JOIN carreras c ON c.codigo = mr.carrera_codigo
INNER JOIN areas_academicas aa
  ON aa.carrera_id = c.id
 AND aa.nombre = mr.area_nombre
ON CONFLICT (codigo) DO UPDATE
SET
  area_id = EXCLUDED.area_id,
  nombre = EXCLUDED.nombre,
  semestre = EXCLUDED.semestre,
  tipo_valor = EXCLUDED.tipo_valor,
  creditos = EXCLUDED.creditos,
  carga_horaria_total = EXCLUDED.carga_horaria_total,
  horas_teoricas = EXCLUDED.horas_teoricas,
  horas_practicas = EXCLUDED.horas_practicas,
  fuente = EXCLUDED.fuente,
  es_boceto = EXCLUDED.es_boceto;

CREATE TEMP TABLE seed_prerrequisitos_raw (
  carrera_codigo VARCHAR(16) NOT NULL,
  materia_nombre VARCHAR(180) NOT NULL,
  prerrequisito_nombre VARCHAR(180) NOT NULL,
  nota TEXT
) ON COMMIT DROP;

COPY seed_prerrequisitos_raw (
  carrera_codigo,
  materia_nombre,
  prerrequisito_nombre,
  nota
) FROM STDIN WITH (FORMAT text, DELIMITER E'\t', NULL '\N');
SIS	Calculo II	Calculo I	Importado desde carreras.pdf
SIS	Programacion I	Programacion Basica	Importado desde carreras.pdf
SIS	Base de Datos II	Base de Datos I	Importado desde carreras.pdf
SIS	Desarrollo de Sistemas I	Programacion III	Importado desde carreras.pdf
SIS	Desarrollo de Sistemas I	Base de Datos I	Importado desde carreras.pdf
MED	Anatomia Humana II	Anatomia Humana I	Importado desde carreras.pdf
MED	Semiologia I	Fisiopatologia	Importado desde carreras.pdf
MED	Cirugia I	Anatomia Humana II	Importado desde carreras.pdf
MED	Cirugia I	Fisiologia	Importado desde carreras.pdf
\.

INSERT INTO materias_prerrequisito (materia_codigo, prerrequisito_codigo, nota)
SELECT
  destino.codigo,
  origen.codigo,
  spr.nota
FROM seed_prerrequisitos_raw spr
INNER JOIN carreras c ON c.codigo = spr.carrera_codigo
INNER JOIN materias destino
  ON destino.carrera_id = c.id
 AND destino.nombre = spr.materia_nombre
INNER JOIN materias origen
  ON origen.carrera_id = c.id
 AND origen.nombre = spr.prerrequisito_nombre
ON CONFLICT (materia_codigo, prerrequisito_codigo) DO UPDATE
SET nota = EXCLUDED.nota;

COMMIT;
