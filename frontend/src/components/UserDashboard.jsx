import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import Map  from './Map';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import backgroundImage from '../images/photo.jpg'; // Putanja do pozadinske slike
import { createVB } from '../services/VBService';

const UserDashboard = () => {
    const [korisnik, setKorisnik] = useState(null);
    const [token, setToken] = useState(null);

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


    return (
        <div style={{ textAlign: 'center', backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center', minHeight: '95vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <Box sx={{ bgcolor: 'rgba(255, 255, 255, 0.7)', p: 3, borderRadius: 5 }}>
                <Typography variant="h5" color='primary' gutterBottom>
                    Dobrodošli na User Dashboard!
                </Typography>
                <Typography variant="body1" color='primary' paragraph>
                    Unesite podatke o vetrogeneratoru i bateriji:
                </Typography>
                <Map onMapClick={handleMapClick} />
                <form onSubmit={handleSubmitVetrogeneratorBaterija}>
                    {/* Forma za kreiranje vetrogeneratora */}
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
                    <Button type="submit" variant="contained" color="primary" fullWidth>
                        Kreiraj
                    </Button>
                </form>
            </Box>
        </div>
    );
};

export default UserDashboard;