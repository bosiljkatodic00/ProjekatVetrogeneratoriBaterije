import UserModel from '../models/User.js';

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
    }

};

export default userController;
