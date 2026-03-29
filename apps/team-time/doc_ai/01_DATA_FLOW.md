# 01 - Flujo de Datos

Este documento describe los ciclos de vida de las peticiones y datos más importantes en la aplicación "Team Time".

## 1. Flujo de Autenticación y Carga de Datos del Usuario

La aplicación no tiene un sistema de login tradicional. En su lugar, utiliza un par de credenciales (usuario/contraseña) para derivar una clave y acceder a un blob de datos encriptado y único para cada usuario.

```mermaid
sequenceDiagram
    participant User as Usuario
    participant Client as Cliente (Navegador)
    participant Worker as Cloudflare Worker
    participant D1 as Cloudflare D1

    User->>Client: Proporciona Usuario y Contraseña
    Client->>Client: Deriva `masterKey` (PBKDF2) y `hmacId` (HMAC-SHA256)
    Client->>Worker: GET /api/data?id={hmacId}
    Worker->>D1: SELECT content FROM files WHERE id = {hmacId}
    D1-->>Worker: Retorna `content`
    Worker-->>Client: Retorna `content`
    Client->>Client: Desencripta `content` con `masterKey` (AES-256-GCM)
    Client->>Client: Parsea el JSON y actualiza el estado de la aplicación
    Client->>User: Muestra la interfaz con los datos del usuario
```

**Descripción del Flujo:**

1.  **Entrada de Credenciales:** El usuario introduce su nombre de usuario y contraseña en la interfaz.
2.  **Derivación de Clave:** El cliente utiliza `crypto.pbkdf2Sync` para derivar una clave maestra a partir de la contraseña y el nombre de usuario (usado como _salt_). También genera un `hmacId` determinístico para identificar al usuario en la base de datos.
3.  **Petición de Datos:** El cliente realiza una petición a un endpoint del Worker, pasando el `hmacId` como identificador.
4.  **Acceso a DB:** El Worker consulta la base de datos D1 para obtener el blob de datos encriptado (`encryptedData`) que corresponde a ese `hmacId`.
5.  **Desencriptación:** El cliente recibe el blob y lo desencripta usando la clave maestra generada en el paso 2.
6.  **Hidratación del Estado:** El JSON resultante se utiliza para poblar el estado de la aplicación (tareas, miembros, etc.), renderizando la interfaz.

---

## 2. Flujo de Exportación de Configuración

El usuario puede exportar su estado actual a un archivo `.json` encriptado.

```mermaid
sequenceDiagram
    participant User as Usuario
    participant Client as Cliente (Navegador)

    User->>Client: Clic en "Exportar Configuración"
    Client->>Client: Recopila el estado actual (tareas, miembros, etc.)
    Client->>Client: Lo serializa a un string JSON
    Client->>Client: Encripta el JSON con la `masterKey` (AES-256-GCM)
    Client->>Client: Crea un Blob con el contenido encriptado (Base64)
    Client->>User: Descarga el archivo `config.json`
```

**Descripción del Flujo:**

1.  **Acción de Usuario:** El usuario inicia la exportación.
2.  **Serialización:** La aplicación recopila el estado actual de todos los módulos y lo convierte en un string JSON.
3.  **Encriptación:** Este string se encripta usando la misma `masterKey` del usuario.
4.  **Generación de Archivo:** Se genera un archivo descargable que contiene los datos encriptados, listo para ser guardado o compartido. La importación seguiría el proceso inverso.

**Navegación:**

- Volver al Mapa de Arquitectura: 00_ARCHITECTURE_MAP.md
- Explora los módulos: 02_MODULE_INDEX.md
