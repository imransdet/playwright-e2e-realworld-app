import { FullConfig } from "@playwright/test"

async function globalTeardown(config: FullConfig) {
  console.log("Starting global teardown...")

  // You can perform global cleanup operations here, such as:
  // - Stopping test database
  // - Cleaning up test data
  // - Stopping mock servers
  // - Clearing environment variables

  console.log("Global teardown completed")
}

export default globalTeardown
