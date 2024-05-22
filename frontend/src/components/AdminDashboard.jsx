import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { getUsers, blockUser, deleteVB, updateVB } from '../services/AdminService';
import { getV } from '../services/AdminService';
import { getB } from '../services/AdminService';

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [vetrogenerators, setVetrogenerators] = useState([]);
    const [batteries, setBatteries] = useState([]);
    const [token, setToken] = useState(null);

    useEffect(() => {
        const tokenFromStorage = sessionStorage.getItem('token');

        if (tokenFromStorage) {
          setToken(tokenFromStorage);
        }
      }, []);

      useEffect(() => {
        const fetchData = async () => {
          if (token) {
            try {
              // Preuzimanje korisnika, vetrogeneratora i baterija paralelno
              const [responseU, responseV, responseB] = await Promise.all([
                getUsers(token),
                getV(token),
                getB(token)
              ]);
              
              setUsers(responseU)
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
      }, [token]);

    const handleBlockUser = async (userId) => {
        try {
            await blockUser(userId, token);
            setUsers(users.map(user => user._id === userId ? { ...user, isBlocked: true } : user));
            alert('Korisnik uspješno blokiran.');
        } catch (error) {
            console.error('Greška prilikom blokiranja korisnika:', error);
            alert('Neuspješno blokiranje korisnika.');
        }
    };

    const handleDeleteVB = async (vbId) => {
        try {
            await deleteVB(vbId, token);
            alert('Uspješno obrisano.');
            setVetrogenerators(vetrogenerators.filter(vb => vb._id !== vbId));
            setBatteries(batteries.filter(b => b._id !== vbId));
        } catch (error) {
            console.error('Greška prilikom brisanja:', error);
            alert('Neuspješno brisanje.');
        }
    };

    const handleUpdateVB = async (vbId, data) => {
        try {
            await updateVB(vbId, data, token);
            alert('Uspješno ažurirano.');
            // Osvježite podatke ili upravljajte stanjem prema potrebi
        } catch (error) {
            console.error('Greška prilikom ažuriranja:', error);
            alert('Neuspješno ažuriranje.');
        }
    };

    return (
        <Box sx={{ padding: 3 }}>
            <Typography variant="h4" gutterBottom>Admin Dashboard</Typography>
            <Box sx={{ marginBottom: 5 }}>
                <Typography variant="h5" gutterBottom>Svi korisnici</Typography>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Ime</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Akcija</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {users.map(user => (
                                <TableRow key={user._id}>
                                    <TableCell>{user._id}</TableCell>
                                    <TableCell>{user.firstName}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>
                                        {user.isBlocked ? (
                                            <Button disabled>Blokiran</Button>
                                        ) : (
                                            <Button onClick={() => handleBlockUser(user._id)} color="secondary">
                                                Blokiraj
                                            </Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
            <Box sx={{ marginBottom: 5 }}>
                <Typography variant="h5" gutterBottom>Svi vetrogeneratori</Typography>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Nominalna snaga</TableCell>
                                <TableCell>Trenutna snaga</TableCell>
                                <TableCell>Vlasnik ID</TableCell>
                                <TableCell>Akcija</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {vetrogenerators.map(v => (
                                <TableRow key={v._id}>
                                    <TableCell>{v._id}</TableCell>
                                    <TableCell>{v.nominalnaSnagaV}</TableCell>
                                    <TableCell>{v.trenutnaSnagaV}</TableCell>
                                    <TableCell>{v.vlasnik}</TableCell>
                                    <TableCell>
                                        <Button variant="contained" color="primary" onClick={() => handleUpdateVB(v._id, {/* pass data here */})}>
                                            Izmijeni
                                        </Button>
                                        <Button variant="contained" color="secondary" onClick={() => handleDeleteVB(v._id)}>
                                            Obriši
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
            <Box>
                <Typography variant="h5" gutterBottom>Sve baterije</Typography>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Kapacitet</TableCell>
                                <TableCell>Vlasnik ID</TableCell>
                                <TableCell>Napunjenost</TableCell>
                                <TableCell>Trajanje punjenja</TableCell>
                                <TableCell>Trajanje pražnjenja</TableCell>
                                <TableCell>t1</TableCell>
                                <TableCell>t2</TableCell>
                                <TableCell>Stanje</TableCell>
                                <TableCell>Akcija</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {batteries.map(b => (
                                <TableRow key={b._id}>
                                    <TableCell>{b._id}</TableCell>
                                    <TableCell>{b.kapacitetB}</TableCell>
                                    <TableCell>{b.vlasnik}</TableCell>
                                    <TableCell>{b.napunjenostB}</TableCell>
                                    <TableCell>{b.trajanjePunjenaB}</TableCell>
                                    <TableCell>{b.trajanjePraznjenjaB}</TableCell>
                                    <TableCell>{b.t1}</TableCell>
                                    <TableCell>{b.t2}</TableCell>
                                    <TableCell>{b.stanje}</TableCell>
                                    <TableCell>
                                        <Button variant="contained" color="primary" onClick={() => handleUpdateVB(b._id, {/* pass data here */})}>
                                            Izmijeni
                                        </Button>
                                        <Button variant="contained" color="secondary" onClick={() => handleDeleteVB(b._id)}>
                                            Obriši
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </Box>
    );
};

export default AdminDashboard;
