import { Db } from "../config/db.js";

const createTables = async () => {
  try {
    await Db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL
      );
    `);

   await Db.query(`
  CREATE TABLE IF NOT EXISTS events (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    date_time TIMESTAMP NOT NULL,
    location VARCHAR(100) NOT NULL,
    capacity INTEGER CHECK (capacity > 0 AND capacity <= 1000),
    registration_deadline TIMESTAMP NOT NULL
  );
`);


    await Db.query(`
      CREATE TABLE IF NOT EXISTS registrations (
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
        registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (user_id, event_id)
      );
    `);

    console.log("All tables created successfully.");
    process.exit(); 
  } catch (error) {
    console.error("Error creating tables:", error.message);
    process.exit(1);
  }
};

createTables();
