import VetrogeneratorModel from '../models/Vetrogenerator.js';
import BaterijaModel from '../models/Baterija.js';

const vetrogeneratorController = {
    createVB: async (req, res) => {
        try {
            const { vlasnik, lokacija, nominalnaSnagaV, trenutnaSnagaV, kapacitetB, snagaB, trajanjePunjenaB, trajanjePraznjenjaB, napunjenostB, t1, t2 } = req.body;
            const vetrogenerator = new VetrogeneratorModel({ vlasnik, lokacija, nominalnaSnagaV, trenutnaSnagaV });
            await vetrogenerator.save();
            const baterija = new BaterijaModel({ vlasnik, lokacija, kapacitetB, snagaB, trajanjePunjenaB, trajanjePraznjenjaB, napunjenostB, t1, t2 });
            await baterija.save();
            res.status(201).json({ message: 'Vetrogenerator i baterija kreirani.' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Greška prilikom kreiranja vetrogeneratora i baterije.', error: error.message });
        }
    },


    getVForUser: async (req, res) => {
        try {
            // Korisnik iz sesije
            console.log(req.query);

            const id = req.query.id;


            // Dobavljanje vetrogeneratora za datog korisnika
            const vetrogenerators = await VetrogeneratorModel.find({ vlasnik: id });

            res.status(200).json(vetrogenerators);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Greška prilikom dobavljanja vetrogeneratora.', error: error.message });
        }
    },

    getBForUser: async (req, res) => {
        try {
            // Korisnik iz sesije
            const id = req.query.id;


            // Dobavljanje baterija za datog korisnika
            const batteries = await BaterijaModel.find({ vlasnik: id });

            res.status(200).json(batteries);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Greška prilikom dobavljanja baterija.', error: error.message });
        }
    },

    getAllVetrogenerators: async (req, res) => {
        try {
            const vetrogenerators = await VetrogeneratorModel.find();
            res.status(200).json(vetrogenerators);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Greška prilikom dobavljanja vetrogeneratora.', error: error.message });
        }
    },

    getAllBatteries: async (req, res) => {
        try {
            const batteries = await BaterijaModel.find();
            res.status(200).json(batteries);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Greška prilikom dobavljanja baterija.', error: error.message });
        }
    },
    deleteVetrogenerator: async (req, res) => {
        try {
            const { vId } = req.params;
            await VetrogeneratorModel.findByIdAndDelete(vId);
            res.status(200).json({ message: 'Vetrogenerator uspješno obrisan.' });
        } catch (error) {
            console.error('Greška prilikom brisanja vetrogeneratora:', error);
            res.status(500).json({ message: 'Greška prilikom brisanja vetrogeneratora.' });
        }
    },
    
    deleteBaterija: async (req, res) => {
        try {
            const { bId } = req.params;
            await BaterijaModel.findByIdAndDelete(bId);
            res.status(200).json({ message: 'Baterija uspješno obrisana.' });
        } catch (error) {
            console.error('Greška prilikom brisanja baterije:', error);
            res.status(500).json({ message: 'Greška prilikom brisanja baterije.' });
        }
    },

    // Funkcija za ažuriranje vetrogeneratora
    updateVetrogenerator: async (req, res) => {
        const { vId } = req.params;
        const updateData = req.body;
        try {
            const updatedVetrogenerator = await VetrogeneratorModel.findByIdAndUpdate(vId, updateData, { new: true });
            if (!updatedVetrogenerator) {
                return res.status(404).json({ message: 'Vetrogenerator nije pronađen.' });
            }
            res.status(200).json(updatedVetrogenerator);
        } catch (error) {
            res.status(500).json({ message: 'Greška prilikom ažuriranja vetrogeneratora.', error });
        }
    },

    // Funkcija za ažuriranje baterije
    updateBaterija: async (req, res) => {
        const { bId } = req.params;
        const updateData = req.body;
        try {
            const updatedBaterija = await BaterijaModel.findByIdAndUpdate(bId, updateData, { new: true });
            if (!updatedBaterija) {
                return res.status(404).json({ message: 'Baterija nije pronađena.' });
            }
            res.status(200).json(updatedBaterija);
        } catch (error) {
            res.status(500).json({ message: 'Greška prilikom ažuriranja baterije.', error });
        }
    }

};


export default vetrogeneratorController;
