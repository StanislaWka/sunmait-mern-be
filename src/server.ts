import 'express-async-errors';

import cors from 'cors';
import express, { Application } from 'express';
import cookies from 'cookie-parser';
import * as http from 'http';
import initRoutes from './routes';

require('dotenv').config();

const app: Application = express();

let url = process.env.FRONTEND_URL;

if (process.env.NODE_ENV === 'production') {
  url = process.env.NETLIFY_URL;
}

// setup CORS
app.use(
  cors({
    credentials: true,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    origin: [url!],
    optionsSuccessStatus: 204,
  }),
);

app.use(cookies());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

initRoutes(app);

const server = http.createServer(app);

export default server;
