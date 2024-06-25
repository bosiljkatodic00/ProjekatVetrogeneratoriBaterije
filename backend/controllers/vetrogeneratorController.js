import VetrogeneratorModel from '../models/Vetrogenerator.js';
import BaterijaModel from '../models/Baterija.js';
import SettingModel from '../models/Setting.js';
import { HistoricalVetrogeneratorDataModel, HistoricalBatteryDataModel } from '../models/DataHistory.js';
import moment from 'moment-timezone';


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

let intervalId = null;
/*
const stopSystemUpdateState = async (id) => {
    try {
        const vetrogenerator = await VetrogeneratorModel.findOne({ systemId: id });
        const baterija = await BaterijaModel.findOne({ systemId: id });

        if (!vetrogenerator || !baterija) {
            console.error('Vetrogenerator ili baterija nisu pronađeni.');
            return;
        }

        vetrogenerator.trenutnaSnagaV = 0;
        await vetrogenerator.save();

        baterija.stanje = "mirovanje";
        await baterija.save();

        console.log(`Sistem sa ID-jem: ${id} je zaustavljen.`);
    } catch (error) {
        console.error('Greška prilikom zaustavljanja sistema:', error);
    }
}
*/


const saveVetrogeneratorData = async (vetrogenerator) => {
    const historicalData = new HistoricalVetrogeneratorDataModel({
        vetrogeneratorId: vetrogenerator._id,
        trenutnaSnagaV: vetrogenerator.trenutnaSnagaV,
        vlasnik: vetrogenerator.vlasnik,
        systemId: vetrogenerator.systemId
    });
    await historicalData.save();
};

const saveBatteryData = async (battery) => {
    const historicalData = new HistoricalBatteryDataModel({
        batteryId: battery._id,
        napunjenostB: battery.napunjenostB,
        vlasnik: battery.vlasnik,
        stanje: battery.stanje,
        systemId: battery.systemId
    });
    await historicalData.save();
};

/*
// Funkcija koja se periodično poziva za čuvanje istorijskih podataka
const saveHistoricalDataPeriodically = async () => {
    try {
        const vetrogenerators = await VetrogeneratorModel.find();
        const batteries = await BaterijaModel.find();

        vetrogenerators.forEach(saveVetrogeneratorData);
        batteries.forEach(saveBatteryData);

        console.log('Istorijski podaci su uspešno sačuvani.');
    } catch (error) {
        console.error('Greška prilikom čuvanja istorijskih podataka:', error);
    }
};
*/
// Pozovite ovu funkciju periodično, svakih sat vremena
//setInterval(saveHistoricalDataPeriodically, 60 * 60 * 1000);

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
                
                await updateSystemState(); //racunanje stanja sistema i cuvanje istorijskih podataka

                res.status(201).json({ message: 'Vetrogenerator i baterija kreirani. Sistem cete moci da pokrenete tek kada Admin unese potrebne parametre.' });
            }

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Greška prilikom kreiranja vetrogeneratora i baterije.', error: error.message });
        }
    },
    
    updateSystemState : async (req, res) => {
        try {
            const vetrogenerators = await VetrogeneratorModel.find();
            const batteries = await BaterijaModel.find();
    
            if (!vetrogenerators || !batteries) {
                console.error('Vetrogeneratori ili baterije nisu pronađeni.');
                return;
            }
    
            const settings = await SettingModel.findOne();
            const Vmin = settings.vmin;
            const Vfull = 3;
            const Vmax = 5;
    
            if (Vmin == 0 || Vmin == undefined || Vmin == null || Vmax == 0 || Vmax == undefined ||
                Vmax == null || Vfull == 0 || Vfull == undefined || Vfull == null) {
                console.error('Nije moguće pokrenuti sistem, admin nije unio sve potrebne podatke.');
                return;
            }
    
            for (let vetrogenerator of vetrogenerators) {
                const baterija = batteries.find(b => b.systemId === vetrogenerator.systemId);
    
                if (!baterija) {
                    console.error(`Baterija za sistem ${vetrogenerator.systemId} nije pronađena.`);
                    continue;
                }
    
                const windSpeed = await getWindSpeed(vetrogenerator.lokacija.coordinates[1], vetrogenerator.lokacija.coordinates[0]);
                console.log(`Brzina vjetra za sistem ${vetrogenerator.systemId}: ${windSpeed}`);
    
                const Pn = vetrogenerator.nominalnaSnagaV; // u [MW]
                let P = 0;
    
                if (windSpeed > Vmin && windSpeed < Vfull) {
                    P = ((windSpeed - Vmin) / (Vmax - Vmin)) * Pn;
                } else if (windSpeed > Vfull && windSpeed < Vmax) {
                    P = Pn;
                } else if (windSpeed < Vmin || windSpeed > Vmax) {
                    P = 0;
                }
                console.log(`Izračunata snaga za sistem ${vetrogenerator.systemId}: ${P}`);
    
                vetrogenerator.trenutnaSnagaV = P;
                await vetrogenerator.save();
    
                const currentTime = new Date();
                const currentHour = currentTime.getHours();
                const t1 = baterija.t1;
                const t2 = baterija.t2;
    
                let cenaEnergije = 0;
                if (currentHour >= 23 || currentHour < 7) {
                    cenaEnergije = t2;
                } else {
                    cenaEnergije = t1;
                }
    
                const kapacitetBaterije = baterija.kapacitetB; // npr. 1 MWh = 1000 kWh
                const snagaPunjenjaPraznjenja = kapacitetBaterije / 4; // npr. 250 kW/h = 0.25 MW/h
                //const updateInterval = 5000; // 5 sekundi
                //const brojIntervala = 4 * 60 * 60 * 1000 / updateInterval; // 4 sata * 60 minuta * 60 sekundi * 1000 milisekundi / 5000 ms = 2880
    
                if (baterija.napunjenostB < kapacitetBaterije && P > 0 && (currentHour >= 23 || currentHour < 7)) {
                    baterija.stanje = "punjenje";
                    baterija.napunjenostB += Math.min(snagaPunjenjaPraznjenja, P); // Dodaj punu snagu za jedan sat
                    if (baterija.napunjenostB > kapacitetBaterije) {
                        baterija.napunjenostB = kapacitetBaterije;
                    }
                } else if (baterija.napunjenostB > 0 && currentHour >= 7 && currentHour < 23) {
                    baterija.stanje = "praznjenje";
                    baterija.napunjenostB -= Math.min(baterija.napunjenostB, snagaPunjenjaPraznjenja); // Ispusti punu snagu za jedan sat
                    if (baterija.napunjenostB < 0) {
                        baterija.napunjenostB = 0;
                    }
                } else {
                    baterija.stanje = "mirovanje";
                }
    
                await baterija.save();
                console.log(`Sistem sa ID-jem: ${vetrogenerator.systemId} je ažuriran.`);
                console.log(`Trenutna cena energije: ${cenaEnergije}`);
    
                // Sačuvaj istorijske podatke
                await saveVetrogeneratorData(vetrogenerator);
                await saveBatteryData(baterija);
            }
            console.log('Svi sistemi su ažurirani.');
    
        } catch (error) {
            console.error('Greška prilikom ažuriranja sistema:', error);
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
/*
    startSystem: async (req, res) => {
        try {
            const id = req.query.id;

            await updateSystemState();

            res.status(200).json({ message: `Sistem je pokrenut.` });
        } catch (error) {
            console.error('Greška prilikom pokretanja sistema:', error);
            res.status(500).json({ message: 'Greška prilikom pokretanja sistema.', error: error.message });
        }
    },
    */
/*
    stopSystem: async (req, res) => {
        try {
            const id = req.query.id;
            if (intervalId) {
                clearInterval(intervalId);
                intervalId = null;
            }
            await stopSystemUpdateState(id);
            res.status(200).json({ message: `Sistem sa ID-jem: ${id} je zaustavljen.` });
        } catch (error) {
            console.error('Greška prilikom zaustavljanja sistema:', error);
            res.status(500).json({ message: 'Greška prilikom zaustavljanja sistema.', error: error.message });
        }
    }, 
*/
    getVDataHistory: async (req, res) => {
        try {
            const id = req.query.id;
            const historicalData = await HistoricalVetrogeneratorDataModel.find({ vlasnik : id }).sort({ timestamp: 1 });
            res.status(200).json(historicalData);
        } catch (error) {
            console.error('Greška prilikom dobavljanja istorije podataka vetrogeneratora', error);
            res.status(500).json({ message: 'Greška prilikom dobavljanja istorije podataka vetrogeneratora.', error: error.message });
        }
    },

    getBDataHistory: async (req, res) => {
        try {
            const id = req.query.id;
            const historicalData = await HistoricalBatteryDataModel.find({ vlasnik: id }).sort({ timestamp: 1 });
            res.status(200).json(historicalData);
        } catch (error) {
            console.error('Greška prilikom dobavljanja istorije podataka baterije', error);
            res.status(500).json({ message: 'Greška prilikom dobavljanja istorije podataka baterije.', error: error.message });
        }
    }


};


export default vetrogeneratorController;
