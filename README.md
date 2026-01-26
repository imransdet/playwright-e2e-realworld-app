# Playwright E2E Real World App 🚀

A full-stack React application demonstrating real-world usage of Playwright testing methods, patterns, and workflows. This is a payment application with comprehensive E2E test coverage using Playwright.

## 🌟 Live Demo

**Production URL:** https://playwright-e2e-realworld-app.netlify.app

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Running the Application](#running-the-application)
- [Running Tests](#running-tests)
- [Project Structure](#project-structure)
- [Playwright Testing](#playwright-testing)
- [Deployment](#deployment)
- [Contributing](#contributing)

## ✨ Features

- **User Authentication**: Sign up, sign in, and sign out functionality
- **Transaction Management**: Create, view, and manage transactions
- **Bank Accounts**: Add and manage multiple bank accounts
- **Contact Management**: Create and manage contacts for quick transactions
- **Notifications**: Real-time notification system
- **Comments**: Add comments to transactions
- **User Profile**: Manage user settings and preferences
- **Responsive Design**: Mobile-friendly UI using Material-UI
- **Multiple Auth Providers**: Support for Auth0, Okta, AWS Cognito, and Google

## 🛠 Tech Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Material-UI (MUI)** - Component library
- **Vite** - Build tool and dev server
- **XState** - State management
- **React Router** - Client-side routing
- **Formik** - Form handling
- **date-fns** - Date manipulation

### Backend
- **Express.js** - Node.js framework
- **TypeScript** - Type safety
- **LowDB** - JSON-based database
- **Passport.js** - Authentication
- **GraphQL** - API layer
- **bcryptjs** - Password hashing

### Testing
- **Playwright** - E2E testing framework
- **Vitest** - Unit testing
- **Testing Library** - React component testing

## 🚀 Getting Started

### Prerequisites

- **Node.js** >= 20.0.0
- **Yarn** package manager

### Installation

```bash
# Clone the repository
git clone https://github.com/imransdet/playwright-e2e-realworld-app.git
cd playwright-e2e-realworld-app

# Install dependencies
yarn install

# Seed the database
yarn db:seed:dev
```

## 💻 Running the Application

### Development Mode

```bash
# Start both React and API servers
yarn dev

# Start React only
yarn start:react

# Start API only
yarn start:api
```

The application will be available at: `http://localhost:3000`

### Production Build

```bash
# Build for production
yarn build

# Preview production build
yarn preview
```

## 🧪 Running Tests

### Playwright E2E Tests

```bash
# Run all Playwright tests
yarn test

# Run tests in UI mode (interactive)
yarn test:playwright:ui

# Run tests headless
yarn test:headless

# Run specific test file
yarn test playwright/tests/auth/login.spec.ts
```

### Unit Tests

```bash
# Run all unit tests
yarn test:unit

# Run unit tests in CI mode
yarn test:unit:ci
```

## 📁 Project Structure

```
playwright-e2e-realworld-app/
├── playwright/              # 🔥 Playwright test suite
│   ├── tests/              # Test specifications
│   │   ├── auth/          # Authentication tests
│   │   ├── checkout/      # Checkout/transaction tests
│   │   └── smoke.spec.ts # Smoke tests
│   ├── pages/             # Page Object Model (POM)
│   │   ├── base.page.ts
│   │   ├── login.page.ts
│   │   └── dashboard.page.ts
│   ├── fixtures/          # Custom fixtures
│   ├── helpers/           # Utilities & helpers
│   ├── config/            # Environment configs
│   ├── test-data/         # JSON test data
│   ├── global-setup.ts
│   ├── global-teardown.ts
│   └── playwright.config.ts
│
├── src/                  # React application source
│   ├── components/       # Reusable components
│   ├── containers/       # Container components
│   ├── machines/         # XState machines
│   ├── models/           # Data models
│   ├── utils/           # Utility functions
│   ├── svgs/            # SVG icons
│   └── index.tsx        # Entry point
│
├── backend/              # Express API server
│   ├── app.ts
│   ├── auth.ts
│   ├── database.ts
│   ├── graphql/          # GraphQL schema & resolvers
│   └── *-routes.ts       # API route handlers
│
├── data/                # Database files
│   ├── database.json
│   ├── database-seed.json
│   └── empty-seed.json
│
├── public/              # Static assets
│   ├── index.html
│   ├── favicon.ico
│   └── img/
│
├── scripts/             # Utility scripts
│   ├── generateSeedData.ts
│   └── testServer.ts
│
├── build/              # Production build output
├── netlify.toml        # Netlify configuration
├── vite.config.ts       # Vite configuration
└── package.json         # Project dependencies
```

## 🎭 Playwright Testing

### Directory Structure

The Playwright test suite is organized using best practices:

```
playwright/
├── tests/                   # Test specifications
│   ├── auth/               # Authentication tests
│   ├── checkout/           # Checkout/transaction tests
│   └── smoke.spec.ts       # Smoke tests
│
├── pages/                  # Page Object Model (POM)
│   ├── base.page.ts        # Base page with common methods
│   ├── login.page.ts       # Login page object
│   └── dashboard.page.ts   # Dashboard page object
│
├── fixtures/               # Custom fixtures
│   └── auth.fixture.ts     # Authentication fixture
│
├── helpers/               # Utilities & helpers
│   ├── test-data.ts        # Test data objects
│   ├── api.helper.ts       # API helper class
│   └── wait.helper.ts      # Wait/synchronization helpers
│
├── config/                # Environment configurations
│   ├── env.dev.ts          # Development environment config
│   ├── env.staging.ts      # Staging environment config
│   └── env.prod.ts         # Production environment config
│
├── test-data/             # JSON / static test data
│   └── users.json          # User test data
│
├── global-setup.ts        # Global setup script
├── global-teardown.ts     # Global teardown script
└── playwright.config.ts    # Playwright configuration
```

### Running Playwright Tests

```bash
# Run all tests
yarn test

# Run in UI mode
yarn test:playwright:ui

# Run headless
yarn test:headless
```

### Test Patterns

- **Page Object Model (POM)**: Organized page objects for maintainable tests
- **Fixtures**: Reusable setup code for authentication and common operations
- **Helpers**: Utility classes for API calls, waiting strategies, and test data
- **Environment Configs**: Separate configurations for dev, staging, and production

## 🌐 Deployment

### Netlify

The application is automatically deployed to Netlify when pushing to the `main` branch.

**Live URL:** https://playwright-e2e-realworld-app.netlify.app

### Manual Deployment

```bash
# Build the project
yarn build

# Deploy to Netlify (requires Netlify CLI)
netlify deploy --prod --dir=build
```

### Environment Variables

Set up these environment variables in Netlify or your local `.env` file:

```env
NODE_ENV=production
VITE_AUTH0=true          # Optional: Enable Auth0
VITE_OKTA=true            # Optional: Enable Okta
VITE_AWS_COGNITO=true   # Optional: Enable AWS Cognito
VITE_GOOGLE=true         # Optional: Enable Google Auth
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style
- Write tests for new features
- Update documentation as needed
- Run tests before committing (`yarn types` and `yarn test`)

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

This project is based on the [Cypress Real World App](https://github.com/cypress-io/cypress-realworld-app) and adapted to use Playwright for E2E testing.

## 📚 Additional Resources

- [Playwright Documentation](https://playwright.dev/)
- [React Documentation](https://react.dev/)
- [Material-UI Documentation](https://mui.com/)
- [Vite Documentation](https://vitejs.dev/)
- [XState Documentation](https://xstate.js.org/docs/)

## 📧 Support

For issues and questions:
- GitHub Issues: [Open an Issue](https://github.com/imransdet/playwright-e2e-realworld-app/issues)
- Email: support@example.com

---

**Built with ❤️ using Playwright and React**