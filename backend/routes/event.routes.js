import { Router } from 'express'
import { createEvent } from './../controller/event.controller.js';

export const routes  = Router()

routes.post("/create-event",createEvent);

