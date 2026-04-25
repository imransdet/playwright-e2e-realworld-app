# CI/CD Pipeline Documentation

## Overview

This project uses a comprehensive CI/CD pipeline built with GitHub Actions and Netlify to ensure every Pull Request is fully validated before merging into the `main` branch.

## Architecture

```
                    ┌─────────────────────────────────┐
                    │        Dev Branch (push)         │
                    │   playwright-ci.yml (quick CI)   │
                    │   lint · types · build · unit    │
                    └─────────────────────────────────┘

 ┌──────────────────────────────────────────────────────────────────────┐
 │                     PR to main (pr-validation.yml)                   │
 │                                                                      │
 │  ┌─────────────┐   ┌──────────┐   ┌────────────────┐               │
 │  │   Static     │──▶│  Build   │──▶│ Preview Deploy │──┐            │
 │  │   Checks     │   │          │   │ & Smoke Test   │  │            │
 │  │ (lint,types, │   │          │   │ (Netlify)      │  │            │
 │  │  unit tests) │   │          │   │                │  │            │
 │  └─────────────┘   └──────────┘   └────────────────┘  │            │
 │         │                │                            │            │
 │         │           ┌────┴──────────┐                │            │
 │         │           │  E2E Tests    │                │            │
 │         │           │  (Playwright) │                │            │
 │         │           │  Full-stack   │                │            │
 │         │           └──────────────┘                │            │
 │         │                │                           ▼            │
 │         │                │              ┌────────────────────┐     │
 │         └────────────────┼─────────────▶│  Report Status     │     │
 │                          │              │  (PR Comment)       │     │
 │                          │              └────────┬───────────┘     │
 │                          │                       │                  │
 │                          └───────────┬───────────┘                  │
 │                                      ▼                              │
 │                          ┌────────────────────┐                    │
 │                          │ Auto Approve/Merge │ (dev→main only)    │
 │                          └────────────────────┘                    │
 └──────────────────────────────────────────────────────────────────────┘

                    ┌─────────────────────────────────┐
                    │    Merge to main (push)          │
                    │   production-deploy.yml          │
                    │   Wait for deploy · Smoke test   │
                    │   Notify on failure (auto-issue) │
                    └─────────────────────────────────┘
```

## Workflow Files

| File | Trigger | Purpose |
|------|---------|---------|
| `.github/workflows/pr-validation.yml` | PR to `main` | Full PR validation pipeline |
| `.github/workflows/production-deploy.yml` | Push to `main` | Post-merge production health check |
| `.github/workflows/playwright-ci.yml` | Push to `dev` | Quick feedback during development |

---

## Pipeline 1: PR Validation (`pr-validation.yml`)

### Trigger
- **On:** Pull Request targeting `main`
- **Types:** opened, synchronize, reopened

### Jobs

#### Job 1: Static Checks
Runs lint, format, type check, and unit tests in parallel-friendly order.

| Step | Command | Fail Fast |
|------|---------|-----------|
| ESLint | `yarn eslint` | Yes |
| Prettier | `yarn prettier --check` | Yes |
| TypeScript | `yarn types` | Yes |
| Unit Tests | `yarn test:unit:ci` | Yes |

#### Job 2: Build Application
Builds the frontend application and uploads build artifacts for downstream jobs.

| Step | Command |
|------|---------|
| Build | `yarn build` |
| Upload | Build artifacts saved for E2E job |

#### Job 3: Preview Deploy & Smoke Test
Waits for Netlify to deploy the PR preview and validates it serves correctly.

- **Preview URL format:** `https://deploy-preview-{PR_NUMBER}--realworldapp.netlify.app`
- **Checks:** HTTP 200, React root element, static assets

#### Job 4: E2E Tests (Playwright)
Runs full-stack E2E tests against a local CI environment with:
- Seeded database
- Backend API server (Express on port 3001)
- Frontend proxy server (on port 3000)
- Chromium browser only (for CI speed)

**Playwright CI features:**
- 2 retries on failure
- Traces captured on first retry
- HTML report generated
- Artifacts uploaded (30-day retention)

#### Job 5: Report PR Status
Always runs, posts a summary comment on the PR with:
- Preview URL
- Status of each check (pass/fail)
- Link to the workflow run
- Updates existing comment (no duplicates)

#### Job 6: Auto Approve & Merge
Only triggers for PRs from `dev` branch when all checks pass:
- Auto-approves the PR
- Enables auto-merge with squash

### Concurrency
- Only one pipeline per PR at a time
- Previous runs are cancelled on new pushes

---

## Pipeline 2: Production Deploy (`production-deploy.yml`)

### Trigger
- **On:** Push to `main` (post-merge)

### Jobs

| Job | Purpose |
|-----|---------|
| Wait for Deploy | Polls production URL until Netlify deploy is live |
| Smoke Test | Validates page loads, React root, assets, security headers |
| Notify on Failure | Auto-creates a GitHub issue if deployment fails |

---

## Pipeline 3: Dev Branch CI (`playwright-ci.yml`)

### Trigger
- **On:** Push to `dev`

Provides quick feedback during development with lint, type check, build, and unit tests.

---

## Setup Instructions

### 1. GitHub Repository Configuration

#### Required Secrets
Add these in **Settings → Secrets and variables → Actions**:

| Secret | Description | Required |
|--------|-------------|----------|
| `NETLIFY_AUTH_TOKEN` | Netlify personal access token | No (fallback to auto-deploy wait) |
| `NETLIFY_SITE_ID` | Netlify site ID | No (fallback to auto-deploy wait) |

> **Note:** If Netlify secrets are not configured, the pipeline will wait for Netlify's automatic deploy previews instead.

#### Netlify Setup (Recommended)
1. Connect your GitHub repo to Netlify
2. Enable "Deploy previews" in Netlify site settings
3. (Optional) Create a personal access token at https://app.netlify.com/user/applications/personal

### 2. Branch Protection

Run the included setup script:
```bash
./scripts/setup-branch-protection.sh
```

Or manually configure in **Settings → Branches → Branch protection rules** for `main`:

- [x] Require a pull request before merging (1 approval)
- [x] Dismiss stale pull request reviews when new commits are pushed
- [x] Require status checks to pass before merging
  - `Lint, Types & Unit Tests`
  - `Build Application`
  - `Preview Deploy & Smoke Test`
  - `E2E Tests (Playwright)`
  - `Report PR Status`
- [x] Require branches to be up to date before merging
- [x] Require conversation resolution before merging
- [x] Include administrators

### 3. Verify Setup

1. Create a test PR from `dev` to `main`
2. Check that all CI jobs appear in the PR checks
3. Verify the PR comment with status summary
4. Confirm the preview URL is accessible

---

## Workflow Diagrams

### PR Lifecycle
```
Developer pushes to dev branch
        │
        ▼
  Dev CI runs (quick feedback)
        │
  Developer creates PR to main
        │
        ▼
  PR Validation Pipeline starts
        │
  ┌─────┴─────┐
  │            │
  Static    Build ──▶ Preview Deploy
  Checks      │         │
              │    ┌────┴────┐
              │    │         │
              │  Smoke    E2E Tests
              │  Test     (Playwright)
              │    │         │
              └────┴────┬────┘
                       │
                  Report Status
                  (PR Comment)
                       │
              ┌────────┴────────┐
              │                 │
           All Pass        Any Fail
              │                 │
         Auto Approve     Block Merge
         Auto Merge       (Fix required)
              │
         Merge to Main
              │
         Production Deploy
         Health Check
```

---

## Artifacts

| Artifact | Content | Retention | When |
|----------|---------|-----------|------|
| `build-output` | Vite build output | 7 days | Build job |
| `playwright-report` | HTML report + test results | 30 days | E2E job (always) |
| `playwright-traces` | Trace files for debugging | 30 days | E2E job (on failure) |

---

## Troubleshooting

### Preview deployment not ready
- Ensure Netlify is connected to the repository
- Check Netlify deploy logs for build errors
- Verify `netlify.toml` build command is correct

### E2E tests failing
- Check Playwright report artifacts for details
- Download trace files and open with `npx playwright show-trace`
- Verify database seeding completed successfully
- Check server logs in the GitHub Actions log

### Branch protection not enforcing
- Verify the status check names match exactly
- Ensure "Require status checks" is enabled in branch protection
- Check that workflow job names match the protection rule context names

### Auto-merge not working
- Ensure the PR is from the `dev` branch
- Verify all checks passed
- Check that `GITHUB_TOKEN` has write permissions
- Enable "Allow auto-merge" in repository settings

---

## Optional Enhancements

- **Playwright sharding:** Split E2E tests across multiple runners
- **Performance checks:** Add Lighthouse CI or k6 load tests
- **Visual regression:** Integrate Percy (already in devDependencies)
- **Slack notifications:** Add Slack webhook for failure alerts
- **Multiple browsers:** Enable Firefox and WebKit in CI
