# Troubleshooting

## Common Issues

### Cannot Connect to Database

**Error:** `Can't reach database server`

**Solution:**

1. Ensure PostgreSQL is running:
   ```bash
   docker compose up -d db
   ```

2. Check DATABASE_URL in `.env`:
   ```
   DATABASE_URL=postgresql://user:password@localhost:5432/nexaboard?schema=public
   ```

3. Run migrations:
   ```bash
   pnpm db:migrate
   ```

### Redis Connection Error

**Error:** `Redis connection refused`

**Solution:**

1. Ensure Redis is running:
   ```bash
   docker compose up -d redis
   ```

2. Check REDIS_URL in `.env`:
   ```
   REDIS_URL=redis://localhost:6379
   ```

### Authentication Errors

**Error:** `401 Unauthorized`

**Solution:**

1. Ensure you're including the Authorization header:
   ```
   Authorization: Bearer <token>
   ```

2. Check if token has expired:
   - Tokens expire after 15 minutes
   - Use refresh token to get new access token

3. Verify JWT_SECRET matches between services

### Build Failures

**Error:** `Build failed with errors`

**Solution:**

1. Clear node_modules and reinstall:
   ```bash
   rm -rf node_modules
   pnpm install
   ```

2. Check TypeScript errors:
   ```bash
   pnpm build
   ```

3. Verify all environment variables are set

### Port Already in Use

**Error:** `Port 3000 already in use`

**Solution:**

1. Find process using the port:
   ```bash
   lsof -i :3000
   ```

2. Kill the process:
   ```bash
   kill <PID>
   ```

3. Or use a different port:
   ```bash
   PORT=3001 pnpm dev
   ```

## Performance Issues

### Slow API Responses

1. Check database queries:
   ```bash
   pnpm db:studio
   ```

2. Review Prisma queries for N+1 problems

3. Add database indexes if needed

### Frontend Loading Slowly

1. Check bundle size:
   ```bash
   pnpm build
   ```

2. Use Next.js dynamic imports for heavy components

3. Enable compression in production

## Getting Help

1. Check the [API Documentation](../api/authentication.md)
2. Review the [README](../../README.md)
3. Open an issue on GitHub
