# book-management-api
This project is an API for creating, reading, updating and deleting book entries.

[//]: # (There is a separate [book-management-frontend]&#40;https://github.com/mischbeckaya/book-management-frontend&#41; repository for the frontend.)

## Requirements
- [Node.js 14+](https://nodejs.org/en/)
- [MongoDB 5+](https://www.mongodb.com/)
- [Yarn](https://yarnpkg.com/)

## Features
- Read all books
- Read a book
- Create a book
- Update a book
- Delete a book
- Field selection
- Limitation
- Sorting
- Pagination

## Installation

Create two databases "book-management-api", "book-management-api-testing" and collection "books".

Install the dependencies
```shell
yarn install
```

Create a new .env file
```shell
cp .env.example .env
```

Change your environment requirements in .env file
```shell
HOST=127.0.0.1
PORT=8000
DATABASE=mongodb://localhost:27017/book-management-api
DATABASE_TEST=mongodb://localhost:27017/book-management-api-testing
```

Run tests
```shell
yarn test
```

Starting development
```shell
yarn dev
```

Starting production
```shell
yarn serve
```

## Usage

### Display a list of all books

Request
```http request
GET /api/v1/books
```

Response
```json
[
    {
        "id": "627af7b62ca7fec36c160f5a",
        "title": "Node Cookbook",
        "author": "Bethany Griggs",
        "pages": 512,
        "price": 30,
        "publisher": "Packt Publishing",
        "isHandback": false,
        "isPaperback": true,
        "createdAt": "2022-05-11T13:30:58.965Z",
        "updatedAt": "2022-05-11T13:30:58.965Z"
    },
    {
        "id": "627af7b72ca7fec36c160f5c",
        "title": "Node Cookbook 2",
        "author": "Bethany Griggs",
        "pages": 700,
        "price": 45,
        "publisher": "Packt Publishing",
        "isHandback": false,
        "isPaperback": true,
        "createdAt": "2022-05-11T13:41:59.952Z",
        "updatedAt": "2022-05-11T13:41:59.952Z"
    }
]
```

### Display a specific book

Request
```http request
GET /api/v1/books/:id
```

Response
```json
{
    "id": "627af7b52ca7fec36c160f58",
    "title": "Node Cookbook",
    "author": "Bethany Griggs",
    "pages": 512,
    "price": 30,
    "publisher": "Packt Publishing",
    "isHandback": false,
    "isPaperback": true,
    "createdAt": "2022-05-10T23:39:33.992Z",
    "updatedAt": "2022-05-10T23:39:33.992Z"
}
```

### Create a new book

Request
```http request
POST /api/v1/books
```

Payload
```json
{
    "title": "Node Cookbook 2",
    "author": "Bethany Griggs",
    "pages": 700,
    "price": 45,
    "publisher": "Packt Publishing",
    "isHandback": false,
    "isPaperback": true
}
```

Response
```json
{
    "id": "627bbd2722d1e065ec28d0a9",  
    "title": "Node Cookbook 2",
    "author": "Bethany Griggs",
    "pages": 700,
    "price": 45,
    "publisher": "Packt Publishing",
    "isHandback": false,
    "isPaperback": true,
    "createdAt": "2022-05-11T13:41:59.952Z",
    "updatedAt": "2022-05-11T13:41:59.952Z"
}
```

### Update a specific book

Request
```http request
PUT /api/v1/books/:id
```

Payload
```json
{
    "title": "Node Cookbook 2",
    "author": "Bethany Griggs",
    "publisher": "Packt Publishing",
    "isHandback": true,
    "isPaperback": false
}
```

Response
```json
{
    "id": "627af7b52ca7fec36c160f58",
    "title": "Node Cookbook 2",
    "author": "Bethany Griggs",
    "publisher": "Packt Publishing",
    "isHandback": true,
    "isPaperback": false,
    "createdAt": "2022-05-10T23:39:33.992Z",
    "updatedAt": "2022-05-11T13:44:41.386Z"
}
```

### Delete a specific book

Request
```http request
DELETE /api/v1/books/:id
```

### Display a list with selected fields

Request
```http request
GET /api/v1/books?fields=:fields
```

Example
```http request
GET /api/v1/books?fields=title,author
```

Response
```json
[
    {
        "id": "627af7b62ca7fec36c160f5a",
        "title": "Node Cookbook",
        "author": "Bethany Griggs"
    },
    {
        "id": "627af7b72ca7fec36c160f5c",
        "title": "Node Cookbook 2",
        "author": "Bethany Griggs"
    }
]
```

### Display a list sorted
Request
```http request
GET /api/v1/books?sort_by=:field&order_by=:direction
```
Example
```http request
GET /api/v1/books?sort_by=title&order_by=asc
```

Response
```json
[
    {
        "id": "627bba9222d1e065ec28d0a4",
        "title": "Node Cookbook",
        "author": "Bethany Griggs",
        "pages": 512,
        "price": 30,
        "publisher": "Packt Publishing",
        "isHandback": false,
        "isPaperback": true,
        "createdAt": "2022-05-11T13:30:58.965Z",
        "updatedAt": "2022-05-11T13:30:58.965Z"
    },
    {
        "id": "627bba9222d1e065ec28d0a4",
        "title": "Node Cookbook 2",
        "author": "Bethany Griggs",
        "pages": 700,
        "price": 45,
        "publisher": "Packt Publishing",
        "isHandback": false,
        "isPaperback": true,
        "createdAt": "2022-05-11T13:41:59.952Z",
        "updatedAt": "2022-05-11T13:41:59.952Z"
    }
]
```

### Display a list with limited results
Request
```http request
GET /api/v1/books?size=:size
```

Example
```http request
GET /api/v1/books?size=2
```

```json
[
    {
        "id": "627bba9222d1e065ec28d0a4",
        "title": "Node Cookbook",
        "author": "Bethany Griggs",
        "pages": 512,
        "price": 30,
        "publisher": "Packt Publishing",
        "isHandback": false,
        "isPaperback": true,
        "createdAt": "2022-05-11T13:30:58.965Z",
        "updatedAt": "2022-05-11T13:30:58.965Z"
    },
    {
        "id": "627bba9222d1e065ec28d0a4",
        "title": "Node Cookbook 2",
        "author": "Bethany Griggs",
        "pages": 700,
        "price": 45,
        "publisher": "Packt Publishing",
        "isHandback": false,
        "isPaperback": true,
        "createdAt": "2022-05-11T13:41:59.952Z",
        "updatedAt": "2022-05-11T13:41:59.952Z"
    }
]
```

### Display a list with pagination
Request
```http request
GET /api/v1/books?page=:page&size=:size
```

Example
```http request
GET /api/v1/books?page=2&size=10
```

Response
```json
{
    "totalPages": 5,
    "currentPage": 2,
    "previousPage": 1,
    "nextPage": 3,
    "data": [
        {
            "id": "627bba9222d1e065ec28d0a4",
            "title": "Node Cookbook",
            "author": "Bethany Griggs",
            "pages": 512,
            "price": 30,
            "publisher": "Packt Publishing",
            "isHandback": false,
            "isPaperback": true,
            "createdAt": "2022-05-11T13:30:58.965Z",
            "updatedAt": "2022-05-11T13:30:58.965Z"
        },
        {
            "id": "627bba9222d1e065ec28d0a4",
            "title": "Node Cookbook 2",
            "author": "Bethany Griggs",
            "pages": 700,
            "price": 45,
            "publisher": "Packt Publishing",
            "isHandback": false,
            "isPaperback": true,
            "createdAt": "2022-05-11T13:41:59.952Z",
            "updatedAt": "2022-05-11T13:41:59.952Z"
        }
    ]
}
```