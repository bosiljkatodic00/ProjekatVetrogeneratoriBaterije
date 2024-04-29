import axios from 'axios';
import UserModel from '../models/UserModel';

const baseUrl = 'http://localhost:3000/auth';


export const login = async (email, password, token) => {
    try {
        const { data } = await axios.post(`${baseUrl}/login`, JSON.stringify({ email, password, token }), 
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        });
        return data;
    } catch (error) {
        console.error(error);
        throw new Error('Greška prilikom prijave korisnika.');
    }
};