import { Db } from "../config/db.js";

export const createEvent = async(req,res)=>{
    const { title, location, date_time, registration_deadline,capacity } = req.body;
    if (!title || !location || !registration_deadline || !date_time || !capacity) {
      return res.status(400).json({ error: "Enter all fields correctly." });
    }

    if(capacity > 1000){
        return res.status(400).json({ error: "capacity cant be morethan 1000."});
    }

    try {

       const checkEvent = await Db.query(
         `SELECT title FROM events WHERE title = $1`,
         [title]
       );
      
        if (checkEvent.rows.length > 0) {
          return res.status(400).json({ error: "Event already exists." });
        }
        const deadlineTime = new Date(registration_deadline);
        const eventTime = new Date(date_time);

        if (deadlineTime >= eventTime){
          return res.status(400).json({
            error: "Registration deadline must be before the event start time.",
          });
        }

        const insertingEvent = await Db.query(
          `INSERT INTO events(title,location,date_time,registration_deadline,capacity) values ($1,$2,$3,$4,$5) 
            RETURNING *`,
          [title, location, date_time, registration_deadline,capacity]
        );

        res.status(201).json({message  : "Event is created successfully.",id : insertingEvent.rows[0].id});
        
    } catch (error) {
        console.log(error)
        res.status(501).json({error : "Internal Server Error."});
    }
}