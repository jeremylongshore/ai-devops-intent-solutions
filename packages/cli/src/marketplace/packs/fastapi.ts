/**
 * FastAPI Template Pack
 * Templates optimized for FastAPI/Python applications
 */

import type { CustomTemplate } from '../../enterprise/templates/types.js';

export const FASTAPI_TEMPLATES: CustomTemplate[] = [
  {
    meta: {
      id: 'fastapi-prd',
      name: 'FastAPI Product Requirements',
      description: 'PRD template optimized for FastAPI API applications',
      version: '1.0.0',
      category: 'product',
      scope: 'standard',
      author: 'Intent Solutions',
      tags: ['fastapi', 'python', 'api', 'prd'],
    },
    variables: [
      { name: 'projectName', label: 'Project Name', type: 'string', required: true },
      { name: 'projectDescription', label: 'Description', type: 'text', required: true },
      { name: 'apiType', label: 'API Type', type: 'select', options: [
        { label: 'REST API', value: 'rest' },
        { label: 'GraphQL (with Strawberry)', value: 'graphql' },
        { label: 'WebSocket', value: 'websocket' },
        { label: 'Hybrid', value: 'hybrid' },
      ], default: 'rest' },
      { name: 'database', label: 'Database', type: 'select', options: [
        { label: 'PostgreSQL', value: 'postgres' },
        { label: 'MySQL', value: 'mysql' },
        { label: 'MongoDB', value: 'mongodb' },
        { label: 'SQLite (dev only)', value: 'sqlite' },
      ]},
      { name: 'features', label: 'Features', type: 'multiselect', options: [
        { label: 'Authentication (JWT)', value: 'auth' },
        { label: 'Background Tasks (Celery)', value: 'celery' },
        { label: 'Caching (Redis)', value: 'cache' },
        { label: 'Rate Limiting', value: 'ratelimit' },
        { label: 'File Upload', value: 'upload' },
        { label: 'WebSockets', value: 'websocket' },
        { label: 'OpenAPI Documentation', value: 'openapi' },
      ]},
      { name: 'deployment', label: 'Deployment Target', type: 'select', options: [
        { label: 'Docker/Kubernetes', value: 'docker' },
        { label: 'AWS Lambda', value: 'lambda' },
        { label: 'Google Cloud Run', value: 'cloudrun' },
        { label: 'Railway/Render', value: 'paas' },
      ]},
    ],
    sections: [
      {
        id: 'overview',
        title: 'Product Overview',
        order: 1,
        content: `# {{projectName}}

## Overview
{{projectDescription}}

### Technology Stack
- **Framework:** FastAPI
- **API Type:** {{apiType}}
- **Database:** {{database}}
- **Deployment:** {{deployment}}

### Key Features
{{#each features}}
- {{this}}
{{/each}}`,
      },
      {
        id: 'architecture',
        title: 'Technical Architecture',
        order: 2,
        content: `## Technical Architecture

### Project Structure
\`\`\`
{{projectName}}/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI app entry
│   ├── config.py            # Settings (pydantic-settings)
│   ├── api/
│   │   ├── __init__.py
│   │   ├── deps.py          # Dependencies
│   │   └── v1/
│   │       ├── __init__.py
│   │       ├── router.py    # API router
│   │       └── endpoints/   # Route handlers
│   ├── core/
│   │   ├── security.py      # Auth utilities
│   │   └── exceptions.py    # Custom exceptions
│   ├── models/              # SQLAlchemy/Pydantic models
│   ├── schemas/             # Pydantic schemas
│   ├── crud/                # Database operations
│   └── services/            # Business logic
├── tests/
├── alembic/                 # Database migrations
├── pyproject.toml
├── Dockerfile
└── docker-compose.yml
\`\`\`

### Design Patterns
- **Repository Pattern:** CRUD operations abstracted
- **Service Layer:** Business logic separation
- **Dependency Injection:** FastAPI's Depends()
- **Async First:** async/await throughout`,
      },
      {
        id: 'endpoints',
        title: 'API Endpoints',
        order: 3,
        content: `## API Endpoints

### Base URL
- Development: \`http://localhost:8000\`
- Production: \`https://api.{{projectName}}.com\`

### Versioning
API versioned via URL path: \`/api/v1/\`

### Core Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /health | Health check |
| GET | /api/v1/docs | OpenAPI documentation |
| GET | /api/v1/redoc | ReDoc documentation |

{{#if (contains features "auth")}}
### Authentication Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/v1/auth/register | User registration |
| POST | /api/v1/auth/login | Get access token |
| POST | /api/v1/auth/refresh | Refresh token |
| GET | /api/v1/auth/me | Current user |
{{/if}}

### Resource Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/v1/resources | List resources |
| POST | /api/v1/resources | Create resource |
| GET | /api/v1/resources/{id} | Get resource |
| PATCH | /api/v1/resources/{id} | Update resource |
| DELETE | /api/v1/resources/{id} | Delete resource |`,
      },
      {
        id: 'auth',
        title: 'Authentication',
        order: 4,
        condition: { variable: 'features', operator: 'contains', value: 'auth' },
        content: `## Authentication

### JWT Configuration
\`\`\`python
# app/core/security.py
from datetime import datetime, timedelta
from jose import jwt

SECRET_KEY = settings.secret_key
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
\`\`\`

### Protected Routes
\`\`\`python
from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=401,
        detail="Could not validate credentials",
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    return await get_user(user_id)
\`\`\``,
      },
      {
        id: 'database',
        title: 'Database',
        order: 5,
        content: `## Database Design

### ORM: SQLAlchemy 2.0
\`\`\`python
# app/models/base.py
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column
from sqlalchemy import DateTime, func
from uuid import UUID, uuid4

class Base(DeclarativeBase):
    pass

class TimestampMixin:
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), onupdate=func.now()
    )
\`\`\`

### Async Database Session
\`\`\`python
# app/db/session.py
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker

engine = create_async_engine(settings.database_url, echo=True)
AsyncSessionLocal = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
\`\`\`

### Migrations (Alembic)
\`\`\`bash
# Generate migration
alembic revision --autogenerate -m "description"

# Apply migrations
alembic upgrade head
\`\`\``,
      },
      {
        id: 'deployment',
        title: 'Deployment',
        order: 6,
        content: `## Deployment

{{#if (equals deployment "docker")}}
### Docker Configuration
\`\`\`dockerfile
# Dockerfile
FROM python:3.12-slim

WORKDIR /app

# Install dependencies
COPY pyproject.toml poetry.lock ./
RUN pip install poetry && poetry install --no-dev

# Copy application
COPY app ./app

# Run with Uvicorn
CMD ["poetry", "run", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
\`\`\`

### Docker Compose
\`\`\`yaml
version: '3.8'
services:
  api:
    build: .
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://user:pass@db:5432/app
    depends_on:
      - db
      - redis
  db:
    image: postgres:16
    volumes:
      - postgres_data:/var/lib/postgresql/data
  redis:
    image: redis:7-alpine
volumes:
  postgres_data:
\`\`\`
{{/if}}

{{#if (equals deployment "cloudrun")}}
### Google Cloud Run
\`\`\`yaml
# cloudbuild.yaml
steps:
  - name: 'gcr.io/cloud-builders/docker'
    args: ['build', '-t', 'gcr.io/$PROJECT_ID/{{projectName}}', '.']
  - name: 'gcr.io/cloud-builders/docker'
    args: ['push', 'gcr.io/$PROJECT_ID/{{projectName}}']
  - name: 'gcr.io/google.com/cloudsdktool/cloud-sdk'
    args:
      - 'run'
      - 'deploy'
      - '{{projectName}}'
      - '--image=gcr.io/$PROJECT_ID/{{projectName}}'
      - '--region=us-central1'
      - '--platform=managed'
      - '--allow-unauthenticated'
\`\`\`
{{/if}}

### Environment Variables
\`\`\`env
# .env
DATABASE_URL=
SECRET_KEY=
REDIS_URL=
ENVIRONMENT=production
\`\`\``,
      },
    ],
  },
  {
    meta: {
      id: 'fastapi-architecture',
      name: 'FastAPI Architecture Document',
      description: 'Technical architecture for FastAPI applications',
      version: '1.0.0',
      category: 'technical',
      scope: 'comprehensive',
      author: 'Intent Solutions',
      tags: ['fastapi', 'python', 'architecture'],
    },
    variables: [
      { name: 'projectName', label: 'Project Name', type: 'string', required: true },
      { name: 'scale', label: 'Expected Scale', type: 'select', options: [
        { label: 'Small (< 100 req/s)', value: 'small' },
        { label: 'Medium (100-1000 req/s)', value: 'medium' },
        { label: 'Large (1000+ req/s)', value: 'large' },
      ]},
    ],
    sections: [
      {
        id: 'overview',
        title: 'Architecture Overview',
        order: 1,
        content: `# {{projectName}} Architecture

**Scale Target:** {{scale}}

## Architecture Principles
1. **Async-first** - Non-blocking I/O throughout
2. **Type-safe** - Pydantic validation everywhere
3. **Testable** - Dependency injection for mocking
4. **Observable** - Structured logging and metrics
5. **Secure by default** - Input validation, output encoding`,
      },
      {
        id: 'patterns',
        title: 'Design Patterns',
        order: 2,
        content: `## Design Patterns

### Service Layer Pattern
\`\`\`python
# app/services/user_service.py
class UserService:
    def __init__(self, db: AsyncSession, cache: Redis):
        self.db = db
        self.cache = cache
        self.repo = UserRepository(db)

    async def get_user(self, user_id: UUID) -> User:
        # Check cache first
        cached = await self.cache.get(f"user:{user_id}")
        if cached:
            return User.model_validate_json(cached)

        # Get from database
        user = await self.repo.get(user_id)
        if not user:
            raise NotFoundException("User not found")

        # Cache for next time
        await self.cache.setex(f"user:{user_id}", 3600, user.model_dump_json())
        return user
\`\`\`

### Repository Pattern
\`\`\`python
# app/crud/base.py
from typing import Generic, TypeVar

ModelType = TypeVar("ModelType", bound=Base)
CreateSchemaType = TypeVar("CreateSchemaType", bound=BaseModel)
UpdateSchemaType = TypeVar("UpdateSchemaType", bound=BaseModel)

class CRUDBase(Generic[ModelType, CreateSchemaType, UpdateSchemaType]):
    def __init__(self, model: type[ModelType]):
        self.model = model

    async def get(self, db: AsyncSession, id: UUID) -> ModelType | None:
        return await db.get(self.model, id)

    async def get_multi(
        self, db: AsyncSession, *, skip: int = 0, limit: int = 100
    ) -> list[ModelType]:
        result = await db.execute(
            select(self.model).offset(skip).limit(limit)
        )
        return result.scalars().all()
\`\`\`

### Dependency Injection
\`\`\`python
# app/api/deps.py
async def get_user_service(
    db: AsyncSession = Depends(get_db),
    cache: Redis = Depends(get_redis),
) -> UserService:
    return UserService(db=db, cache=cache)

# In route handler
@router.get("/{user_id}")
async def get_user(
    user_id: UUID,
    service: UserService = Depends(get_user_service),
):
    return await service.get_user(user_id)
\`\`\``,
      },
      {
        id: 'error-handling',
        title: 'Error Handling',
        order: 3,
        content: `## Error Handling

### Custom Exception Classes
\`\`\`python
# app/core/exceptions.py
class AppException(Exception):
    def __init__(self, message: str, code: str, status_code: int = 400):
        self.message = message
        self.code = code
        self.status_code = status_code

class NotFoundException(AppException):
    def __init__(self, message: str = "Resource not found"):
        super().__init__(message, "NOT_FOUND", 404)

class ValidationException(AppException):
    def __init__(self, message: str, errors: list[dict] = None):
        super().__init__(message, "VALIDATION_ERROR", 422)
        self.errors = errors or []
\`\`\`

### Exception Handlers
\`\`\`python
# app/main.py
@app.exception_handler(AppException)
async def app_exception_handler(request: Request, exc: AppException):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": {
                "code": exc.code,
                "message": exc.message,
            }
        }
    )

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=422,
        content={
            "error": {
                "code": "VALIDATION_ERROR",
                "message": "Invalid request data",
                "details": exc.errors(),
            }
        }
    )
\`\`\``,
      },
      {
        id: 'middleware',
        title: 'Middleware',
        order: 4,
        content: `## Middleware Stack

### Middleware Configuration
\`\`\`python
# app/main.py
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Compression
app.add_middleware(GZipMiddleware, minimum_size=1000)

# Request ID
@app.middleware("http")
async def add_request_id(request: Request, call_next):
    request_id = request.headers.get("X-Request-ID", str(uuid4()))
    with structlog.contextvars.bind_contextvars(request_id=request_id):
        response = await call_next(request)
        response.headers["X-Request-ID"] = request_id
        return response

# Timing
@app.middleware("http")
async def add_timing(request: Request, call_next):
    start = time.perf_counter()
    response = await call_next(request)
    duration = time.perf_counter() - start
    response.headers["X-Response-Time"] = f"{duration:.3f}s"
    return response
\`\`\``,
      },
    ],
  },
  {
    meta: {
      id: 'fastapi-testing',
      name: 'FastAPI Testing Strategy',
      description: 'Testing strategy for FastAPI applications',
      version: '1.0.0',
      category: 'testing',
      scope: 'standard',
      author: 'Intent Solutions',
      tags: ['fastapi', 'python', 'testing', 'pytest'],
    },
    variables: [
      { name: 'projectName', label: 'Project Name', type: 'string', required: true },
    ],
    sections: [
      {
        id: 'overview',
        title: 'Testing Strategy',
        order: 1,
        content: `# {{projectName}} Testing Strategy

## Testing Pyramid
- **Unit Tests:** 70% - Business logic, utilities
- **Integration Tests:** 20% - API endpoints, database
- **E2E Tests:** 10% - Critical user flows

## Tools
- **Test Framework:** pytest
- **Async Support:** pytest-asyncio
- **HTTP Client:** httpx (AsyncClient)
- **Database:** pytest-postgresql
- **Coverage:** pytest-cov`,
      },
      {
        id: 'fixtures',
        title: 'Test Fixtures',
        order: 2,
        content: `## Test Fixtures

### conftest.py
\`\`\`python
# tests/conftest.py
import pytest
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker

from app.main import app
from app.db.base import Base
from app.api.deps import get_db

# Test database
TEST_DATABASE_URL = "postgresql+asyncpg://test:test@localhost:5432/test"

@pytest.fixture(scope="session")
def event_loop():
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()

@pytest.fixture(scope="session")
async def engine():
    engine = create_async_engine(TEST_DATABASE_URL)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield engine
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
    await engine.dispose()

@pytest.fixture
async def db(engine):
    async_session = sessionmaker(engine, class_=AsyncSession)
    async with async_session() as session:
        yield session
        await session.rollback()

@pytest.fixture
async def client(db):
    def override_get_db():
        yield db

    app.dependency_overrides[get_db] = override_get_db
    async with AsyncClient(app=app, base_url="http://test") as client:
        yield client
    app.dependency_overrides.clear()
\`\`\``,
      },
      {
        id: 'unit-tests',
        title: 'Unit Tests',
        order: 3,
        content: `## Unit Tests

### Service Tests
\`\`\`python
# tests/unit/test_user_service.py
import pytest
from unittest.mock import AsyncMock, MagicMock

from app.services.user_service import UserService
from app.schemas.user import UserCreate

@pytest.fixture
def mock_db():
    return AsyncMock()

@pytest.fixture
def mock_cache():
    cache = MagicMock()
    cache.get = AsyncMock(return_value=None)
    cache.setex = AsyncMock()
    return cache

@pytest.fixture
def service(mock_db, mock_cache):
    return UserService(db=mock_db, cache=mock_cache)

@pytest.mark.asyncio
async def test_create_user(service, mock_db):
    user_data = UserCreate(email="test@example.com", password="password123")

    result = await service.create_user(user_data)

    assert result.email == "test@example.com"
    mock_db.add.assert_called_once()
    mock_db.commit.assert_called_once()

@pytest.mark.asyncio
async def test_get_user_from_cache(service, mock_cache):
    mock_cache.get.return_value = '{"id": "123", "email": "test@example.com"}'

    result = await service.get_user("123")

    assert result.email == "test@example.com"
    mock_cache.get.assert_called_once_with("user:123")
\`\`\``,
      },
      {
        id: 'integration-tests',
        title: 'Integration Tests',
        order: 4,
        content: `## Integration Tests

### API Tests
\`\`\`python
# tests/integration/test_api_users.py
import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_create_user(client: AsyncClient):
    response = await client.post(
        "/api/v1/users",
        json={"email": "test@example.com", "password": "password123"}
    )

    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "test@example.com"
    assert "id" in data

@pytest.mark.asyncio
async def test_create_user_duplicate_email(client: AsyncClient):
    # Create first user
    await client.post(
        "/api/v1/users",
        json={"email": "test@example.com", "password": "password123"}
    )

    # Try to create duplicate
    response = await client.post(
        "/api/v1/users",
        json={"email": "test@example.com", "password": "password456"}
    )

    assert response.status_code == 409
    assert response.json()["error"]["code"] == "DUPLICATE_EMAIL"

@pytest.mark.asyncio
async def test_get_user_not_found(client: AsyncClient):
    response = await client.get("/api/v1/users/00000000-0000-0000-0000-000000000000")

    assert response.status_code == 404
\`\`\``,
      },
    ],
  },
];

export default FASTAPI_TEMPLATES;
