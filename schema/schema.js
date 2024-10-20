const { 
    GraphQLObjectType, 
    GraphQLInputObjectType, 
    GraphQLString, 
    GraphQLSchema 
  } = require('graphql');
  const UserType = require('../types/user');
  const User = require('../models/user');
  const bcrypt = require('bcryptjs');
  const jwt = require('jsonwebtoken');
  
  const RootMutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
      register: {
        type: UserType,
        args: {
          userInput: { type: new GraphQLInputObjectType({
            name: 'UserInput',
            fields: {
              email: { type: GraphQLString },
              password: { type: GraphQLString },
            }
          })}
        },
        /**
         * Registers a new user in the database, and returns the user's JWT token,
         * which can be used to authenticate the user in future requests.
         * @param {Object} parent - The parent value, which is not used in this resolve function.
         * @param {Object} userInput - The input user object, which contains the email and password
         *     of the user to register.
         * @returns {Promise<Object>} - A promise that resolves to the newly created user object,
         *     containing the user's ID, email, and a JWT token that can be used to authenticate
         *     the user in future requests.
         */
        resolve: async (parent, { userInput }) => {
          const hashedPassword = await bcrypt.hash(userInput.password, 12);
          const user = await User.create(userInput.email, hashedPassword);
          const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
          return { _id: user._id, email: userInput.email, token };
        }
      },
      login: {
        type: UserType,
        args: {
          email: { type: GraphQLString },
          password: { type: GraphQLString }
        },
        /**
         * Resolves the user login by checking the provided email and password.
         * If the user is found and the password is valid, generates a JWT token for authentication.
         * @param {Object} parent - The parent value, not used in this resolve function.
         * @param {Object} userInput - The input user object containing the email and password.
         * @returns {Promise<Object>} - A promise that resolves to the logged-in user object,
         * containing the user's ID, email, and a JWT token for authentication.
         * @throws {Error} - If the user is not found or the password is invalid.
         */
        resolve: async (parent, { email, password }) => {
          const user = await User.findOne(email);
          if (!user) {
            throw new Error('User not found.');
          }
          const isValid = await bcrypt.compare(password, user.password);
          if (!isValid) {
            throw new Error('Invalid password.');
          }
          const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
          return { _id: user._id, email: user.email, token };
        }
      }
    }
  });
  
  const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
      user: {
        type: UserType,
        args: { email: { type: GraphQLString } },
        /**
         * Resolves the user based on the given email.
         * @param {Object} parent - The parent value, not used in this resolve function.
         * @param {Object} args - The input arguments containing the email.
         * @returns {Promise<Object>} - A promise that resolves to the user object
         *     containing the user's ID, email, and a JWT token for authentication.
         * @throws {Error} - If the user is not found.
         */
        resolve: async (parent, { email }) => {
          return await User.findOne(email);
        }
      }
    }
  });
  
  const schema = new GraphQLSchema({
    query: RootQuery,
    mutation: RootMutation
  });
  
  module.exports = schema;
  