import dotenv from 'dotenv';
import express, { Router } from 'express';
import cors from 'cors';
import WopiRoutes from './routes/wopi';
import bodyParser from 'body-parser';
dotenv.config();

const startServer = async() => {
    const app = express();
    app.listen(process.env.PORT);
    app.use(cors());
    app.use(express.json());
    app.use(bodyParser.raw({limit : '100kb'}));
    new WopiRoutes(app);
}

startServer();
