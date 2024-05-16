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
    }
};

export default vetrogeneratorController;
