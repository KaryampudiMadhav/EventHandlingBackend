Event Management API
This is a Node.js and PostgreSQL backend application designed to manage events and user registrations. The API supports functionalities like event creation, user registration, cancellation, and statistics, with built-in validation and error handling.

Tech Stack
Backend: Node.js, Express.js

Database: PostgreSQL

Querying: pg (node-postgres)

Environment Configuration: dotenv

Features
Event creation and management

User registration and cancellation

Event statistics and reporting

Proper validation and error handling

Setup Instructions
1. Clone the Repository
In your terminal, run the following command to clone the repository:

bash
Copy
Edit
git clone https://github.com/KaryampudiMadhav/EventHandlingBackend.git
cd EventHandlingBackend/backend
3. Install Dependencies
Run the following command to install the necessary dependencies:

bash
Copy
Edit
npm i
3. Create Database in PostgreSQL
Create a PostgreSQL database named eventdb:

bash
Copy
Edit
# Connect to PostgreSQL
psql -U postgres

# Create the database
CREATE DATABASE eventdb;
4. Create .env File
In the backend folder, create a .env file with the following database configuration:


PORT=5000
DB_USER=your_postgresql_user
DB_PASSWORD=your_postgresql_password
DB_HOST=localhost
DB_PORT=5432
DB_DATABASE=eventdb
Make sure to replace your_postgresql_user and your_postgresql_password with your actual PostgreSQL credentials.

5. Create Tables
Navigate to the models directory and run the command to create the necessary tables:

cd models
node createTables.js
6. Run the Application
Finally, navigate back to the backend folder and start the application:

npm run dev
The server should now be running and accessible on the port specified in your .env file (default: 5000).

API Endpoints
POST /events: Create a new event

GET /events: List all events

GET /events/:id: Get event details

POST /register: Register for an event

DELETE /register/:id: Cancel registration for an event

GET /statistics: Get event statistics

Author
Madhav Karyampudi
