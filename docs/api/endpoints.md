# API Endpoints

## Base URL

```
http://localhost:4000/api/v1
```

## Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /auth/register | Register new user |
| POST | /auth/login | Login user |
| POST | /auth/refresh | Refresh token |
| POST | /auth/logout | Logout user |
| GET | /auth/profile | Get user profile |
| POST | /auth/forgot-password | Request password reset |
| POST | /auth/reset-password | Reset password |
| POST | /auth/verify-email | Verify email |

## Workspace Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /workspaces | Create workspace |
| GET | /workspaces | List user workspaces |
| GET | /workspaces/:id | Get workspace |
| PATCH | /workspaces/:id | Update workspace |
| DELETE | /workspaces/:id | Delete workspace |
| GET | /workspaces/:id/members | List workspace members |
| POST | /workspaces/:id/members | Add member |
| DELETE | /workspaces/:id/members/:memberId | Remove member |

## Project Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /workspaces/:workspaceId/projects | Create project |
| GET | /workspaces/:workspaceId/projects | List projects |
| GET | /projects/:id | Get project |
| PATCH | /projects/:id | Update project |
| DELETE | /projects/:id | Delete project |

## Task Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /projects/:projectId/tasks | Create task |
| GET | /projects/:projectId/tasks | List tasks |
| GET | /tasks/:id | Get task |
| PATCH | /tasks/:id | Update task |
| DELETE | /tasks/:id | Delete task |
| POST | /tasks/:id/assign | Assign user |
| DELETE | /tasks/:id/assign/:assigneeId | Unassign user |
| POST | /tasks/:id/labels | Add label |
| DELETE | /tasks/:id/labels/:labelId | Remove label |

## Note Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /notes | Create note |
| GET | /notes | List notes |
| GET | /notes/:id | Get note |
| PATCH | /notes/:id | Update note |
| DELETE | /notes/:id | Delete note |

## Calendar Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /calendar | Create event |
| GET | /calendar | List events |
| GET | /calendar/workspace/:workspaceId | List workspace events |
| GET | /calendar/:id | Get event |
| PATCH | /calendar/:id | Update event |
| DELETE | /calendar/:id | Delete event |

## Health Check

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /health | Health check |

## Swagger Documentation

Full API documentation is available at:

```
http://localhost:4000/api/docs
```
