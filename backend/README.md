# Insert User API

## Endpoint
`POST /insert_user`

## Description
This endpoint allows you to insert a new user into the database.

## Request Body
The request body should be in JSON format and include the following fields:

- `user_id` (string): The unique identifier for the user.
- `name` (string): The name of the user.
- `email` (string): The email address of the user.
- `password` (string): The password for the user.

Example:
```json
{
  "user_id": "12345",
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "securepassword"
}
```

# Login API

## Endpoint
`POST /login`

## Description
This endpoint allows a user to log in to the system.

## Request Body
The request body should be in JSON format and include the following fields:

- `email` (string): The email address of the user.
- `password` (string): The password for the user.

Example:
```json
{
  "email": "john.doe@example.com",
  "password": "securepassword"
}
```


