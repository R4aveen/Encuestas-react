# Documentación Técnica: Sistema de Gestión de Cuadrillas (MuniGestión)

## 1. Descripción del Proyecto

Sistema web integral orientado a la gestión operativa de cuadrillas municipales.
La solución implementa una arquitectura desacoplada, donde:

* El **backend** expone una API RESTful con la lógica de negocio, control de usuarios y persistencia.
* El **frontend** funciona como una SPA (Single Page Application) moderna, basada en React + TypeScript + Vite.

El objetivo es entregar una plataforma clara, eficiente y escalable para gestionar incidencias, asignaciones y evidencias en terreno.

---

## 2. Arquitectura del Sistema

El proyecto sigue el patrón **Cliente–Servidor**, comunicándose mediante **HTTP + JSON**.
El frontend consume los endpoints definidos por la API en Django REST Framework.

### Estructura del Proyecto Frontend (React + Vite)

```plaintext
EncuestasReact/
├── public/
│   └── vite.svg
│
├── src/
│   ├── assets/              
│   │   └── react.svg
│   │
│   ├── components/          
│   │   ├── layout/          
│   │   │   ├── Header.tsx
│   │   │   ├── MainLayout.tsx
│   │   │   └── Sidebar.tsx
│   │   │
│   │   ├── router/          
│   │   │   └── AuthRequiredWrapper.tsx
│   │   │
│   │   └── ui/              
│   │       ├── UiBadge.tsx
│   │       ├── UiButton.tsx
│   │       ├── UiCard.tsx
│   │       ├── UiField.tsx
│   │       └── UiModal.tsx
│   │
│   ├── config/              
│   │   └── pages.config.ts
│   │
│   ├── context/             
│   │   └── AuthContext.tsx
│   │
│   ├── pages/               
│   │   ├── CuadrillaIncidentsPage.tsx
│   │   ├── DashboardPage.tsx
│   │   ├── IncidentDetailPage.tsx
│   │   └── LoginPage.tsx
│   │
│   ├── routes/
│   │   └── contentRoutes.tsx
│   │
│   ├── services/            
│   │   └── cuadrilla.service.ts
│   │
│   ├── App.css
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
│
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

### Descripción de Carpetas Clave

#### `src/components/ui/`

Contiene el “Design System” del proyecto.
Aquí viven los componentes reutilizables y estilizados con Bootstrap:

* Botones
* Formularios
* Modales
* Cards
* Badges

No contienen lógica de negocio.

#### `src/pages/`

Vistas principales del sistema.
Cada archivo representa una pantalla completa:

* Listado de incidencias
* Dashboard
* Detalle de incidencia
* Login

Consumen servicios, estados globales y componentes del UI.

#### `src/services/`

Capa donde se concentran todas las llamadas HTTP hacia el backend.

* Se usa Axios como cliente HTTP.
* Si cambia una URL en la API, solo se actualiza aquí.

Ejemplo: `cuadrilla.service.ts`.

#### `src/context/`

Manejo de estado global de autenticación:

* Token
* Usuario logueado
* Métodos de login/logout
* Protección de rutas

#### `src/components/layout/`

Define la estructura visual del sistema:

* Sidebar
* Header
* Contenedor principal
* Lógica de layout privado vs. público

#### `src/routes/`

Define la navegación de la aplicación:

* Rutas públicas
* Rutas protegidas
* Mapeo de componentes a URL

#### `src/config/`

Configuraciones globales:

* Definición del menú lateral
* Metadatos de página
* Alias generales

#### `src/assets/`

Archivos estáticos:

* Logos
* Iconos
* Imágenes generales

---

## 3. Stack Tecnológico y Versiones

### 3.1 Backend (Django)

Basado en los archivos de configuración:

* Python **3.11**
* Django **5.2.4**
* Django REST Framework **3.15.2**
* PostgreSQL (driver `psycopg` **3.2.12**)
* Autenticación por Token DRF
* Otras librerías:

  * `sqlparse`
  * `asgiref`
  * `tzdata`

### 3.2 Frontend (React)

* React **19.2.0**
* TypeScript **5.9.x**
* Vite **7.2.4**
* Axios **1.13.2**
* React Router DOM **7.9.6**
* Bootstrap **5.3.8**
* React-Bootstrap **2.10.10**
* Heroicons **2.2.0**
* Chart.js **4.5.1**
* react-chartjs-2

---

## 4. Estructura de Módulos

### Backend (Django Apps Principales)

| App               | Función                                        |
| ----------------- | ---------------------------------------------- |
| `core`            | Modelos base, direcciones, multimedia          |
| `incidencias`     | CRUD completo de incidencias, flujo de estados |
| `organizacion`    | Gestión de áreas, cuadrillas y jerarquías      |
| `territorial_app` | Encuestas territoriales y validación           |
| `personas`        | Usuarios, perfiles y dashboards                |
| `registration`    | Autenticación, tokens y control de sesión      |

### Frontend (React)

| Carpeta         | Propósito                                   |
| --------------- | ------------------------------------------- |
| `components/ui` | Sistema de diseño (botones, modales, cards) |
| `pages`         | Pantallas completas de la aplicación        |
| `services`      | Capa de comunicación con Django (Axios)     |
| `context`       | Manejo de autenticación y estado global     |

---

## 5. Funcionalidades Clave

1. **Autenticación Integrada**
   Login contra Django, almacenamiento seguro del token y rutas protegidas.

2. **Dashboard Operacional**
   Gráficos dinámicos con estados de incidencias usando Chart.js.

3. **Gestión de Incidencias**

   * Listado con filtros
   * Asignación a cuadrillas
   * Cambio de estados en tiempo real:

     * Pendiente
     * En proceso
     * Finalizada
     * Rechazada

4. **Subida de Evidencias Fotográficas**
   Manejo de archivos con `FormData` y almacenamiento gestionado por Django.

---

## 6. API Endpoints Principales

Definidos en la app `incidencias`:

| Acción                       | Endpoint                                                            |
| ---------------------------- | ------------------------------------------------------------------- |
| Autenticación                | `POST /api/auth/token/`                                             |
| Listar incidencias asignadas | `GET /incidencias/api/cuadrilla/incidencias/`                       |
| Iniciar incidencia           | `POST /incidencias/api/cuadrilla/incidencias/{id}/iniciar/`         |
| Subir evidencia              | `POST /incidencias/api/cuadrilla/incidencias/{id}/subir-evidencia/` |
| Finalizar                    | `POST /incidencias/api/cuadrilla/incidencias/{id}/resolver/`        |

---

## 7. Guía de Instalación Local

### Backend (Django)

```bash
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### Frontend (React)

```bash
npm install
npm run dev
```

Acceder vía:
`http://localhost:5173`

---

## 8. Estado del Proyecto

Documentación elaborada para entrega final, siguiendo criterios técnicos profesionales y estructura escalable para mantenimiento y nuevas funcionalidades.
