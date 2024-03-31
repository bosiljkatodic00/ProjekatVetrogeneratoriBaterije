import React from "react";
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';

const Home = () => {
    const theme = useTheme();

    return (
        <div style={{ textAlign: 'center', backgroundColor: '#C8E6C9', minHeight: '95vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <Typography variant="h3" gutterBottom style={{ color: theme.palette.primary.main }}>
                Dobro došli!
            </Typography>
            <Typography variant="h5" color="textSecondary" paragraph>
                Ukoliko ste već registrovani, izaberite opciju <strong >Log In</strong>.
            </Typography>
            <Typography variant="h5" color="textSecondary" paragraph>
                Ukoliko niste registrovani, izaberite opciju <strong>Registration</strong>.
            </Typography>
        </div>
    );
}

export default Home;
