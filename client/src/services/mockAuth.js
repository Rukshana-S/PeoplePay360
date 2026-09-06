import { MOCK_USERS, DEFAULT_PASSWORD } from "../data/mockUsers";

/**
 * Mock authentication service to simulate backend authentication.
 * Replace this implementation with API endpoints when integrating backend JWT auth.
 */

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const mockAuthService = {
  /**
   * Authenticate user with email and password
   * @param {string} email 
   * @param {string} password 
   * @returns {Promise<Object>} user object
   */
  async login(email, password) {
    // Artificial latency for realistic async loading simulation
    await new Promise((resolve) => setTimeout(resolve, 600));

    // Input validations
    if (!email || !email.trim()) {
      throw new Error("Work Email is required.");
    }

    const trimmedEmail = email.trim().toLowerCase();

    if (!EMAIL_REGEX.test(trimmedEmail)) {
      throw new Error("Please enter a valid email address.");
    }

    if (!password) {
      throw new Error("Password is required.");
    }

    // Check user match
    const user = MOCK_USERS.find(
      (u) => u.email.toLowerCase() === trimmedEmail
    );

    if (!user) {
      throw new Error("Invalid credentials. Account not found.");
    }

    if (password !== DEFAULT_PASSWORD) {
      throw new Error("Invalid email or password. Default password is 123456.");
    }

    // Return sanitized user session payload
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      avatar: user.avatar,
      department: user.department,
      title: user.title,
      loginTimestamp: new Date().toISOString(),
    };
  },

  /**
   * Get list of all mock accounts for convenient selection during testing/demo
   */
  getMockAccounts() {
    return MOCK_USERS;
  }
};
