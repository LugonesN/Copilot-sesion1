# Backend – JWT Auth API

API REST construida con **Python**, **FastAPI** y **Poetry** que implementa autenticación mediante **JSON Web Tokens (JWT)**.

---

## Características

| Característica | Detalle |
|---|---|
| Framework | FastAPI 0.115 |
| Gestión de dependencias | Poetry |
| Algoritmo JWT | HS256 |
| Expiración del access token | 300 segundos |
| Expiración del refresh token | 3 600 segundos |
| Credenciales por defecto | usuario: `admin` / contraseña: `admin123` |

---

## Estructura del proyecto

```
backend/
├── app/
│   ├── auth/
│   │   ├── __init__.py
│   │   ├── router.py      # Endpoints /auth/login y /auth/refresh
│   │   └── schemas.py     # Modelos Pydantic de request/response
│   ├── core/
│   │   ├── __init__.py
│   │   ├── config.py      # Configuración via variables de entorno
│   │   └── security.py    # Lógica de creación y verificación de tokens
│   ├── __init__.py
│   └── main.py            # Punto de entrada de la aplicación
├── Dockerfile
├── docker-compose.yml
├── pyproject.toml
└── README.md
```

---

## Endpoints

### `POST /auth/login`

Autentica al usuario y devuelve un par de tokens JWT.

**Request body**

```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Response (200 OK)**

```json
{
  "access_token": "<jwt>",
  "refresh_token": "<jwt>",
  "token_type": "bearer",
  "expires_in": 300
}
```

**Response (401 Unauthorized)**

```json
{
  "detail": "Incorrect username or password"
}
```

---

### `POST /auth/refresh`

Emite un nuevo par de tokens a partir de un refresh token válido.

**Request body**

```json
{
  "refresh_token": "<jwt>"
}
```

**Response (200 OK)** – misma estructura que `/auth/login`.

**Response (401 Unauthorized)** – token inválido o expirado.

---

### `GET /health`

Comprueba que el servicio está en funcionamiento.

**Response (200 OK)**

```json
{
  "status": "ok"
}
```

---

## Documentación interactiva

Una vez levantado el servidor, accede a:

- **Swagger UI**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **ReDoc**: [http://localhost:8000/redoc](http://localhost:8000/redoc)

---

## Ejecución con Docker (recomendado)

### Requisitos previos

- [Docker](https://docs.docker.com/get-docker/) ≥ 24
- [Docker Compose](https://docs.docker.com/compose/) ≥ 2

### Pasos

```bash
# Desde la carpeta backend/
cd backend

# 1. Crear el archivo de variables de entorno a partir del ejemplo
cp .env.example .env
# Edita .env y establece un SECRET_KEY seguro y la contraseña de administrador

# 2. Construir la imagen y levantar el contenedor
docker compose up --build

# En segundo plano
docker compose up --build -d

# Detener
docker compose down
```

La API quedará disponible en **http://localhost:8000**.

---

## Ejecución local con Poetry

### Requisitos previos

- Python 3.12+
- [Poetry](https://python-poetry.org/docs/#installation)

### Pasos

```bash
# Desde la carpeta backend/
cd backend

# Instalar dependencias
poetry install

# Iniciar el servidor de desarrollo
poetry run uvicorn app.main:app --reload
```

---

## Variables de entorno

| Variable | Valor por defecto | Descripción |
|---|---|---|
| `SECRET_KEY` | `supersecretkey-change-in-production` | Clave secreta para firmar los tokens |
| `ALGORITHM` | `HS256` | Algoritmo de firma JWT |
| `ACCESS_TOKEN_EXPIRE_SECONDS` | `300` | Tiempo de vida del access token (segundos) |
| `REFRESH_TOKEN_EXPIRE_SECONDS` | `3600` | Tiempo de vida del refresh token (segundos) |
| `ADMIN_USERNAME` | `admin` | Nombre de usuario del administrador |
| `ADMIN_PASSWORD` | `admin123` | Contraseña del administrador |

> ⚠️ En producción, establece `SECRET_KEY` con un valor aleatorio seguro y no expongas las credenciales en el `docker-compose.yml`.

---

## Ejemplo de uso con `curl`

```bash
# 1. Obtener tokens
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# 2. Refrescar tokens (sustituye <refresh_token> por el valor recibido)
curl -X POST http://localhost:8000/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{"refresh_token":"<refresh_token>"}'
```
