# Playwright E2E Real World App 🎭

[![Dev Branch CI](https://github.com/imransdet/playwright-e2e-realworld-app/actions/workflows/playwright-ci.yml/badge.svg)](https://github.com/imransdet/playwright-e2e-realworld-app/actions/workflows/playwright-ci.yml)
[![PR Validation](https://github.com/imransdet/playwright-e2e-realworld-app/actions/workflows/pr-validation.yml/badge.svg)](https://github.com/imransdet/playwright-e2e-realworld-app/actions/workflows/pr-validation.yml)
[![Production Deploy](https://github.com/imransdet/playwright-e2e-realworld-app/actions/workflows/production-deploy.yml/badge.svg)](https://github.com/imransdet/playwright-e2e-realworld-app/actions/workflows/production-deploy.yml)

A portfolio project demonstrating **senior-level Playwright E2E automation** on a full-stack React payment application. Covers Page Object Model architecture, multi-browser execution, test data management, and a full CI/CD pipeline from development to production.

**Live App:** https://realworldapp.netlify.app/

---

## 📋 Table of Contents

- [About the Project](#about-the-project)
- [Tech Stack](#tech-stack)
- [CI/CD Pipeline](#cicd-pipeline)
- [Playwright Test Suite](#playwright-test-suite)
- [Getting Started](#getting-started)
- [Running the Application](#running-the-application)
- [Running Tests](#running-tests)
- [Project Structure](#project-structure)
- [Acknowledgments](#acknowledgments)

---

## 🎯 About the Project

This project was built to showcase real-world Playwright automation practices on a non-trivial full-stack application. The app is a payment platform (sign up, transactions, bank accounts, contacts, notifications) — complex enough to demonstrate meaningful test scenarios.

**What this project demonstrates:**

- ✅ Page Object Model (POM) with clean separation of locators and actions
- ✅ Multi-browser execution (Chromium, Firefox, WebKit)
- ✅ Dynamic test data generation using Faker + JSON persistence
- ✅ Structured test organisation (`tests/ui/`, `pages/`, `helpers/`, `test-data/`)
- ✅ Global setup and teardown hooks
- ✅ End-to-end CI/CD pipeline with GitHub Actions (lint → build → E2E → deploy → health check)

---

## 🛠 Tech Stack

### Application

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript, Material-UI, Vite, XState, React Router |
| Backend | Express.js, TypeScript, LowDB, Passport.js, GraphQL, bcryptjs |
| Database | LowDB (JSON-based, seed-driven) |

### Testing & CI

| Tool | Purpose |
|---|---|
| Playwright | E2E testing — UI, multi-browser |
| Vitest | Unit testing |
| GitHub Actions | CI/CD pipeline (3 workflows) |
| Netlify | Hosting + preview deployments per PR |
| Faker.js | Dynamic test data generation |

---

## 🔄 CI/CD Pipeline

Three GitHub Actions workflows cover the full delivery lifecycle:

### 1. Dev Branch CI (`playwright-ci.yml`)

Triggers on every push to `dev`. Fast feedback loop for ongoing development.

```
push to dev
  └── Lint & Type Check
        └── Build
              └── Unit Tests (parallel)
                    └── Playwright E2E (Chromium)
```

### 2. PR Validation (`pr-validation.yml`)

Triggers on every PR targeting `main`. Full gate before merge.

```
pull_request → main
  └── Static Checks (lint, types, unit tests)
        └── Build
              └── Netlify Preview Deploy
                    └── Playwright E2E (full-stack, local CI environment)
                          └── PR Status Report → Auto-merge (dev → main)
```

### 3. Production Deploy & Health Check (`production-deploy.yml`)

Triggers on merge to `main`. Validates the live production environment post-deploy.

```
merge to main
  └── Wait for Netlify production deploy
        └── Production smoke test (health check on live URL)
```

All Playwright reports and traces are uploaded as GitHub Actions artifacts and retained for 30 days.

---

## 🎭 Playwright Test Suite

### Directory Structure

```
playwright/
├── tests/
│   └── ui/
│       └── signup/
│           └── successful-signup.spec.ts   # Sign up happy path tests
│
├── pages/
│   └── signup.page.ts                      # Page Object Model — signup & success pages
│
├── helpers/
│   └── user-data.helper.ts                 # Load/save/find users in JSON
│
├── config/
│   └── config.ts                           # Base config (URLs, timeouts)
│
├── test-data/
│   └── users.json                          # Persisted test user data
│
├── specs/
│   └── signup-page.plan.md                 # Full test plan (18 scenarios)
│
├── global-setup.ts                         # Global setup hook
├── global-teardown.ts                      # Global teardown hook
└── playwright.config.ts                    # Multi-browser config
```

### Test Scenarios Implemented

| ID | Scenario | Status |
|---|---|---|
| 1.1 | User successfully signs up with valid credentials | ✅ |
| 1.2 | User navigates to Sign In page from Sign Up | ✅ |

Full test plan (validation, password rules, duplicates, edge cases, accessibility) is documented in [`playwright/specs/signup-page.plan.md`](playwright/specs/signup-page.plan.md).

### Key Patterns

**Page Object Model** — all locators and actions encapsulated in `pages/signup.page.ts`:

```typescript
await signupPage.goto();
await signupPage.fillSignupForm(testUser);
await signupPage.submitSignup();
await signupPage.assertSuccessPageIsVisible();
```

**Dynamic Test Data** — each test generates a unique user via Faker, preventing conflicts across parallel or repeated runs:

```typescript
const testUser = {
  firstName: faker.person.firstName(),
  username: `johndoe${Date.now()}`,
  password: "SecurePass123!",
  // ...
};
```

**Multi-browser** — all tests execute against Chromium, Firefox, and WebKit in the same run.

---

## 🚀 Getting Started

### Prerequisites

- Node.js >= 20.0.0
- Yarn

### Installation

```bash
git clone https://github.com/imransdet/playwright-e2e-realworld-app.git
cd playwright-e2e-realworld-app

yarn install
yarn db:seed:dev
```

---

## 💻 Running the Application

```bash
# Start both React (port 3000) and API (port 3001)
yarn dev

# CI mode (proxy server + API)
yarn start:ci
```

---

## 🧪 Running Tests

### Start servers first (required for E2E tests)

```bash
yarn start:ci
```

### Playwright E2E Tests (in a separate terminal)

```bash
# Run all tests (Chromium, Firefox, WebKit)
yarn test:playwright

# Interactive UI mode
yarn test:playwright:ui

# Headless only
yarn test:headless

# Specific browser
yarn test:playwright --project=chromium
```

### Unit Tests

```bash
yarn test:unit
```

---

## 📁 Project Structure

```
playwright-e2e-realworld-app/
│
├── playwright/                 # 🎭 Playwright test suite (see above)
│
├── .github/workflows/
│   ├── playwright-ci.yml       # Dev branch CI
│   ├── pr-validation.yml       # PR gate (lint → build → E2E → deploy)
│   └── production-deploy.yml   # Production health check post-deploy
│
├── src/                        # React application source
│   ├── components/
│   ├── containers/
│   ├── machines/               # XState state machines
│   ├── models/
│   └── utils/
│
├── backend/                    # Express API server
│   ├── app.ts
│   ├── database.ts
│   ├── graphql/
│   └── *-routes.ts
│
├── data/                       # Seed data
│   ├── database.json
│   └── database-seed.json
│
├── scripts/                    # Utility scripts
├── netlify.toml                # Netlify config
├── vite.config.ts
└── package.json
```

---

## 🙏 Acknowledgments

Built on top of the [Cypress Real World App](https://github.com/cypress-io/cypress-realworld-app) — adapted to replace Cypress with Playwright and demonstrate modern E2E automation patterns.

---

## 📧 Support

- GitHub Issues: [Open an Issue](https://github.com/imransdet/playwright-e2e-realworld-app/issues)

---

**Built with Playwright · React · GitHub Actions**
