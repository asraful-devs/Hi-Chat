import dotenv from 'dotenv';
import express, { type Request, type Response } from 'express';
import path from 'path';
import authRoutes from './routes/auth.route.ts';

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 5000;

app.use('/api/auth', authRoutes);

app.use('/server', (req: Request, res: Response) => {
    res.send('Hello from the Hi Chat server!');
});

// __dirname is not available in ES modules, so we need to use path.resolve() to get the current directory
// This is necessary to serve the static files in production
const __dirname = path.resolve();

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/dist')));
    app.get('*', (req: Request, res: Response) => {
        res.sendFile(
            path.join(__dirname, '..', 'client', 'dist', 'index.html')
        );
    });
}

app.listen(PORT, () => {
    console.log(`Server is running on port : http://localhost:${PORT}`);
});
