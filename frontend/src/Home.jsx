import React from "react";
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import './styles.css'
import backgroundImage from './photo.jpg'; // Putanja do pozadinske slike

const Home = () => {
    const theme = useTheme();

    return (
        <div style={{ textAlign: 'center', backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center', minHeight: '95vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ position: 'relative', zIndex: 1, padding: '20px', backgroundColor: 'rgba(255, 255, 255, 0.5)', border: '2px solid white', borderRadius: '10px' }}>

            <Typography variant="h5" gutterBottom style={{ color: '#003C43' }}>
            <strong >Dobro došli!</strong>
            </Typography>
            <Typography variant="h5" color='#003C43' paragraph>
                Ukoliko ste već registrovani, izaberite opciju <strong >LOG IN</strong>.
            </Typography>
            <Typography variant="h5" color='#003C43' paragraph>
                Ukoliko niste registrovani, izaberite opciju <strong>REGISTRATION</strong>.
            </Typography>
            </div>
        </div>
    );
}

export default Home;
