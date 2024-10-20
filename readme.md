# RESTful API with Node.js, Express, GraphQL, and MySQL

This is a RESTful API built with Node.js, Express, GraphQL, and MySQL. The API has a single endpoint at `/graphql` that accepts GraphQL queries and returns JSON responses.

## Available Queries

### `user`

* `email`: The email address of the user
* `token`: The JWT authentication token for the user (if returned, can be used to authenticate the user in future GraphQL requests)

### `login`

* `email`: The email address of the user to log in
* `password`: The password of the user to log in
* `token`: The JWT authentication token for the user (if returned, can be used to authenticate the user in future GraphQL requests)

## Available Mutations

### `register`

* `email`: The email address of the user to register
* `password`: The password of the user to register
* `token`: The JWT authentication token for the user (if returned, can be used to authenticate the user in future GraphQL requests)

## Authentication

The API uses JWT authentication. When a user logs in or registers, a JWT token is returned in the response. This token can be used to authenticate the user in future GraphQL requests by including it in the `Authorization` header of the request.

For example:
```
  curl -X POST \
  http://localhost:4000/graphql \
  -H 'Authorization: Bearer <token>' \
  -H 'Content-Type: application/json' \
  -d '{"query":"{ user { email } }"}'

## Supported Node.js Versions

This project is tested against Node.js v14 (LTS) and v16 (Current). It should work in any version of Node.js >= 14.17.0.

## Environment Variables

The following environment variables are required for this project to work:

* `DB_HOST`: The hostname of the MySQL server
* `DB_USER`: The username to use when connecting to the MySQL server
* `DB_PASSWORD`: The password to use when connecting to the MySQL server
* `DB_NAME`: The name of the MySQL database to use
* `DB_PORT`: The port number to use when connecting to the MySQL server
* `JWT_SECRET`: The secret key to use when signing JWT tokens

## License

This project is licensed under the MIT License. See the LICENSE file for details.
