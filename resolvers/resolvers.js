const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user'); // Import your MySQL-based user model
require('dotenv').config();

module.exports = {
  /**
   * Registers a new user with the given email and password.
   * @param {Object} userInput - Contains the email and password of the user to register.
   * @returns {Promise<Object>} - A promise that resolves to the newly created user object,
   *     containing the user's ID, email, and a JWT token that can be used to authenticate
   *     the user in future requests.
   * @throws {Error} - If a user with the given email already exists.
   */
  register: async ({ userInput }) => {
    const existingUser = await User.findOne(userInput.email);
    if (existingUser) {
      throw new Error('User already exists.');
    }

    const hashedPassword = await bcrypt.hash(userInput.password, 12);
    const userId = await User.create(userInput.email, hashedPassword);

    const token = jwt.sign(
      { userId, email: userInput.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    return { _id: userId, email: userInput.email, token };
  },

  /**
   * Logs in an existing user with the given email and password.
   * @param {Object} userInput - Contains the email and password of the user to log in.
   * @returns {Promise<Object>} - A promise that resolves to the logged-in user object,
   *     containing the user's ID, email, and a JWT token that can be used to authenticate
   *     the user in future requests.
   * @throws {Error} - If the user does not exist or the password is incorrect.
   */
  login: async ({ email, password }) => {
    const user = await User.findOne(email);
    if (!user) {
      throw new Error('User does not exist.');
    }

    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      throw new Error('Password is incorrect.');
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    return { _id: user.id, email: user.email, token };
  }
};
