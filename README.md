# BookRoom - Meeting Room Booking System

Sistema fullstack de reserva de salas de reuniones con interfaz dark premium, roles de usuario y panel de administracion.

## Tech Stack

**Frontend**
- React 19 + React Router 7
- Tailwind CSS 4
- Vite 7
- Lucide React (iconos)

**Backend**
- Express 5
- PostgreSQL (Supabase)
- JSON Web Tokens (autenticacion)
- bcrypt (hash de passwords)

## Features

- Registro e inicio de sesion con JWT
- Catalogo de salas con imagenes, ratings y favoritos
- Detalle de sala con descripcion, equipamiento y reservas proximas
- Reserva de salas con validacion de conflictos de horario
- Sistema de calificacion (1-5 estrellas)
- Dashboard personal con vista semanal
- Busqueda y filtros de salas
- Landing page con animaciones y efectos

### Rol Admin

- Panel de administracion (`/admin`) con gestion de:
  - **Salas**: crear, editar y eliminar
  - **Usuarios**: ver todos, cambiar roles (user/admin), eliminar
  - **Reservas**: ver todas las reservas del sistema, cancelar cualquiera
- Badge visual en sidebar para identificar admins

## Estructura del Proyecto

```
meeting-room-booking/
├── backend/
│   └── src/
│       ├── config/         # Conexion a PostgreSQL
│       ├── controllers/    # Logica de negocio (users, rooms, reservations)
│       ├── middlewares/     # Auth JWT + Role-based access
│       ├── routes/         # Definicion de endpoints
│       └── index.js        # Entry point Express
├── frontend/
│   ├── public/rooms/       # Imagenes de salas
│   └── src/
│       ├── components/     # UI (Landing, Dashboard, Rooms, RoomDetail, AdminPanel, etc.)
│       ├── context/        # AuthContext (estado global de sesion)
│       ├── App.jsx         # Rutas y layout
│       └── index.css       # Tema dark premium + animaciones
└── README.md
```

## Setup

### 1. Base de datos

Crear las tablas en PostgreSQL/Supabase:

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'user'
);

CREATE TABLE rooms (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  capacity INTEGER NOT NULL
);

CREATE TABLE reservations (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  room_id INTEGER REFERENCES rooms(id),
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  status VARCHAR(20) DEFAULT 'active'
);

CREATE TABLE room_ratings (
  user_id INTEGER REFERENCES users(id),
  room_id INTEGER REFERENCES rooms(id),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  PRIMARY KEY (user_id, room_id)
);

CREATE TABLE favorite_rooms (
  user_id INTEGER REFERENCES users(id),
  room_id INTEGER REFERENCES rooms(id),
  PRIMARY KEY (user_id, room_id)
);
```

### 2. Backend

```bash
cd backend
npm install
npm run dev    # Inicia en http://localhost:3001
```

Configurar la conexion a la base de datos en `src/config/db.js`.

### 3. Frontend

```bash
cd frontend
npm install
npm run dev    # Inicia en http://localhost:5173
```

## API Endpoints

### Auth
| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| POST | `/api/users/register` | Registrar usuario |
| POST | `/api/users/login` | Iniciar sesion |

### Salas
| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| GET | `/api/rooms` | Listar salas |
| GET | `/api/rooms/:id/detail` | Detalle de sala |
| GET | `/api/rooms/availability` | Salas disponibles |
| POST | `/api/rooms/:id/rate` | Calificar sala |
| GET | `/api/rooms/:id/average` | Promedio de calificacion |
| POST | `/api/rooms/:id/favorite` | Agregar a favoritos |
| DELETE | `/api/rooms/:id/favorite` | Quitar de favoritos |
| GET | `/api/rooms/favorites/me` | Mis favoritos |

### Reservas
| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| POST | `/api/reservations` | Crear reserva |
| GET | `/api/reservations` | Mis reservas |
| PUT | `/api/reservations/:id/cancel` | Cancelar reserva |

### Admin (requiere role: admin)
| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| POST | `/api/rooms` | Crear sala |
| PUT | `/api/rooms/:id` | Editar sala |
| DELETE | `/api/rooms/:id` | Eliminar sala |
| GET | `/api/users` | Listar usuarios |
| PUT | `/api/users/:id/role` | Cambiar rol |
| DELETE | `/api/users/:id` | Eliminar usuario |
| GET | `/api/rooms/admin/reservations` | Todas las reservas |
| PUT | `/api/rooms/admin/reservations/:id/cancel` | Cancelar cualquier reserva |

## Hacer un usuario Admin

```sql
UPDATE users SET role = 'admin' WHERE email = 'tu-email@ejemplo.com';
```

Despues deslogueate y volve a iniciar sesion para que el token se actualice con el nuevo rol.
