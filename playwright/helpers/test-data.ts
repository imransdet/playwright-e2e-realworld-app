export const testUsers = {
  valid: {
    username: 'testUser',
    password: 'password',
    firstName: 'Test',
    lastName: 'User',
    email: 'test@example.com'
  },
  invalid: {
    username: 'invalidUser',
    password: 'wrongPassword',
  }
};

export const transactionData = {
  valid: {
    amount: 100,
    description: 'Test transaction',
    receiver: 'John Doe'
  },
  largeAmount: {
    amount: 10000,
    description: 'Large transaction',
    receiver: 'Jane Smith'
  }
};

export const bankAccountData = {
  valid: {
    bankName: 'Test Bank',
    routingNumber: '123456789',
    accountNumber: '987654321'
  }
};