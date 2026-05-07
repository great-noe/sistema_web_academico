# 🎓 Academisys — Sistema Web Académico

<p align="center">
  <img src="https://img.shields.io/badge/Vue.js-3.x-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white" alt="Vue.js">
  <img src="https://img.shields.io/badge/Node.js-20_LTS-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/Express.js-4.x-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express">
  <img src="https://img.shields.io/badge/PostgreSQL-Database-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL">
  <img src="https://img.shields.io/badge/JWT-Authentication-F7B731?style=for-the-badge&logo=jsonwebtokens&logoColor=white" alt="JWT">
</p>

<p align="center">
  Plataforma educativa web integral para la gestión de procesos académicos, construida con arquitectura cliente-servidor moderna.
</p>

---

## 📋 Tabla de Contenidos

- [Descripción](#-descripción)
- [Características](#-características)
- [Tecnologías](#-tecnologías)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación y Configuración](#-instalación-y-configuración)
- [Variables de Entorno](#-variables-de-entorno)
- [Uso](#-uso)
- [Roles del Sistema](#-roles-del-sistema)
- [API Endpoints](#-api-endpoints)
- [Estructura del Proyecto](#-estructura-del-proyecto)

---

## 📖 Descripción

**Academisys** es un sistema web académico diseñado para modernizar los procesos de una institución educativa. Permite a estudiantes, docentes y administradores gestionar cursos, inscripciones, calificaciones y reportes desde una interfaz intuitiva y segura.

> **Materia:** Programación 4  
> **Repositorio:** [github.com/great-noe/sistema_web_academico](https://github.com/great-noe/sistema_web_academico)

---

## ✨ Características

| Módulo | Descripción | Roles |
|---|---|---|
| **RF01 – Registro** | Creación de cuentas con selección de rol y validación de datos | Admin |
| **RF02 – Inicio de Sesión** | Autenticación con JWT, sesiones seguras y contenido por rol | Todos |
| **RF03 – Perfil** | Visualizar y editar datos personales, cambiar contraseña | Todos |
| **RF04 – Gestión de Cursos** | Crear, editar y eliminar cursos académicos | Admin, Docente |
| **RF05 – Inscripción** | Inscribirse a cursos disponibles, sin duplicidad | Estudiante |
| **RF06 – Visualización de Cursos** | Ver cursos propios con detalles, estado y cupo en tiempo real | Todos |
| **RF07 – Calificaciones** | Registrar y editar notas de los alumnos inscritos | Admin, Docente |
| **RF08 – Dashboard** | Panel principal con resumen de cursos y actividad reciente | Todos |
| **RF09 – Gestión de Usuarios** | CRUD completo de usuarios y asignación de roles | Admin |
| **RF11 – Cierre de Sesión** | Logout seguro con limpieza de sesión | Todos |
| **RF12 – Reportes** | Generación de reportes en **PDF** y **Excel** | Todos |

---

## 🛠 Tecnologías

### Frontend
| Tecnología | Versión | Uso |
|---|---|---|
| **Vue.js** | ^3.5 | Framework frontend (Composition API) |
| **Vue Router** | ^4.4 | Navegación y rutas protegidas por rol |
| **Pinia** | ^3.0 | Gestión de estado global |
| **Axios** | ^1.16 | Cliente HTTP para llamadas a la API |
| **Vite** | ^8.0 | Herramienta de build y servidor de desarrollo |

### Backend
| Tecnología | Versión | Uso |
|---|---|---|
| **Node.js** | ^20 LTS | Entorno de ejecución del servidor |
| **Express.js** | ^4.18 | Framework web del backend |
| **PostgreSQL** | - | Base de datos relacional |
| **pg** | ^8.20 | Driver de PostgreSQL para Node.js |
| **bcryptjs** | ^3.0 | Hash seguro de contraseñas |
| **jsonwebtoken** | ^9.0 | Autenticación basada en tokens JWT |
| **ExcelJS** | ^4.4 | Generación de reportes en formato `.xlsx` |
| **PDFKit** | ^0.18 | Generación de reportes en formato `.pdf` |
| **Helmet** | ^8.1 | Cabeceras de seguridad HTTP |
| **Nodemon** | ^3.1 | Recarga automática en desarrollo |

---

## ✅ Requisitos Previos

- [Node.js](https://nodejs.org/) v20 LTS o superior
- [PostgreSQL](https://www.postgresql.org/) v14 o superior
- `npm` v9 o superior

---

## 🚀 Instalación y Configuración

### 1. Clonar el repositorio

```bash
git clone https://github.com/great-noe/sistema_web_academico.git
cd sistema_web_academico
```

### 2. Configurar el Backend

```bash
cd backend
npm install
```

Ejecutar el esquema de la base de datos en PostgreSQL:

```bash
psql -U <tu_usuario> -d <tu_base_de_datos> -f sql/001_rf12_base_schema.sql
psql -U <tu_usuario> -d <tu_base_de_datos> -f sql/002_seed_carreras_boceto.sql
```

Crear el archivo `.env` (ver sección siguiente) y luego iniciar el servidor:

```bash
npm run dev
```

El backend estará disponible en: `http://localhost:3001`

### 3. Configurar el Frontend

```bash
cd ../frontend
npm install
npm run dev
```

La aplicación estará disponible en: `http://localhost:5173`

---

## 🔐 Variables de Entorno

Crea un archivo `.env` dentro de la carpeta `backend/` con el siguiente contenido:

```env
PORT=3001
DATABASE_URL=postgresql://usuario:contraseña@host:5432/nombre_db
JWT_SECRET=tu_clave_secreta_aqui
CORS_ORIGIN=http://localhost:5173
```

---

## 🖥 Uso

Una vez iniciados ambos servidores, abre el navegador en `http://localhost:5173`.

### Cuentas de Prueba

La aplicación incluye botones de acceso rápido en la pantalla de login para las siguientes cuentas de prueba:

| Rol | Email de prueba | Contraseña |
|---|---|---|
| Administrador | `admin` | `123456` |
| Docente | `docente` | `123456` |
| Estudiante | `estudiante` | `123456` |

---

## 👤 Roles del Sistema

```
┌─────────────────┬────────────────────────────────────────────────────────────────┐
│      Rol        │                        Permisos                               │
├─────────────────┼────────────────────────────────────────────────────────────────┤
│  Estudiante     │ Ver cursos disponibles, inscribirse, ver sus calificaciones    │
│                 │ y descargar reportes de sus notas                              │
├─────────────────┼────────────────────────────────────────────────────────────────┤
│  Docente        │ Gestionar sus cursos, registrar y editar calificaciones,       │
│                 │ y generar reportes por curso                                   │
├─────────────────┼────────────────────────────────────────────────────────────────┤
│  Administrador  │ Control total: gestión de usuarios, asignación de roles,       │
│                 │ supervisión general y acceso a todos los reportes              │
└─────────────────┴────────────────────────────────────────────────────────────────┘
```

---

## 🔗 API Endpoints

### Autenticación (`/api/auth`)
| Método | Ruta | Descripción |
|---|---|---|
| `POST` | `/api/auth/login` | Iniciar sesión |
| `POST` | `/api/auth/register` | Registrar nuevo usuario |
| `GET` | `/api/auth/profile` | Ver perfil del usuario autenticado |
| `PUT` | `/api/auth/profile` | Actualizar datos personales |
| `PUT` | `/api/auth/profile/password` | Cambiar contraseña |

### Cursos (`/api/cursos`)
| Método | Ruta | Descripción | Roles |
|---|---|---|---|
| `GET` | `/api/cursos` | Listar cursos según el rol | Todos |
| `GET` | `/api/cursos/disponibles` | Listar cursos disponibles para inscripción | Estudiante |
| `POST` | `/api/cursos` | Crear un nuevo curso | Admin, Docente |
| `PUT` | `/api/cursos/:id` | Editar un curso | Admin, Docente |
| `DELETE` | `/api/cursos/:id` | Eliminar un curso | Admin |
| `POST` | `/api/cursos/:id/inscribir` | Inscribirse en un curso | Estudiante |
| `GET` | `/api/cursos/:id/calificaciones` | Ver calificaciones del curso | Admin, Docente |
| `POST` | `/api/cursos/:id/calificaciones` | Guardar calificaciones | Admin, Docente |

### Usuarios (`/api/usuarios`)
| Método | Ruta | Descripción | Roles |
|---|---|---|---|
| `GET` | `/api/usuarios` | Listar todos los usuarios | Admin |
| `POST` | `/api/usuarios` | Crear usuario | Admin |
| `PUT` | `/api/usuarios/:id` | Editar usuario | Admin |
| `DELETE` | `/api/usuarios/:id` | Eliminar usuario | Admin |
| `GET` | `/api/usuarios/docentes` | Listar docentes | Admin, Docente |

### Reportes (`/api/reportes`)
Todos los endpoints aceptan el parámetro `?formato=json|pdf|excel`

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/api/reportes/alumnos/:id/notas` | Notas de un alumno |
| `GET` | `/api/reportes/alumnos/:id/historial` | Historial académico |
| `GET` | `/api/reportes/alumnos/:id/cursos` | Cursos de un alumno |
| `GET` | `/api/reportes/cursos/:id/notas` | Notas por curso |
| `GET` | `/api/reportes/cursos/:id/alumnos` | Alumnos inscritos en un curso |
| `GET` | `/api/reportes/docentes/:id/cursos` | Cursos de un docente |

---

## 📁 Estructura del Proyecto

```
sistema_web_academico/
├── backend/
│   ├── sql/
│   │   ├── 001_rf12_base_schema.sql   # Esquema de la BD
│   │   └── 002_seed_carreras_boceto.sql # Datos semilla
│   └── src/
│       ├── config/          # Configuración de BD y entorno
│       ├── controllers/     # Lógica de negocio (auth, cursos, usuarios, reportes)
│       ├── middlewares/     # Auth middleware y control de roles
│       ├── routes/          # Definición de rutas de la API
│       ├── services/        # Servicios de reportes
│       ├── utils/           # Utilidades (builders de PDF/Excel)
│       ├── app.js           # Configuración de Express
│       └── server.js        # Punto de entrada del servidor
│
└── frontend/
    └── src/
        ├── components/      # Componentes reutilizables (ReportCard, etc.)
        ├── router/          # Configuración de Vue Router
        ├── servicios/       # Definiciones de reportes y URLs
        ├── stores/          # Stores de Pinia (auth, cursos, usuarios)
        └── vistas/          # Vistas de la aplicación
            ├── Login.vue
            ├── Layout.vue
            ├── Dashboard.vue
            ├── Cursos.vue
            ├── Usuarios.vue
            ├── Docentes.vue
            ├── Estudiantes.vue
            └── Reportes.vue
```

---

<p align="center">
  Desarrollado con ❤️ para el curso de <strong>Programación 4</strong>
</p>