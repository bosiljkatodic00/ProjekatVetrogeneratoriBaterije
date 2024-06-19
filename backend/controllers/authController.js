import UserModel from '../models/User.js';
import bcrypt from 'bcrypt';

const authController = {
  register: async (req, res) => {
    const { email, password } = req.body;

    try {
      const existingUser = await UserModel.findOne({ email: email });
      if (existingUser) {
        return res.status(400).json({ message: "Korisnik sa tim emailom već postoji" });
      } else {
        // Heširanje lozinke pre čuvanja u bazi
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await UserModel.create({ ...req.body, password: hashedPassword });
        return res.status(201).json(newUser);
      }
    } catch (err) {
      return res.status(500).json({ message: "Došlo je do greške prilikom kreiranja korisnika", error: err });
    }
  },

  login: async (req, res) => {
    const { email, password } = req.body;

    try {
      const user = await UserModel.findOne({ email: email });
      if (user) {
        // Provera da li je korisnik blokiran
        if (user.isBlocked) {
          return res.status(403).json({ message: 'Vaš nalog je blokiran. Molimo kontaktirajte podršku.' });
        }

        // Upoređivanje unete lozinke sa heširanom lozinkom iz baze
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (isPasswordValid) {
          return res.json({ message: "Success", type: user.userType, user: user });
        } else {
          return res.json({ message: "The password is incorrect" });
        }
      } else {
        return res.json({ message: "No user with that email" });
      }
    } catch (err) {
      return res.status(500).json({ message: "Došlo je do greške prilikom pretrage korisnika", error: err });
    }
  }
};

export default authController;
