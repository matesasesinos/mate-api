# API de Usuarios

API RESTful para gestión de usuarios con autenticación y autorización basada en roles y permisos.

## Características

- Autenticación con JWT y API Key
- Autorización basada en roles y permisos
- Gestión de usuarios y perfiles
- Integración con Google y Facebook OAuth
- Recuperación y cambio de contraseña
- Documentación con Swagger

## Requisitos

- Node.js (v14 o superior)
- MySQL
- npm o yarn

## Instalación

1. Clonar el repositorio:
```bash
git clone <url-del-repositorio>
cd api-users
```

2. Instalar dependencias:
```bash
npm install
```

3. Configurar variables de entorno:
```bash
cp .env.example .env
```

Editar el archivo `.env` con tus configuraciones:
```env
# Base de datos
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=tu_contraseña
DB_DATABASE=api_users

# API
PORT=3000
BASE_URL=http://localhost:3000
API_KEY=tu_api_key_secreta

# JWT
JWT_SECRET=tu_jwt_secret_secreto

# OAuth
GOOGLE_CLIENT_ID=tu_google_client_id
GOOGLE_CLIENT_SECRET=tu_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback

FACEBOOK_CLIENT_ID=tu_facebook_client_id
FACEBOOK_CLIENT_SECRET=tu_facebook_client_secret
FACEBOOK_CALLBACK_URL=http://localhost:3000/api/auth/facebook/callback
```

4. Iniciar la aplicación:
```bash
npm run start:dev
```

## Autenticación y Autorización

### API Key
Todos los endpoints requieren una API Key válida en el header:
```
api-x-key: tu_api_key
```

### JWT Token
Los endpoints protegidos requieren además un JWT token en el header:
```
Authorization: Bearer tu_jwt_token
```

### Roles y Permisos

#### Roles Predefinidos
- `admin`: Acceso total al sistema
- `moderator`: Acceso limitado para moderación
- `user`: Acceso básico

#### Permisos
- `create:user`: Crear usuarios
- `read:users`: Ver lista de usuarios
- `read:user`: Ver usuario específico
- `update:user`: Actualizar usuarios
- `delete:user`: Eliminar usuarios
- Y más...

### Ejemplos de Uso

1. Login para obtener JWT token:
```http
POST /api/auth/login
Content-Type: application/json

{
    "email": "usuario@ejemplo.com",
    "password": "contraseña"
}
```

2. Acceder a endpoint protegido:
```http
GET /api/users
api-x-key: tu_api_key
Authorization: Bearer tu_jwt_token
```

3. Endpoint público (solo requiere API Key):
```http
GET /api/posts
api-x-key: tu_api_key
```

## Instalación Inicial

Antes de usar la API, es necesario realizar la instalación inicial:

1. Verificar si la aplicación está instalada:
```http
GET /api/install
```

2. Si no está instalada, crear usuario administrador:
```http
POST /api/install
Content-Type: application/json

{
    "adminEmail": "admin@ejemplo.com",
    "adminPassword": "contraseña_segura"
}
```

Esto creará:
- Permisos necesarios
- Roles predefinidos
- Usuario administrador

## Documentación API

La documentación completa de la API está disponible en Swagger:
```
http://localhost:3000/docs
```

## Endpoints Principales

### Autenticación
- `POST /api/auth/login`: Login con email/password
- `GET /api/auth/google`: Login con Google
- `GET /api/auth/facebook`: Login con Facebook
- `POST /api/auth/forgot-password`: Solicitar reset de contraseña
- `POST /api/auth/reset-password`: Resetear contraseña
- `POST /api/auth/change-password`: Cambiar contraseña

### Usuarios
- `GET /api/users`: Listar usuarios (admin)
- `POST /api/users`: Crear usuario (admin)
- `GET /api/users/:id`: Ver usuario (admin/moderator)
- `PATCH /api/users/:id`: Actualizar usuario (admin)
- `DELETE /api/users/:id`: Eliminar usuario (admin)
- `GET /api/users/profile`: Ver perfil propio

### Roles y Permisos
- `GET /api/roles`: Listar roles (admin)
- `POST /api/roles`: Crear rol (admin)
- `GET /api/permissions`: Listar permisos (admin)
- `POST /api/permissions`: Crear permiso (admin)

## Seguridad

- Todas las contraseñas se almacenan hasheadas con Argon2
- Los tokens JWT expiran en 6 horas
- Se requiere API Key para todos los endpoints
- Los endpoints protegidos requieren JWT token válido
- Validación de roles y permisos en cada endpoint
- Protección contra ataques comunes (XSS, CSRF, etc.)

## Desarrollo

```bash
# Modo desarrollo
npm run start:dev

# Modo producción
npm run build
npm run start:prod
```

## Testing

```bash
# Unit tests
npm run test

# e2e tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## Licencia

MIT