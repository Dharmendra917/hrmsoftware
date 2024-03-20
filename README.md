## Installation

- #setup
- #dependencies
- **jsonwebtoken:** Module for generating and verifying JSON Web Tokens (JWT).

For Node.js projects, install using npm:

```sh
npm install jsonwebtoke

```

- **dotenv:** Module for access .env file.

For Node.js projects, install using npm:

```sh
npm install dotenv

```

- **cors:** CORS allows us to bypass this policy in case of scenarios where accessing third-party resources becomes necessary.

For Node.js projects, install using npm:

```sh
npm install cors

```

- **bcryptjs:** This module enables storing passwords as hashed passwords instead of plaintext.

For Node.js projects, install using npm:

```sh
npm install bcryptjs

```

- **cookie-parser:** Cookie parser is used to parse the cookies included in the request headers of an HTTP request

For Node.js projects, install using npm:

```sh
npm install cookie-parser

```

- **express-session:** express-session is a middleware module in Express. js that allows you to create sessions in your web application. It stores session data on the server side, using a variety of different storage options, and allows you to track the activity of a user across requests.

For Node.js projects, install using npm:

```sh
npm install express-session

```

- #configuration

## Features

- #authentication

## Technologies Used

- #javascript
- #node.js
- #express.js
- #monogdb

## Known Issues

## Contributors

## Project Status

<h1>Backend API's</h1>

_ // Employess---------------------------- _

<p>POST /api/employee/singin</p>
<p>GET /api/employee/singout</p>
<p>POST /api/employee/current</p>
<p>GET /api/employee/document</p>

_ // Tasks-------------------------------- _

<p>POST /api/employee/updatetasks/:id</p>

_ // Service------------------------------ _

<p> POST /api/employee/addincome</p>
<p>POST /api/employee/updateincome/:id</p>

_ // Expense------------ _

<p>POST /api/employee/addexpense</p>
<p>POST /api/employee/updateexpense/:id</p>

_ // Admin------------------------------- _

<p>POST /api/employee/singup - for employee Singup</p>
<p>POST /api/admin/signin</p>
<p>GET /api/admin/signout</p>
<p>POST /api/admin/current</p>

<p>GET /api/admin/allemployee</p>
<p>GET /api/admin/oneemployee/:id</p>
<p>POST /api/admin/task/:id</p>
<p>POST /api/admin/holidays/</p>
<p>POST /api/admin/leaverequest/:id</p>
<p>GET  /api/admin/alltask </p>
