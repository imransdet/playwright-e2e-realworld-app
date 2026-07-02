import * as fs from "fs";
import * as path from "path";

export interface TestUser {
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  confirmPassword?: string;
}

const USERS_FILE = path.join(__dirname, "../test-data/users.json");

export function loadUsers(): TestUser[] {
  if (!fs.existsSync(USERS_FILE)) {
    return [];
  }
  return JSON.parse(fs.readFileSync(USERS_FILE, "utf-8"));
}

export function saveUser(user: TestUser): void {
  const users = loadUsers();
  users.push({
    firstName: user.firstName,
    lastName: user.lastName,
    username: user.username,
    password: user.password,
  });
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

export function findUserByUsername(username: string): TestUser | undefined {
  const users = loadUsers();
  return users.find((u) => u.username === username);
}

export function getLastUser(): TestUser {
  const users = loadUsers();
  if (users.length === 0) {
    throw new Error("No users found in test-data/users.json — run signup tests first");
  }
  return users[users.length - 1];
}
