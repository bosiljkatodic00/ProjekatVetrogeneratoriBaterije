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
    const { email } = req.body;

    // Provera da li postoji korisnik sa istim emailom u bazi
    UserModel.findOne({ email: email })
        .then(existingUser => {
            if (existingUser) {
                res.status(400).json({ message: "Korisnik sa tim emailom već postoji" });
            } else {
                // Ako ne postoji korisnik, napravi novog korisnika
                UserModel.create(req.body)
                    .then(newUser => res.status(201).json(newUser))
                    .catch(err => res.status(500).json({ message: "Došlo je do greške prilikom kreiranja korisnika", error: err }));
            }
        })
        .catch(err => res.status(500).json({ message: "Došlo je do greške prilikom provere korisnika", error: err }));
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  UserModel.findOne({ email: email })
      .then(user => {
          if (user) {
              if (user.password === password) {
                  // Dodajemo polje 'type' u odgovor
                  res.json({ message: "Success", type: user.userType, user: user });
              } else {
                  res.json({ message: "The password is incorrect" });
              }
          } else {
              res.json({ message: "No user with that email" });
          }
      })
      .catch(err => res.status(500).json({ message: "Došlo je do greške prilikom pretrage korisnika", error: err }));
});
