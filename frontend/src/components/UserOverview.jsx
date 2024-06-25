import React, { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Map from './Map';
import { getV } from '../services/VBService';
import { getB } from '../services/VBService';
import { start } from '../services/VBService';
import { stop } from '../services/VBService';

const UserOverview = ({ refreshData }) => {
  const [vetrogenerators, setVetrogenerators] = useState([]);
  const [batteries, setBatteries] = useState([]);
  const [korisnik, setKorisnik] = useState(null);
  const [token, setToken] = useState(null);
  const [startedSystems, setStartedSystems] = useState([]);

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
        if (tokenFromStorage) {
          setToken(tokenFromStorage);
        }

      } catch (error) {
        console.error('Greška prilikom dobavljanja podataka:', error);
        alert('Došlo je do greške prilikom dobavljanja podataka.');
      }
    }
  };

  useEffect(() => {
    fetchData();

    const intervalId = setInterval(fetchData, 5000); // Fetch data every 5 seconds

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, [refreshData]);
/*
  const startSystem = async (systemId) => {
    try {
      // logika za pokretanje sistema
      const response = await start(systemId, token);
      if (response.message === 'Sistem je pokrenut.') {
        setStartedSystems(prev => [...prev, systemId]);
      }
      console.log(`Pokretanje sistema sa ID-jem: ${systemId}`);
    } catch (error) {
      console.error('Greška prilikom pokretanja sistema:', error);
      alert('Došlo je do greške prilikom pokretanja sistema.');
    }
  };
  */
/*
  const stopSystem = async (systemId) => {
    try {
      // Vaša logika za zaustavljanje sistema
      await stop(systemId, token);
      console.log(`Zaustavljanje sistema sa ID-jem: ${systemId}`);
    } catch (error) {
      console.error('Greška prilikom zaustavljanja sistema:', error);
      alert('Došlo je do greške prilikom zaustavljanja sistema.');
    }
  };
*/
  return (
    <div style={{ display: 'table' }}>
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
        <Map vetrogenerators={vetrogenerators} batteries={batteries} isClickable={false} />
      </div>
      <div style={{ display: 'flex', alignItems: 'stretch' }}>
        <div style={{ flex: 1, marginRight: '10px' }}>
          <Typography variant="h5" gutterBottom color='primary' style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }} >Vaši vetrogeneratori:</Typography>
          <TableContainer component={Paper} style={{ height: '90%', width: '100%' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell style={{ width: '33%' }}>ID sistema</TableCell>
                  <TableCell style={{ width: '33%' }}>ID vetrogeneratora</TableCell>
                  <TableCell style={{ width: '33%' }}>Snaga vetrogeneratora [MW]</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {vetrogenerators.map((vetrogenerator, index) => (
                  <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 }, height: '36px' }}>
                    <TableCell sx={{ padding: '6px 16px' }}>{vetrogenerator.systemId}</TableCell>
                    <TableCell sx={{ padding: '6px 16px' }}>{vetrogenerator._id}</TableCell>
                    <TableCell sx={{ padding: '6px 16px', alignItems: 'center', justifyContent: 'center' }}>{vetrogenerator.trenutnaSnagaV}</TableCell>                    
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>

        <div style={{ flex: 1 }}>
          <Typography variant="h5" gutterBottom color='primary' style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }} >Vaše baterije:</Typography>
          <TableContainer component={Paper} style={{ height: '90%' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell style={{ width: '33%' }}>ID baterije</TableCell>
                  <TableCell style={{ width: '33%' }}>Napunjenost baterije [MWh]</TableCell>
                  <TableCell style={{ width: '33%' }}>Status baterije</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {batteries.map((battery, index) => (
                  <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 }, height: '36px' }}>
                    <TableCell sx={{ padding: '6px 16px' }}>{battery._id}</TableCell>
                    <TableCell sx={{ padding: '6px 16px', alignItems: 'center', justifyContent: 'center' }}>{battery.napunjenostB}</TableCell>
                    <TableCell sx={{ padding: '6px 16px', alignItems: 'center', justifyContent: 'center' }}>{battery.stanje}</TableCell>
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
