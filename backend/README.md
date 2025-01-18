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

# Insert Blog API

## Endpoint
`POST /insert_blog`

## Description
This endpoint allows you to insert a new blog into the database.

## Request Body
The request body should be in JSON format and include the following fields:

- `email` (string): The email address of the user.
- `blog_id` (string): The unique identifier for the blog.
- `blogText` (string): The content of the blog.
- `blogTitle` (string): The title of the blog.
- `publish` (boolean): Whether the blog should be published.
- `language` (string): The language of the blog.

Example:
```json
{
  "email": "john.doe@example.com",
  "blog_id": "blog123",
  "blogText": "This is the content of the blog.",
  "blogTitle": "Blog Title",
  "publish": true,
  "language": "en"
}
```

# Get User Blogs API

## Endpoint
`POST /get_user_blog`

## Description
This endpoint allows you to retrieve all blogs for a specific user.

## Request Body
The request body should be in JSON format and include the following field:

- `email` (string): The email address of the user.

Example:
```json
{
  "email": "john.doe@example.com"
}
```

# Get Blog API

## Endpoint
`POST /get_blog`

## Description
This endpoint allows you to retrieve a specific blog by its ID, email, and language.

## Request Body
The request body should be in JSON format and include the following fields:

- `blog_id` (string): The unique identifier for the blog.
- `email` (string): The email address of the user.
- `language` (string): The language of the blog.

Example:
```json
{
  "blog_id": "blog123",
  "email": "john.doe@example.com",
  "language": "en"
}
```

# Update Blog API

## Endpoint
`POST /update_blog`

## Description
This endpoint allows you to update an existing blog in the database.

## Request Body
The request body should be in JSON format and include the following fields:

- `email` (string): The email address of the user.
- `blog_id` (string): The unique identifier for the blog.
- `blogText` (string): The updated content of the blog.
- `blogTitle` (string): The updated title of the blog.
- `publish` (boolean): Whether the blog should be published.
- `language` (string): The language of the blog.

Example:
```json
{
  "email": "john.doe@example.com",
  "blog_id": "blog123",
  "blogText": "This is the updated content of the blog.",
  "blogTitle": "Updated Blog Title",
  "publish": true,
  "language": "en"
}
```


