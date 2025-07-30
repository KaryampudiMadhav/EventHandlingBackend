import { Router } from 'express'
import { cancelRegistration, createEvent, getEventDetails, registerEvents, upcommingEvents } from './../controller/event.controller.js';

export const routes  = Router()

routes.post("/create-event",createEvent);
routes.post("/register-event",registerEvents);
routes.get("/get-events",upcommingEvents);
routes.delete("/cancel-event/:email/:eventId",cancelRegistration);
routes.get("/get-event-details",getEventDetails)