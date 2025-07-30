import { Router } from 'express'
import { createEvent, registerEvents, upcommingEvents } from './../controller/event.controller.js';

export const routes  = Router()

routes.post("/create-event",createEvent);
routes.post("/register-event",registerEvents);
routes.get("/get-events",upcommingEvents);