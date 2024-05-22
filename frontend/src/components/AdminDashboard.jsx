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
/*
    const handleBlockUser = async (userId) => {
        try {
            await blockUser(userId);
            alert('User blocked successfully.');
            setUsers(users.filter(user => user._id !== userId));
        } catch (error) {
            console.error('Error blocking user:', error);
            alert('Failed to block user.');
        }
    };

    const handleDeleteVB = async (vbId) => {
        try {
            await deleteVB(vbId);
            alert('Deleted successfully.');
            setVetrogenerators(vetrogenerators.filter(vb => vb._id !== vbId));
            setBatteries(batteries.filter(vb => vb._id !== vbId));
        } catch (error) {
            console.error('Error deleting:', error);
            alert('Failed to delete.');
        }
    };
*/
    return (
        <Box sx={{ padding: 3 }}>
            <Typography variant="h4" gutterBottom>Admin Dashboard</Typography>
            <Box sx={{ marginBottom: 5 }}>
                <Typography variant="h5" gutterBottom>All Users</Typography>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {users.map(user => (
                                <TableRow key={user._id}>
                                    <TableCell>{user._id}</TableCell>
                                    <TableCell>{user.firstName}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
            <Box sx={{ marginBottom: 5 }}>
                <Typography variant="h5" gutterBottom>All Vetrogenerators</Typography>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Nominalna snaga</TableCell>
                                <TableCell>Trenutna snaga</TableCell>
                                <TableCell>Owner ID</TableCell>
                                <TableCell>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {vetrogenerators.map(v => (
                                <TableRow key={v._id}>
                                    <TableCell>{v._id}</TableCell>
                                    <TableCell>{v.nominalnaSnagaV}</TableCell>
                                    <TableCell>{v.trenutnaSnagaV}</TableCell>
                                    <TableCell>{v.vlasnik}</TableCell>
                                    
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
            <Box>
                <Typography variant="h5" gutterBottom>All Batteries</Typography>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Capacity</TableCell>
                                <TableCell>Owner ID</TableCell>
                                <TableCell>Napunjenost</TableCell>
                                <TableCell>Trajanje punjenja</TableCell>
                                <TableCell>Trajanje praznjenja</TableCell>
                                <TableCell>t1</TableCell>
                                <TableCell>t2</TableCell>

                                <TableCell>Stanje</TableCell>
                                <TableCell>Action</TableCell>
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
