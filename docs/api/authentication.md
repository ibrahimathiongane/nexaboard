# Authentication

## Overview

nexaBoard uses JWT (JSON Web Tokens) for authentication. All API requests require a valid access token.

## Registration

### POST /api/v1/auth/register

Register a new user account.

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response:**

```json
{
  "user": {
    "id": "user-1",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

## Login

### POST /api/v1/auth/login

Authenticate an existing user.

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response:**

```json
{
  "user": {
    "id": "user-1",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

## Token Refresh

### POST /api/v1/auth/refresh

Refresh an expired access token.

**Request Body:**

```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Response:**

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

## Using Tokens

Include the access token in the Authorization header:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

## Password Reset

### POST /api/v1/auth/forgot-password

Request a password reset email.

**Request Body:**

```json
{
  "email": "user@example.com"
}
```

### POST /api/v1/auth/reset-password

Reset password with token.

**Request Body:**

```json
{
  "token": "reset-token",
  "password": "newpassword"
}
```

## Email Verification

### POST /api/v1/auth/verify-email

Verify email address with token.

**Request Body:**

```json
{
  "token": "verification-token"
}
```
