import VetrogeneratorModel from '../models/Vetrogenerator.js';
import BaterijaModel from '../models/Baterija.js';
import SettingModel from '../models/Setting.js';
import { v4 as uuidv4 } from 'uuid';  // ES6 sintaksa za importovanje uuid
import axios from 'axios';

// Funkcija za dohvat trenutne brzine vjetra iz Weather API-ja
const getWindSpeed = async (latitude, longitude) => {
    try {
        const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=555759959b78b35d289a0baaf5ca0782`
        );
        const data = await response.data;
        const windSpeed = data.wind.speed; // Brzina vjetra u m/s
        return windSpeed;
    } catch (error) {
        console.error('Greška prilikom dohvatanja brzine vjetra:', error);
        throw error;
    }
};

const vetrogeneratorController = {
    createVB: async (req, res) => {
        try {
            const systemId = Math.random().toString(36).substring(2, 7);
            //const systemId = uuidv4(); 
            const { vlasnik, lokacija, nominalnaSnagaV, trenutnaSnagaV, kapacitetB,
                snagaB, trajanjePunjenaB, trajanjePraznjenjaB,
                napunjenostB, t1, t2
            } = req.body;

            if (lokacija.coordinates.length == 0) {
                res.status(500).json({ message: 'Niste izabrali lokaciju.', error: error.message });
            }
            else {
                const vetrogenerator = new VetrogeneratorModel({
                    vlasnik, lokacija, nominalnaSnagaV, trenutnaSnagaV, systemId
                });
                await vetrogenerator.save();

                const baterija = new BaterijaModel({
                    vlasnik, lokacija, kapacitetB, snagaB, trajanjePunjenaB,
                    trajanjePraznjenjaB, napunjenostB, t1, t2, systemId
                });
                await baterija.save();

                res.status(201).json({ message: 'Vetrogenerator i baterija kreirani.' });
            }

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
    },

    updateSettings: async (req, res) => {
        const { vmin, vfull, vmax } = req.body;

        try {
            let settings = await SettingModel.findOne();
            if (!settings) {
                settings = new SettingModel({ vmin, vfull, vmax });
            } else {
                settings.vmin = vmin;
                settings.vfull = vfull;
                settings.vmax = vmax;
            }

            await settings.save();
            res.status(200).json({ message: 'Postavke su uspešno ažurirane.' });
        } catch (error) {
            res.status(500).json({ message: 'Greška prilikom ažuriranja postavki.', error });
        }
    },

    getSettings: async (req, res) => {
        try {
            const settings = await SettingModel.findOne();
            res.status(200).json(settings);
        } catch (error) {
            res.status(500).json({ message: 'Greška prilikom dobijanja postavki.', error });
        }
    },

    startSystem: async (req, res) => {
        try {
            const id = req.query.id;
            // Pronađemo vetrogenerator i bateriju s odgovarajućim systemId-om
            const vetrogenerator = await VetrogeneratorModel.findOne({ systemId: id });
            const baterija = await BaterijaModel.findOne({ systemId: id });

            if (!vetrogenerator || !baterija) {
                return res.status(404).json({ message: 'Vetrogenerator ili baterija nisu pronađeni.' });
            }
            // Dohvatimo trenutnu brzinu vjetra na osnovu lokacije vetrogeneratora
            //const windSpeed = await getWindSpeed(vetrogenerator.lokacija.coordinates[1], vetrogenerator.lokacija.coordinates[0]);
            const windSpeed = 4;
            // Računamo električnu snagu vetrogeneratora na osnovu brzine vjetra
            // Dohvatimo postavke iz baze
            const settings = await SettingModel.findOne();
            const Vmin = settings.vmin; // Minimalna brzina vjetra (m/s)
            const Vfull = settings.vfull; // Dovoljna brzina vjetra (m/s)
            const Vmax = settings.vmax; // Maksimalna brzina vjetra (m/s)

            const Pn = vetrogenerator.nominalnaSnagaV; // Nominalna električna snaga vetrogeneratora (kW)  9 za BG

            let P = 0;
            if (windSpeed > Vmin && windSpeed < Vfull) {
                P = ((windSpeed - Vmin) / (Vmax - Vmin)) * Pn;
            } else if (windSpeed > Vfull && windSpeed < Vmax) {
                P = Pn;
            } else if (windSpeed < Vmin) {
                P = 0;
            } else if (windSpeed > Vmax) {
                P = 0;
            }

            vetrogenerator.trenutnaSnagaV = P;
            await vetrogenerator.save();

            // Pratimo trenutno vreme
            const currentTime = new Date();
            const currentHour = currentTime.getHours();

            // Određujemo trenutnu cenu energije
            let cenaEnergije = 0;
            const t1 = baterija.t1;
            const t2 = baterija.t2;
            if (currentHour >= 23 || currentHour < 7) {
                cenaEnergije = t2; // Cena energije t2 ako je trenutno vreme između 23:00 i 07:00
            } else {
                cenaEnergije = t1; // Inače, cena energije je t1
            }

            // Provjeravamo stanje baterije
            const kapacitetBaterije = 1000; // 1 MWh = 1000 kWh
            const snagaPunjenjaPraznjenja = kapacitetBaterije / 4; // 1 MWh / 4h = 250 kW/h

            if (baterija.napunjenostB < kapacitetBaterije && P > 0 && (currentHour >= 23 || currentHour < 7)) {
                baterija.stanje = "punjenje";
                baterija.napunjenostB += Math.min(snagaPunjenjaPraznjenja, P) * 4; // Punjenje za 4 sata
                if (baterija.napunjenostB > kapacitetBaterije) {
                  baterija.napunjenostB = kapacitetBaterije;
                }
              } else if (baterija.napunjenostB > 0 && currentHour >= 7) {
                baterija.stanje = "praznjenje";
                const isporucenaEnergija = Math.min(baterija.napunjenostB, snagaPunjenjaPraznjenja);
                baterija.napunjenostB -= isporucenaEnergija;
                // Ovdje šaljemo isporučenu energiju u mrežu
              } else if (baterija.napunjenostB === kapacitetBaterije || baterija.napunjenostB === 0) {
                baterija.stanje = "mirovanje";
              }

            // Ovdje možemo ažurirati stanje baterije i vjetrogeneratora u bazi podataka
            await baterija.save(); // Spremanje promjena u bateriji


            console.log(`Pokretanje sistema sa ID-jem: ${id}`);
            console.log(`Trenutna cena energije: ${cenaEnergije}`);
            res.status(200).json({ message: 'Sistem je pokrenut.' });
        } catch (error) {
            console.error('Greška prilikom pokretanja sistema:', error);
            res.status(500).json({ message: 'Došlo je do greške prilikom pokretanja sistema.' });
        }
    }

};


export default vetrogeneratorController;
