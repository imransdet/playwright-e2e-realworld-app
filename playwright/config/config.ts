import dotenv from "dotenv"
import path from "path"

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, "../../.env") })

export const config = {
  baseURL: process.env.BASE_URL || "http://localhost:3000",
  apiUrl: process.env.API_URL || "http://localhost:3001",
  timeout: 30000,
  screenshotOnFailure: true,
  traceOnFailure: true,
  headless: true,
  slowMo: 0,
}

export default config
