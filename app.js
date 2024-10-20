const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const schema = require('./schema/schema');
const resolvers = require('./resolvers/resolvers');
const authMiddleware = require('./middleware/authMiddleware'); // Import the middleware
const db = require('./db'); // Import the MySQL connection
require('dotenv').config();

const app = express();

// Apply JWT authentication middleware to all GraphQL requests
app.use(authMiddleware);

// Define a root route
app.get('/', (req, res) => {
  res.send('Welcome to the GraphQL API! Access it at /graphql');
});

app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    rootValue: resolvers,
    graphiql: true // Enable GraphiQL for development purposes
  })
);

// Start the server
app.listen(4000, () => {
  console.log('Server running on port 4000');
});
