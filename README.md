# Mate API

API RESTful para gestión de usuarios y recursos.

## Instalación

Clonar proyecto de Github, luego:

```bash
npm install
```

## Ejecución (desarrollo)

```bash
npm run start:dev
```

## Documentación de la API

La documentación completa de los endpoints está disponible en Swagger UI:
```
http://localhost:3000/api/docs
```


## Características

- Autenticación mediante API Key
- Paginación en todos los endpoints de listado
- Respuestas estandarizadas
- Documentación completa con Swagger

## Documentación

La documentación completa de la API está disponible en Swagger UI:
http://localhost:3000/api/docs

## Paginación

Todos los endpoints de listado soportan paginación con los siguientes parámetros:
- `page`: Número de página (default: 1)
- `per_page`: Elementos por página (default: 10)
- `order`: Orden de los resultados (ASC o DESC, default: DESC)

La respuesta incluye:
- `items`: Array de elementos
- `total`: Total de elementos
- `page`: Página actual
- `per_page`: Elementos por página
- `total_pages`: Total de páginas
- `next`: URL de la siguiente página (false si no hay)
- `previous`: URL de la página anterior (false si no hay)


## Configuración

### Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
# Database
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=root
DB_DATABASE=api_users_test

# API
PORT=3000
BASE_URL=http://localhost:3000

# JWT
JWT_SECRET=your-super-secret-key-here

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Facebook OAuth
FACEBOOK_CLIENT_ID=your-facebook-client-id
FACEBOOK_CLIENT_SECRET=your-facebook-client-secret
```

### Configuración de OAuth

#### Google OAuth
1. Ve a [Google Cloud Console](https://console.cloud.google.com)
2. Crea un nuevo proyecto
3. Habilita la API de Google+ API
4. En "Credentials", crea un nuevo "OAuth 2.0 Client ID"
5. Configura las URLs de redirección autorizadas:
   - `http://localhost:3000/api/auth/google/callback` (desarrollo)
   - `https://tu-dominio.com/api/auth/google/callback` (producción)
6. Copia el Client ID y Client Secret a tu archivo `.env`

#### Facebook OAuth
1. Ve a [Facebook Developers](https://developers.facebook.com)
2. Crea una nueva aplicación
3. En la configuración de la app, agrega el producto "Facebook Login"
4. Configura las URLs de redirección OAuth:
   - `http://localhost:3000/api/auth/facebook/callback` (desarrollo)
   - `https://tu-dominio.com/api/auth/facebook/callback` (producción)
5. Copia el App ID y App Secret a tu archivo `.env`

## Autenticación

La API soporta múltiples métodos de autenticación:

### 1. Autenticación Local (Email/Password)

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

Respuesta:
```json
{
  "success": true,
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": 1,
      "email": "user@example.com",
      "name": "John",
      "lastname": "Doe"
    }
  }
}
```

### 2. Autenticación con Google

1. Redirige al usuario a:
```
GET /api/auth/google
```

2. El usuario será redirigido a Google para autenticarse
3. Después de la autenticación, Google redirigirá a:
```
GET /api/auth/google/callback
```

### 3. Autenticación con Facebook

1. Redirige al usuario a:
```
GET /api/auth/facebook
```

2. El usuario será redirigido a Facebook para autenticarse
3. Después de la autenticación, Facebook redirigirá a:
```
GET /api/auth/facebook/callback
```

### 4. Recuperación de Contraseña

1. Solicitar reset:
```http
POST /api/auth/forgot-password
Content-Type: application/json

{
  "email": "user@example.com"
}
```

2. Resetear contraseña:
```http
POST /api/auth/reset-password
Content-Type: application/json

{
  "token": "reset-token-from-email",
  "newPassword": "newpassword123"
}
```

### 5. Cambio de Contraseña

```http
POST /api/auth/change-password
Authorization: Bearer your-jwt-token
Content-Type: application/json

{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword123"
}
```

### Protección de Endpoints

Para proteger un endpoint, usa el decorador `@UseGuards(JwtAuthGuard)`:

```typescript
@UseGuards(JwtAuthGuard)
@Get('profile')
getProfile(@Request() req) {
  return req.user;
}
```

### Uso del Token

Para acceder a endpoints protegidos, incluye el token JWT en el header:

```http
GET /api/users
Authorization: Bearer your-jwt-token
```

## Seguridad

- Las contraseñas se almacenan usando Argon2 con configuración de alta seguridad
- Los tokens JWT expiran después de 24 horas
- Los tokens de recuperación de contraseña expiran después de 1 hora
- Las credenciales de OAuth se manejan de forma segura
- No se revela información sobre la existencia de usuarios en endpoints de recuperación de contraseña

## Ejecución

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Estructura del Proyecto

```
src/
├── common/           # Código compartido (DTOs, interfaces, etc.)
├── config/           # Configuración de la aplicación
├── filters/          # Filtros de excepciones
├── interceptors/     # Interceptores
├── users/            # Módulo de usuarios
│   ├── dto/         # DTOs específicos de usuarios
│   ├── entities/    # Entidades de usuarios
│   ├── users.controller.ts
│   └── users.service.ts
└── utils/           # Utilidades y helpers
```

## Respuestas de la API

Todas las respuestas de la API siguen un formato estándar:

```json
{
  "success": true,
  "data": {
    // Datos de la respuesta
  }
}
```

En caso de error:

```json
{
  "success": false,
  "data": {
    "message": "Mensaje de error",
    "error": "Tipo de error",
    "statusCode": 400
  }
}
```

## Utilidades

### EncryptionHelper

Utilidad para encriptación segura de datos usando Argon2. Proporciona diferentes niveles de seguridad según las necesidades.

#### Niveles de Seguridad Predefinidos

1. **Alta Seguridad** (`encryptHighSecurity`)
   ```typescript
   const encrypted = await EncryptionHelper.encryptHighSecurity('datos sensibles');
   ```
   - Memoria: 128 MiB
   - Iteraciones: 4
   - Hilos: 4
   - Recomendado para: Contraseñas, datos críticos

2. **Seguridad Equilibrada** (`encryptBalanced`)
   ```typescript
   const encrypted = await EncryptionHelper.encryptBalanced('datos');
   ```
   - Memoria: 64 MiB
   - Iteraciones: 3
   - Hilos: 4
   - Recomendado para: Uso general

3. **Enfoque en Rendimiento** (`encryptPerformance`)
   ```typescript
   const encrypted = await EncryptionHelper.encryptPerformance('datos');
   ```
   - Memoria: 32 MiB
   - Iteraciones: 2
   - Hilos: 2
   - Recomendado para: Datos menos sensibles

#### Configuración Personalizada

```typescript
const encrypted = await EncryptionHelper.encrypt('datos', {
  type: 2,           // 0: argon2d, 1: argon2i, 2: argon2id
  memoryCost: 65536, // en KiB
  timeCost: 3,       // número de iteraciones
  parallelism: 4     // grado de paralelismo
});
```

#### Verificación de Datos

```typescript
const isValid = await EncryptionHelper.verify('datos', encryptedData);
```

#### Características de Seguridad

- Usa Argon2id (variante más segura de Argon2)
- Salt automático y único para cada encriptación
- Resistente a ataques de fuerza bruta y GPU
- Protección contra ataques de memoria compartida

#### Ejemplo de Uso

```typescript
// Encriptar datos sensibles
const sensitiveData = 'información confidencial';
const encrypted = await EncryptionHelper.encryptHighSecurity(sensitiveData);

// Verificar datos
const isValid = await EncryptionHelper.verify(sensitiveData, encrypted);
```