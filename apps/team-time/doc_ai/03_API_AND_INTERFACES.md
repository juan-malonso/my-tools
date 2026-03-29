# 03 - API, Interfaces y Contratos de Datos

Este documento detalla las interfaces de datos y los contratos de comunicación entre el cliente y el backend.

## 1. API Externa

La aplicación no expone una API REST o GraphQL tradicional. La comunicación con el backend se realiza a través de un único endpoint principal que actúa como un simple Key-Value Store para los datos encriptados del usuario.

- **Endpoint:** `GET /api/data?id={hmacId}`
- **Descripción:** Recupera el blob de datos encriptado para un usuario específico.
- **Respuesta:** `application/octet-stream` - El blob de datos encriptado.

- **Endpoint:** `POST /api/data?id={hmacId}`
- **Descripción:** Guarda un nuevo blob de datos encriptado para un usuario.
- **Cuerpo:** `application/octet-stream` - El nuevo blob de datos encriptado.

## 2. Contrato de Encriptación

La seguridad de los datos del usuario depende de un esquema de encriptación del lado del cliente.

- **Derivación de Clave:** `PBKDF2` con `sha256`, 100,000 iteraciones. La contraseña es la clave y el `username` es el _salt_.
- **Encriptación de Datos:** `AES-256-GCM`. Proporciona confidencialidad e integridad.
- **Identificador de Usuario:** `HMAC-SHA256` del `username` usando la clave derivada. Esto crea un ID determinístico pero no reversible para buscar al usuario en la base de datos.

## 3. Interfaces de Datos Principales

La estructura de datos principal, una vez desencriptada, es un objeto `Config`.

### Interface: `Config`

Representa el estado completo de la aplicación para un usuario.

```typescript
interface Config {
  allocations: Utils<Allocation>;
  members: Utils<Member>;
  tasks: Utils<Task>;
  modules: Utils<Module>;
}
```

### Interface: `Utils<T>`

Es un contenedor para las colecciones de datos, gestionado por el hook `useCustomState`.

```typescript
interface Utils<T> {
  values: T[];
  add: (value: T) => void;
  set: (value: T) => void;
  del: (id: string) => void;
  raw: (values: T[]) => void;
}
```

### Tipos de Datos Base

Todos los elementos dentro de las colecciones de `Config` extienden una interfaz base con un `id`.

```typescript
interface BaseItem {
  id: string;
}

interface Allocation extends BaseItem {
  // Propiedades de una asignación...
  taskId: string;
  memberId: string;
  startDate: string; // e.g., 'YYYY-MM-DD'
  endDate: string;
}

interface Member extends BaseItem {
  // Propiedades de un miembro del equipo...
  name: string;
  role: string;
}

interface Task extends BaseItem {
  // Propiedades de una tarea...
  name: string;
  moduleId: string;
}

interface Module extends BaseItem {
  // Propiedades de un módulo o proyecto...
  name: string;
}
```

**Navegación:**

- Volver al Flujo de Datos: 01_DATA_FLOW.md
- Volver al Índice de Módulos: 02_MODULE_INDEX.md
