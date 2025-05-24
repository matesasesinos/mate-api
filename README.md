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

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
# Database
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=root
DB_DATABASE=mate_api
DB_SYNCHRONIZE=true #solo desarrollo, para producción debe ser false

# API
BASE_URL=http://localhost:3000 # importante ya que sin esto fallan muchas cosas
APP_ENVIRONMENT=local #local, staging, production, etc
PORT=3000
API_KEY=your-api-key-here
```

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