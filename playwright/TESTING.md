# Playwright E2E Testing Guide

## Running Tests

### Quick Start
```bash
npm run test:e2e
```

This command will:
1. Start the frontend (port 3000) and backend (port 3001) servers
2. Wait for both servers to be ready
3. Run all Playwright tests
4. Clean up by stopping the servers

### Run Specific Tests
```bash
npm run test:e2e -- playwright/tests/ui/signup/successful-signup.spec.ts
```

### Run Specific Browser
```bash
npm run test:e2e -- --project=chromium
```

## Manual Server Startup (Alternative)

If you prefer to start servers manually:

1. Start servers:
```bash
npm run start:ci
```

2. Run tests in another terminal:
```bash
npm run test
```

## Configuration

### playwright.config.ts
- **Base URL**: http://localhost:3000
- **Workers**: 1 (to avoid race conditions)
- **Test ID Attribute**: `data-test`

### Environment Variables
- **PORT**: 3000 (frontend)
- **VITE_BACKEND_PORT**: 3001 (backend)
- **NODE_ENV**: test

## Known Issues

1. **Button Navigation**: The "Go to Sign In" button on the signup success page doesn't trigger navigation in the test environment. The test uses direct navigation (`page.goto()`) as a workaround.

2. **webServer Configuration**: The webServer configuration in playwright.config.ts is disabled because environment variables aren't loaded correctly when starting servers this way. Use `npm run test:e2e` instead.

## Test Files

### Signup Tests
- `playwright/tests/ui/signup/successful-signup.spec.ts`
  - Test 1.1: User successfully signs up with valid credentials
  - Test 1.2: User navigates to Sign In page from Sign Up

## Troubleshooting

### Tests Fail with "Backend not responding"
- Ensure backend port 3001 is available
- Check that VITE_BACKEND_PORT=3001 is set in .env
- Verify no other processes are using the ports

### Cleanup Warnings
SIGTERM errors during server shutdown are harmless and can be ignored.

### Port Already in Use
```bash
lsof -ti:3000 | xargs kill -9  # Kill frontend
lsof -ti:3001 | xargs kill -9  # Kill backend
```
