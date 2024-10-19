import dotenv from 'dotenv';
// Load environment variables from .env file
dotenv.config(); // not loading if put after all imports

import express from 'express';
import routes from './routes/authRoutes';


// Create an Express application
const app = express();

app.use(express.json()); // Parse JSON bodies 

// API versioning prefix
app.use('/api/v1/auth', routes); // Use versioned routes

// Error handling middleware (optional but recommended)
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack); // Log the error
    res.status(500).json({ error: 'Something went wrong!' }); // Send error response
});

// Get the port from environment variables
const port = process.env.PORT

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
