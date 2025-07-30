Event Management API

This is a Node.js + PostgreSQL backend application for managing events and user registrations.  
Built as part of an internship assignment, the API allows event creation, user registration, cancellation, statistics, and more — all with proper validation and error handling.
Tech Stack
**Backend**: Node.js, Express.js
**Database**: PostgreSQL
**Querying**: pg (`node-postgres`)
**Environment Config**: dotenv
Setup Instructions
1.Clone the Repository
in bash:
git clone https://github.com/KaryampudiMadhav/EventHandlingBackend.git
cd EventHandlingBackend/backend
2.Install 
npm i
3.Create database in pg as eventdb
4.create .env file in backend folder with PORT and PG details like:
DB_USER
DB_PASSWORD
DB_HOST
DB_PORT
DB_DATABASE
6.Next navigate to models (cd models) and next run command : node models/createTables.js to create tables
5.npm run dev

