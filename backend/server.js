// Import dependencies
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const UserModel = require('./models/User')

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



// Start the server
mongoose.connect('mongodb://localhost:27017/vbDatabase', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(3000, () => {
      console.log('Server started on port 3000');
    });
  })
  .catch(err => console.log(err));

  app.post('/register', (req, res) => {
    UserModel.create(req.body)
    .then(allUsers => res.json(allUsers))
    .catch(err => res.json(err))
  });

  app.post('/login', (req, res) => {
    const {email, password} = req.body;
    UserModel.findOne({email: email})
    .then(user => {   
      if(user) {
        if(user.password === password) {
          res.json("Success")
        }else{
          res.json("The password is incorrect")
        }
      }else{
          res.json("No user with that email")
      }
    })
  });