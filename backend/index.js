import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import { routes } from './routes/event.routes.js';

dotenv.config()

const app = express();

app.use(cors())
app.use(express.json())
app.use('/api',routes);

const port = process.env.PORT || 7000;

app.listen(port,()=>{
    console.log("Jai Shree Ram,Server is running..");
});