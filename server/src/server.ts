import dotenv from 'dotenv';
import express, { type Request, type Response } from 'express';
import authRoutes from './routes/auth.route.ts';

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);

app.use('/', (req: Request, res: Response) => {
    res.send('Hello from the Hi Chat server!');
});

app.listen(process.env.PORT || 5000, () => {
    console.log(
        `Server is running on port : http://localhost:${process.env.PORT || 5000}`
    );
});
