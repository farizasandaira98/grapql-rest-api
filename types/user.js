// types/user.js
const { GraphQLObjectType, GraphQLString } = require('graphql');

const UserType = new GraphQLObjectType({
  name: 'User',
  /**
   * The fields of the User object type.
   * @property {string} _id - The unique ID of the user.
   * @property {string} email - The email address of the user.
   * @property {string} [token] - The JWT authentication token for the user.
   * If returned, can be used to authenticate the user in future GraphQL requests.
   */
  fields: () => ({
    _id: { type: GraphQLString },
    email: { type: GraphQLString },
    token: { type: GraphQLString } // Add token field if you're returning it
  })
});

module.exports = UserType;
