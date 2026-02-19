# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability, please report it via [GitHub Security Advisories](https://github.com/RohanSartho/AI_PM-Interview-Prep/security/advisories).

## Sensitive Data

This repository should NOT contain:
- API keys
- Database credentials
- Supabase project URLs or service role keys
- Personal email addresses
- JWT tokens

All sensitive configuration must be provided through environment variables.

## Environment Variables

See `.env.example` for required variables. Never commit `.env` files.
