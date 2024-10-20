const db = require('../db'); // The connection file

module.exports = class User {
  /**
   * Finds a user by email in the database.
   * @param {string} email - The email of the user to find.
   * @returns {Promise<Object|null>} - A promise that resolves to the user object if found, otherwise null.
   */
  static async findOne(email) {
    const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0]; // Return the first matching user
  }

  /**
   * Creates a new user in the database.
   * @param {string} email - The new user's email.
   * @param {string} password - The new user's password.
   * @returns {Promise<number>} - A promise that resolves to the new user's ID.
   */
  static async create(email, password) {
    const [result] = await db.execute(
      'INSERT INTO users (email, password) VALUES (?, ?)',
      [email, password]
    );
    return result.insertId; // Return the new user's ID
  }
};
