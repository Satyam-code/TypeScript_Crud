import "reflect-metadata";
import express, { Application } from 'express';
import bodyParser from 'body-parser';
import { AppDataSource } from './config/ormconfig';
import userRoutes from './routes/userRoutes';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();

const app: Application = express();
const PORT = 3000;
console.log('Serving static files from:', path.join(__dirname, 'public'));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../public')));




// Initialize database connection
AppDataSource.initialize()
    .then(() => {
        console.log('Connected to the database!');
    })
    .catch((err) => {
        console.error('Database connection error:', err);
    });

// Use the user routes
app.use('/api', userRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
