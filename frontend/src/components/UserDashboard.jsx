import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Map from './Map';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import backgroundImage from '../images/photo.jpg'; // Putanja do pozadinske slike
import backgroundImage2 from '../images/landscape.jpg'; // Putanja do pozadinske slike

import { createVB } from '../services/VBService';
import UserOverview from './UserOverview';

const UserDashboard = () => {
    const [korisnik, setKorisnik] = useState(null);
    const [token, setToken] = useState(null);
    const [refreshData, setRefreshData] = useState(false); // Dodajemo state za osvježavanje podataka

    useEffect(() => {
        const userFromStorage = JSON.parse(sessionStorage.getItem('korisnik'));
        const tokenFromStorage = sessionStorage.getItem('token');

        if (userFromStorage) {
            setKorisnik(userFromStorage);
            setFormData(prevState => ({
                ...prevState,
                vlasnik: userFromStorage._id // Postavite vlasnik odmah nakon učitavanja korisnika
            }));
        }
        if (tokenFromStorage) {
            setToken(tokenFromStorage);
        }
    }, []);

    const [formData, setFormData] = useState({
        vlasnik: '', // ID korisnika
        lokacija: { type: 'Point', coordinates: [] },
        nominalnaSnagaV: 0,
        trenutnaSnagaV: 0,
        kapacitetB: 1,
        snagaB: 0,
        trajanjePunjenaB: 4,
        trajanjePraznjenjaB: 4,
        napunjenostB: 0,
        t1: 0,
        t2: 0
    });


    const handleMapClick = (lat, lng) => {
        setFormData({
            ...formData,
            lokacija: {
                type: 'Point',
                coordinates: [lng, lat]
            }
        });
    };

    const handleSubmitVetrogeneratorBaterija = async (e) => {
        e.preventDefault();
        const tokenP = sessionStorage.getItem('token'); // Preuzimanje tokena iz sessionStorage ili drugdje gdje ga pohranjujete

        try {
            await createVB(formData, tokenP);
            alert('Vetrogenerator i baterija kreirani.');
            handleRefreshData();

        } catch (error) {
            console.error(error);
            alert('Greška prilikom kreiranja vetrogeneratora i baterije.');
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // Definiramo funkciju za osvježavanje podataka
    const handleRefreshData = () => {
        setRefreshData(!refreshData); // Invertujemo trenutnu vrijednost refreshData kako bi se osvježila komponenta UserOverview
    };


    return (
        <div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', padding: '20px', backgroundRepeat: 'repeat-y' }}>
                <Box sx={{ bgcolor: 'rgba(255, 255, 255, 0.6)', p: 3, borderRadius: 5, marginTop: '10px',  width: '60%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Typography variant="h4" color='primary' gutterBottom>
                        Dobrodošli na User Dashboard!
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                        <UserOverview refreshData={handleRefreshData} />

                    </Box>
                </Box>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover' }}>
                <Box sx={{ bgcolor: 'rgba(255, 255, 255, 0.6)', p: 3, height: '95%', borderRadius: 5, marginTop: '20px', width: '60%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

                    <Box sx={{ width: '100%' }}>
                        <Typography variant="h5" color='primary' gutterBottom align="center">
                            Dodaj novi sistem
                        </Typography>
                        <Typography variant="body1" color='primary' paragraph align="center">
                            Unesite podatke o vetrogeneratoru i bateriji:
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                            <Map onMapClick={handleMapClick} isClickable={true} />
                            <form onSubmit={handleSubmitVetrogeneratorBaterija} style={{ width: '100%', marginTop: '20px' }}>
                                <Typography variant="body1" color='primary' paragraph>
                                    Podaci o vetrogeneratoru:
                                </Typography>
                                <TextField
                                    label="Nominalna snaga"
                                    variant="outlined"
                                    name="nominalnaSnagaV"
                                    value={formData.nominalnaSnagaV}
                                    onChange={handleChange}
                                    fullWidth
                                    margin="normal"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                                <Typography variant="body1" color='primary' paragraph>
                                    Podaci o bateriji:
                                </Typography>
                                <TextField
                                    label="Kapacitet baterije"
                                    variant="outlined"
                                    name="kapacitetB"
                                    value={formData.kapacitetB}
                                    onChange={handleChange}
                                    fullWidth
                                    margin="normal"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                                <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                                    Kreiraj
                                </Button>
                            </form>
                        </Box>
                    </Box>
                </Box>

            </div>
        </div>

    );
};


export default UserDashboard;