import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import UserModel from './models/User.js';
import authRoutes from './routes/authRoutes.js';

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

// Define routes
app.use('/auth', authRoutes);

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/vbDatabase', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(3000, () => {
      console.log('Server started on port 3000');
    });
  })
  .catch(err => console.log(err));
