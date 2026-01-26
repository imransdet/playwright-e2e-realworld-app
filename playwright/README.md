# Playwright Test Structure

This directory contains all Playwright test files organized in a modular, scalable structure.

## 📁 Directory Structure

```
playwright/
├── tests/                   # Test specifications
│   ├── auth/               # Authentication tests
│   │   └── login.spec.ts
│   ├── checkout/           # Checkout/transaction tests
│   │   └── checkout.spec.ts
│   └── smoke.spec.ts       # Smoke tests
│
├── pages/                  # Page Object Model (POM)
│   ├── base.page.ts        # Base page class with common methods
│   ├── login.page.ts       # Login page object
│   └── dashboard.page.ts   # Dashboard page object
│
├── fixtures/               # Custom Playwright fixtures
│   └── auth.fixture.ts     # Authentication fixture
│
├── helpers/               # Utility functions and helpers
│   ├── test-data.ts        # Test data objects
│   ├── api.helper.ts       # API helper class
│   └── wait.helper.ts      # Wait/synchronization helpers
│
├── config/                # Environment configurations
│   ├── env.dev.ts          # Development environment config
│   ├── env.staging.ts      # Staging environment config
│   └── env.prod.ts         # Production environment config
│
├── test-data/             # Static test data files
│   └── users.json          # User test data
│
├── global-setup.ts        # Global setup script
├── global-teardown.ts     # Global teardown script
└── playwright.config.ts    # Playwright configuration
```

## 🚀 Running Tests

### Run all tests
```bash
yarn test
# or
yarn test:playwright
```

### Run tests in UI mode
```bash
yarn test:playwright:ui
```

### Run tests headless
```bash
yarn test:headless
```

### Run specific test file
```bash
yarn test playwright/tests/auth/login.spec.ts
```

## 📝 Page Object Model (POM)

The POM pattern is used to organize test code and make it more maintainable:

- **BasePage**: Contains common methods used across all pages (navigate, click, fill, wait, etc.)
- **LoginPage**: Specific to login functionality with locators and methods
- **DashboardPage**: Specific to dashboard functionality

## 🔧 Fixtures

Custom fixtures provide reusable setup code:
- **auth.fixture.ts**: Provides authenticated page fixture for tests that require login

## 🛠 Helpers

Utility classes to support test operations:
- **test-data.ts**: Centralized test data (users, transactions, bank accounts)
- **api.helper.ts**: API request helper for backend testing
- **wait.helper.ts**: Advanced wait strategies for synchronization

## ⚙️ Configuration

Environment-specific configurations:
- **env.dev.ts**: Local development settings
- **env.staging.ts**: Staging environment settings
- **env.prod.ts**: Production environment settings

## 📊 Test Data

Static test data stored in JSON format:
- **users.json**: Test user credentials and profiles

## 🔄 Global Setup/Teardown

- **global-setup.ts**: Runs before all tests (database setup, data seeding, etc.)
- **global-teardown.ts**: Runs after all tests (cleanup, shutdown services, etc.)

## 🎯 Best Practices

1. Use Page Objects for all page interactions
2. Keep test data separate from test logic
3. Use fixtures for common setup (authentication, etc.)
4. Organize tests by feature/domain
5. Use descriptive test names
6. Leverage helpers for complex operations
7. Maintain environment-specific configs

## 📚 Additional Resources

- [Playwright Documentation](https://playwright.dev/)
- [Page Object Model Pattern](https://playwright.dev/docs/pom)
- [Test Fixtures](https://playwright.dev/docs/test-fixtures)