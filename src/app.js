import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import AppError from './utils/error.js';
import './utils/trialChecker.js'; // starts cron job
import './utils/documentExpiryCheck.js';

dotenv.config();

// Import Routers
import authRouter from './routes/auth/authRoute.js';
import userRouter from './routes/user/userRoute.js';
import documentRouter from './routes/user/documentRoute.js';
import stripeSubscriptionRouter from './routes/user/stripeSubscriptionRoute.js';
import documentReminderService from './utils/reminders/documentReminderService.js';
import dailyCheckRoutes from './routes/user/dailyCheckRoutes.js'
import checklistItemRoutes from './routes/user/checklistItemRoutes.js'
import linkRoutes from './routes/admin/linkRoutes.js'
import documentTypeRouter from './routes/admin/documentTypeRoute.js'

const app = express();

const PORT = process.env.PORT || 3000;

//allow all origins for CORS
app.use(cors({
  origin: '*', // Be cautious with '*' in production
  methods: ['GET', 'POST', 'PUT', 'DELETE','PATCH'],
  credentials: true,
}));

app.use(express.json()); // For parsing application/json
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded

// Start the document reminder service ONCE
documentReminderService.start();


// Routes
app.get('/', (req, res) => {
  res.send('API is running...');
});

app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/stripeSubscription', stripeSubscriptionRouter);
app.use('/api/document', documentRouter);
app.use('/api/document-type', documentTypeRouter);

// Graceful shutdown
process.on('SIGTERM', () => {
    documentReminderService.stop();
});

app.use('/api/checks', dailyCheckRoutes);
app.use('/api/checklist-items', checklistItemRoutes)
app.use('/api/links', linkRoutes)

// if other  mean which i not declare then say hi hackers
app.use((req, res) => {
 res.send('Hi Hackers, you are not allowed to access this API');
});
// --- Global Error Handling Middleware ---
// Must have 4 arguments for Express to recognize it as error handler
app.use((err, req, res, next) => {
    err.statusCode = err.statusCode || 500; // Default to 500 Internal Server Error
    err.status = err.status || 'error';

    console.error('ERROR 💥:', err); // Log the full error stack

    // Send response
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        // Optionally include stack trace in development
        // stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
        error: err // Include the error object itself can sometimes be useful (or strip it in prod)
    });
});
// Start the server only if all critical checks passed
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);

  // You might also want to establish and check your database connection here
  // and potentially exit if it fails, or implement a retry mechanism.
});


// hello