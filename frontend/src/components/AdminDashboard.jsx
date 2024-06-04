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
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import { FormControl } from '@mui/material';
import { getUsers, blockUser, deleteV, deleteB, getV, getB, updateV, updateB, updateSettings, getSettings } from '../services/AdminService';
import Map from './Map'; // Importujte Map komponentu iz userdashboard
import Weather from './Weather';

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [vetrogenerators, setVetrogenerators] = useState([]);
    const [batteries, setBatteries] = useState([]);
    const [token, setToken] = useState(null);

    const [open, setOpen] = useState(false);
    const [currentVB, setCurrentVB] = useState({});
    const [isEditingV, setIsEditingV] = useState(true);

    const [vmin, setVmin] = useState('');
    const [vfull, setVfull] = useState('');
    const [vmax, setVmax] = useState('');

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
                    const [responseU, responseV, responseB, responseSettings] = await Promise.all([getUsers(token), getV(token), getB(token), getSettings(token)]);
                    setUsers(responseU);
                    setVetrogenerators(responseV);
                    setBatteries(responseB);
                    setVmin(responseSettings.vmin);
                    setVfull(responseSettings.vfull);
                    setVmax(responseSettings.vmax);
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

    const handleDeleteV = async (vId) => {
        try {
            await deleteV(vId, token);
            alert('Uspješno obrisano.');
            setVetrogenerators(vetrogenerators.filter(vb => vb._id !== vId));
        } catch (error) {
            console.error('Greška prilikom brisanja:', error);
            alert('Neuspješno brisanje.');
        }
    };

    const handleDeleteB = async (bId) => {
        try {
            await deleteB(bId, token);
            alert('Uspješno obrisano.');
            setBatteries(batteries.filter(vb => vb._id !== bId));
        } catch (error) {
            console.error('Greška prilikom brisanja:', error);
            alert('Neuspješno brisanje.');
        }
    };

    const handleUpdateV = async (vId, data) => {
        try {
            const updatedVetrogenerator = await updateV(vId, data, token);
            setVetrogenerators(vetrogenerators.map(vb => vb._id === vId ? updatedVetrogenerator : vb));
            alert('Vetrogenerator uspješno ažuriran.');
            // Osvježite podatke ili upravljajte stanjem prema potrebi
        } catch (error) {
            console.error('Greška prilikom ažuriranja vetrogeneratora:', error);
            alert('Neuspješno ažuriranje vetrogeneratora.');
        }
    };

    const handleUpdateB = async (bId, data) => {
        try {
            const updatedBaterija = await updateB(bId, data, token);
            setBatteries(batteries.map(b => b._id === bId ? updatedBaterija : b));
            alert('Baterija uspješno ažurirana.');
            // Osvježite podatke ili upravljajte stanjem prema potrebi
        } catch (error) {
            console.error('Greška prilikom ažuriranja baterije:', error);
            alert('Neuspješno ažuriranje baterije.');
        }
    };

    const handleOpenUpdateModal = (vb, isVetrogenerator) => {
        setCurrentVB(vb);
        setIsEditingV(isVetrogenerator);
        setOpen(true);
    };

    const handleCloseUpdateModal = () => {
        setOpen(false);
        setCurrentVB({});
    };

    const handleChange = (e) => {
        setCurrentVB({
            ...currentVB,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmitUpdate = async () => {
        if (isEditingV) {
            await handleUpdateV(currentVB._id, currentVB);
        } else {
            await handleUpdateB(currentVB._id, currentVB);
        }
        handleCloseUpdateModal();
    };

    const handleSubmit = async () => {
        try {
            await updateSettings(vmin, vfull, vmax, token);
            alert(`Postavke su uspešno ažurirane: Vmin=${vmin}, Vfull=${vfull}, Vmax=${vmax}`);
        } catch (error) {
            alert('Greška prilikom ažuriranja postavki.');
        }
    };

    return (
        <Box sx={{ alignItems: 'center', justifyContent: 'center', backgroundColor: '#88bcc3', padding: 3}}>
            <Typography variant="h4" gutterBottom>Admin Dashboard</Typography>
            <Box sx={{ display: 'flex',  alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row', gap: 2, backgroundColor: 'white' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2, marginTop: 2, marginLeft: 2 }}>
                    <Weather />
                </Box>
                <Box sx={{ marginRight: 2 }}>
                    <Typography variant="h5" gutterBottom>Podaci potrebni za početak rada sistema:</Typography>
                    <FormControl component="fieldset" sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
                        <TextField
                            id="vmin"
                            label="Vmin"
                            variant="outlined"
                            value={vmin}
                            onChange={(e) => setVmin(e.target.value)}
                            sx={{ marginBottom: 1, marginTop: 1 }}
                        />
                        <TextField
                            id="vfull"
                            label="Vfull"
                            variant="outlined"
                            value={vfull}
                            onChange={(e) => setVfull(e.target.value)}
                            sx={{ marginBottom: 1, marginTop: 1 }}
                        />
                        <TextField
                            id="vmax"
                            label="Vmax"
                            variant="outlined"
                            value={vmax}
                            onChange={(e) => setVmax(e.target.value)}
                            sx={{ marginBottom: 1, marginTop: 1 }}
                        />
                        <Button sx={{ width: '200px', height: '55px', marginBottom: 1, marginTop: 1 }} variant="contained" color="primary" onClick={handleSubmit}>
                            Podesi
                        </Button>
                    </FormControl>
                </Box>

            </Box>
            <Box sx={{ marginBottom: 5, marginTop:3 }}>
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
            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'centre', justifyContent: 'center' }}>
                <Map vetrogenerators={vetrogenerators} isClickable={false} />
            </Box>
            <Box sx={{ marginBottom: 5 }}>
                <Typography variant="h5" gutterBottom>Svi vetrogeneratori</Typography>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                            <TableCell>ID sistema</TableCell>
                                <TableCell>ID vetrogeneratora</TableCell>
                                <TableCell>Nominalna snaga</TableCell>
                                <TableCell>Trenutna snaga</TableCell>
                                <TableCell>Vlasnik ID</TableCell>
                                <TableCell>Akcija</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {vetrogenerators.map(v => (
                                <TableRow key={v._id}>
                                    <TableCell>{v.systemId}</TableCell>
                                    <TableCell>{v._id}</TableCell>
                                    <TableCell>{v.nominalnaSnagaV}</TableCell>
                                    <TableCell>{v.trenutnaSnagaV}</TableCell>
                                    <TableCell>{v.vlasnik}</TableCell>
                                    <TableCell>
                                        <Button variant="contained" color="primary" onClick={() => handleOpenUpdateModal(v, true)}>
                                            Izmijeni
                                        </Button>
                                        <Button variant="contained" color="secondary" onClick={() => handleDeleteV(v._id)}>
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
                                <TableCell>ID sistema</TableCell>
                                <TableCell>ID baterije</TableCell>
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
                                    <TableCell>{b.systemId}</TableCell>
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
                                        <Button variant="contained" color="primary" onClick={() => handleOpenUpdateModal(b, false)}>
                                            Izmijeni
                                        </Button>
                                        <Button variant="contained" color="secondary" onClick={() => handleDeleteB(b._id)}>
                                            Obriši
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
            <Dialog open={open} onClose={handleCloseUpdateModal}>
                <DialogTitle>{isEditingV ? "Ažuriraj Vetrogenerator" : "Ažuriraj Bateriju"}</DialogTitle>
                <DialogContent>
                    {isEditingV ? (
                        <>
                            <TextField
                                margin="dense"
                                name="nominalnaSnagaV"
                                label="Nominalna snaga"
                                type="number"
                                fullWidth
                                variant="standard"
                                value={currentVB.nominalnaSnagaV || ""}
                                onChange={handleChange}
                            />
                        </>
                    ) : (
                        <>
                            <TextField
                                margin="dense"
                                name="t1"
                                label="t1 baterije"
                                type="number"
                                fullWidth
                                variant="standard"
                                value={currentVB.t1 || ""}
                                onChange={handleChange}
                            />
                            <TextField
                                margin="dense"
                                name="t2"
                                label="t2 baterije"
                                type="number"
                                fullWidth
                                variant="standard"
                                value={currentVB.t2 || ""}
                                onChange={handleChange}
                            />
                        </>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseUpdateModal} color="secondary">
                        Otkaži
                    </Button>
                    <Button onClick={handleSubmitUpdate} color="primary">
                        Ažuriraj
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default AdminDashboard;
