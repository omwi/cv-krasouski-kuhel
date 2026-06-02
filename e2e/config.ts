export const TEST_USER = {
  email: process.env.TEST_EMAIL || "admin@test.com",
  password: process.env.TEST_PASSWORD || "12345678",
}

export const SELECTORS = {
  emailInput: 'input[type="email"]',
  passwordInput: 'input[type="password"]',
}
