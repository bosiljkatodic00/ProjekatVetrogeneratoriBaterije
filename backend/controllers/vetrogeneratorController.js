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
    }

};
export default vetrogeneratorController;
