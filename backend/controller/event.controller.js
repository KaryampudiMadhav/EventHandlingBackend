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
          return res.status(400).json({ error: "Event with this name is exists change name of the event." });
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
export const registerEvents = async(req,res)=>{
    const {id : eventId,name,email} = req.body;

    if(!eventId){
        return res.status(400).json({error : "Please select the Event."});
    }
    try {
        
        const isEventPresent = await Db.query(
          `SELECT * FROM events WHERE id = $1`,
          [eventId]
        );

        if(isEventPresent.rows.length === 0){
            return res.status(400).json({error : "The Event is not present or Expired."});
        }
        const deadline = new Date(isEventPresent.rows[0].registration_deadline);
        if(deadline < new Date()){
            return res
              .status(400)
              .json({ error: "The Event is Expired." });
        }
        
        const isUserPresent = await Db.query(`SELECT * FROM users WHERE email = $1`,[email]);
   
        let userId;

        if(isUserPresent.rows.length === 0){
            
         const insertingUser = await Db.query(
              `INSERT INTO users(name,email) values ($1,$2) 
            RETURNING *`,
              [name,email]
         );
         userId = insertingUser.rows[0].id;
        }else{
            userId = isUserPresent.rows[0].id;
        }

        const isUserRegsistered = await Db.query(`SELECT * FROM registrations where user_id = $1 and event_id = $2`,[userId,eventId]);

        if(isUserRegsistered.rows.length > 0){
            return res.status(400).json({error : "You already rsegistered."});
        }

        const totalRegistrations  = await Db.query(`SELECT COUNT(*) FROM registrations where event_id = $1`,[eventId]);

        const count = parseInt(totalRegistrations.rows[0].count);
        if (count >= isEventPresent.rows[0].capacity) {
          return res.status(400).json({ error: "Event is full." });
        }

        await Db.query(
          `INSERT INTO registrations (user_id, event_id) VALUES ($1, $2)`,
          [userId, eventId]
        );

        res.status(201).json({message : "Registration is Successfull."});
    } catch (error) {
        console.log(error);
        res.status(501).json({error : "Internal Server Error."});
    }
}
export const upcommingEvents = async(req,res)=>{
    try {
      const upcommingEvents = await Db.query(
        `SELECT * FROM events ORDER BY registration_deadline ASC, location ASC`
      );

      if(upcommingEvents.rows.length === 0){
        return res.status(400).json({error : "No upcomming Events ."});
      }

      res.status(200).json({events :upcommingEvents.rows})
    } catch (error) {
      console.log(error)
      res.status(501).json({error : "Internal Server Error."});
    }
}
export const cancelRegistration = async(req,res) =>{
   const {email,eventId } = req.params;

   if(!email || !eventId){
    return res.status(400).json({error : "Please Provide the Ids."});
   }

   try{

    const isUserPresent = await Db.query(`SELECT * FROM users WHERE email = $1`,[email]);

    if(isUserPresent.rows.length === 0){
      return res.status(400).json({ error: "User is not present." });
    }

    const userId = isUserPresent.rows[0].id;

    const isUserRegsistered = await Db.query(
      `SELECT * FROM registrations WHERE user_id = $1 and event_id = $2`,
      [userId,eventId]
    );

    if(isUserRegsistered.rows.length === 0){
      return res.status(400).json({ error: "User is not registered fo this event" });
    }
    
    await Db.query(`DELETE FROM registrations  WHERE user_id = $1 and event_id = $2`,[userId,eventId]);

    res.status(200).json({ message: "Event is canclled." });
   }catch(error){
    console.log(error);
    res.status(501).json({error : "Internal Server Error ."});
   }
}
export const getEventDetails = async (req, res) => {
     try {
       const eventsRes = await Db.query("SELECT * FROM events");

       const events = [];

       for (const event of eventsRes.rows) {
         const registrationsRes = await Db.query(
           `SELECT users.id, users.name, users.email
         FROM registrations
         JOIN users ON registrations.user_id = users.id
         WHERE registrations.event_id = $1`,
           [event.id]
         );

         events.push({
           ...event,
           registrations: registrationsRes.rows,
         });
       }

       res.status(200).json(events);
     } catch (error) {
       console.error("Error fetching event details:", error);
       res.status(500).json({ error: "Internal Server Error" });
     }
}
export const getEventStats = async (req, res) => {
  try {
    const eventsRes = await Db.query("SELECT * FROM events");
    const stats = [];

    for (const event of eventsRes.rows) {
      const { id, title, capacity } = event;
      const regRes = await Db.query(
        "SELECT COUNT(*) FROM registrations WHERE event_id = $1",
        [id]
      );

      const total = parseInt(regRes.rows[0].count);
      const remaining = capacity - total;
      const percentage = ((total / capacity) * 100).toFixed(2);

      stats.push({
        id,
        title,
        capacity,
        total_registrations: total,
        remaining_capacity: remaining,
        percentage_used: `${percentage}%`,
      });
    }
    res.status(200).json(stats);
  } catch (error) {
    console.error("Error getting event stats:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
