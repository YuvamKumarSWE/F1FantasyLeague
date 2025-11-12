# F1FantasyLeague

## Environment Configuration

### Server Configuration

The server uses environment variables for configuration. Copy `server/.env.example` to `server/.env` and configure as needed.

#### CORS Configuration

The server supports configurable CORS origins for security:

- **`ALLOWED_ORIGINS`**: Comma-separated list of allowed origins (e.g., `http://localhost:5173,https://myapp.com`)
- **`ALLOW_VERCEL_ORIGINS`**: Set to `true` to allow all Vercel preview deployments (`*.vercel.app`)
  - Default: `false`
  - **Security Note**: For production environments, it's recommended to specify exact Vercel URLs in `ALLOWED_ORIGINS` instead of using this wildcard option
  - Useful for development/staging where you have multiple Vercel preview deployments

**Example configurations:**

```bash
# Development with Vercel previews
ALLOWED_ORIGINS=http://localhost:5173
ALLOW_VERCEL_ORIGINS=true

# Production (recommended - explicit URLs)
ALLOWED_ORIGINS=https://myapp.com,https://my-production-app.vercel.app
ALLOW_VERCEL_ORIGINS=false
```
