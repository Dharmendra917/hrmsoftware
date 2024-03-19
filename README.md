<h1>Backend API's</h1>

// Employess----------------------------
POST /api/employee/singin
GET /api/employee/singout
POST /api/employee/current
GET /api/employee/document

// Tasks--------------------------------
POST /api/employee/updatetasks/:id

// Service------------------------------
POST /api/employee/addincome
POST /api/employee/updateincome/:id

// Expense------------
//POST /api/employee/addexpense
//POST /api/employee/updateexpense/:id

// Admin-------------------------------
POST /api/employee/singup - for employee Singup
POST /api/admin/signin
GET /api/admin/signout
POST /api/admin/current

GET /api/admin/allemployee
GET /api/admin/oneemployee/:id

POST /api/admin/task/:id
