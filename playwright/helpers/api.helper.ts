import { APIRequestContext } from "@playwright/test";

export class APIHelper {
  readonly request: APIRequestContext;
  readonly baseURL: string;

  constructor(request: APIRequestContext, baseURL: string) {
    this.request = request;
    this.baseURL = baseURL;
  }

  async post(endpoint: string, data: any) {
    const response = await this.request.post(`${this.baseURL}${endpoint}`, {
      data,
    });
    return response;
  }

  async get(endpoint: string) {
    const response = await this.request.get(`${this.baseURL}${endpoint}`);
    return response;
  }

  async put(endpoint: string, data: any) {
    const response = await this.request.put(`${this.baseURL}${endpoint}`, {
      data,
    });
    return response;
  }

  async delete(endpoint: string) {
    const response = await this.request.delete(`${this.baseURL}${endpoint}`);
    return response;
  }

  async login(username: string, password: string) {
    const response = await this.post("/login", { username, password });
    return response;
  }

  async createBankAccount(bankName: string, routingNumber: string, accountNumber: string) {
    const response = await this.post("/bankAccounts", {
      bankName,
      routingNumber,
      accountNumber,
    });
    return response;
  }

  async getTransactions() {
    const response = await this.get("/transactions");
    return response;
  }
}
