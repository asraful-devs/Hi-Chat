import express, { type Request, type Response } from 'express';
import path from 'path';
import { connectDB } from './lib/db.ts';
import { ENV } from './lib/env.ts';
import authRoutes from './routes/auth.route.ts';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = ENV.PORT || 5000;

app.use('/api/auth', authRoutes);

app.use('/server', (req: Request, res: Response) => {
    res.send('Hello from the Hi Chat server!!!');
});

// __dirname is not available in ES modules, so we need to use path.resolve() to get the current directory
// This is necessary to serve the static files in production
const __dirname = path.resolve();

if (ENV.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/dist')));
    app.get('*', (req: Request, res: Response) => {
        res.sendFile(
            path.join(__dirname, '..', 'client', 'dist', 'index.html')
        );
    });
}

app.listen(PORT, () => {
    console.log(`Server is running on port : http://localhost:${PORT}`);
    connectDB();
});
