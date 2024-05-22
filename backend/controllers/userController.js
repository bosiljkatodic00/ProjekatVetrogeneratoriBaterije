import UserModel from '../models/User.js';
import VetrogeneratorModel from '../models/Vetrogenerator.js';
import BaterijaModel from '../models/Baterija.js';

const userController = {
    getAllUsers: async (req, res) => {
        try {
            // Dobavljanje svih korisnika čiji je userType 'User'
            const users = await UserModel.find({ userType: 'user' });
            res.status(200).json(users);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Greška prilikom dobavljanja korisnika.', error: error.message });
        }
    },

    blockUser: async (req, res) => {
        try {
            const { userId } = req.body;
         const user = await UserModel.findById(userId);
            if (!user) {
                return res.status(404).json({ message: 'Korisnik nije pronađen.' });
            }
            user.isBlocked = true;
            await user.save();

            await VetrogeneratorModel.deleteMany({ vlasnik: userId });
            await BaterijaModel.deleteMany({ vlasnik: userId });
      
            return res.status(200).json({ message: 'Korisnik je uspešno blokiran, a njegovi vjetrogeneratori i baterije su obrisani.' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Greška prilikom blokiranja korisnika.', error: error.message });
        }
    }
};



export default userController;
