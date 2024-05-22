import React, { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Map from './Map'; // Importujte Map komponentu iz userdashboard
import { getV } from '../services/VBService';
import { getB } from '../services/VBService';

const UserOverview = ({ refreshData }) => {
  const [vetrogenerators, setVetrogenerators] = useState([]);
  const [batteries, setBatteries] = useState([]);
  const [korisnik, setKorisnik] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const userFromStorage = JSON.parse(sessionStorage.getItem('korisnik'));
      const tokenFromStorage = sessionStorage.getItem('token');

      if (userFromStorage && tokenFromStorage) {
        setKorisnik(userFromStorage);
        setToken(tokenFromStorage);

        try {
          const [responseV, responseB] = await Promise.all([
            getV(userFromStorage._id, tokenFromStorage),
            getB(userFromStorage._id, tokenFromStorage)
          ]);
          
          // Postavljanje stanja za vetrogeneratore i baterije
          setVetrogenerators(responseV);
          setBatteries(responseB);
          
          alert('Podaci uspješno dobavljeni.');
        } catch (error) {
          console.error('Greška prilikom dobavljanja podataka:', error);
          alert('Došlo je do greške prilikom dobavljanja podataka.');
        }
      }
    };

    fetchData();
  }, [refreshData]);

  return (
    <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', marginBottom: '20px' }}>
      <div style={{ display: 'flex' }}>
        <div>
          <Typography variant="h5" gutterBottom color='primary' >Vaši vetrogeneratori:</Typography>
          <Map vetrogenerators={vetrogenerators} batteries={batteries} isClickable={false} />
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID vetrogeneratora</TableCell>
                  <TableCell>Snaga vetrogeneratora</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {vetrogenerators.map((vetrogenerator, index) => (
                  <TableRow key={index}>
                    <TableCell>{vetrogenerator._id}</TableCell>
                    <TableCell>{vetrogenerator.trenutnaSnagaV}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>

        <div>
          <Typography variant="h5" gutterBottom color='primary' >Vaše baterije:</Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID baterije</TableCell>
                  <TableCell>Napunjenost baterije</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {batteries.map((battery, index) => (
                  <TableRow key={index}>
                    <TableCell>{battery._id}</TableCell>
                    <TableCell>{battery.napunjenostB}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
    </div>
  );
};

export default UserOverview;
