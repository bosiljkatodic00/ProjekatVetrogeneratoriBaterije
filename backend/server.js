import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import UserModel from './models/User.js';
import authRoutes from './routes/authRoutes.js';
import vetrogeneratorRoutes from './routes/vetrogeneratorRoutes.js';
import userRoutes from './routes/userRoutes.js';
import cron from 'node-cron';
import vetrogeneratorController from './controllers/vetrogeneratorController.js';

// Initialize Express app
const app = express();

// Configure middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// Define routes
app.get('/', (req, res) => {
  res.send('Hello World!');
});
app.use('/auth', authRoutes);
app.use('/vb', vetrogeneratorRoutes);
app.use('/user', userRoutes);

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/vbDatabase', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(3000, () => {
      console.log('Server started on port 3000');
      // Periodično čuvanje istorijskih podataka svakih 60 minuta
      cron.schedule('*/60 * * * *', () => {
        try {
          vetrogeneratorController.updateSystemState();
          console.log('Running cron job: updateSystemState');
        } catch (error) {
          console.error('Error running cron job:', error);
        }
    });
    // 0 * * * * znači na početku svakog sata, svakog dana, svakog meseca, bez obzira na dan u nedelji
    });
  })
  .catch(err => console.log(err));
