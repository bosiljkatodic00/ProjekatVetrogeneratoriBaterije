import axios from 'axios';
import UserModel from '../models/UserModel';

const baseUrl = 'http://localhost:3000';


export const login = async (email, password, token) => {
    try {
        const { data } = await axios.post(`${baseUrl}/auth/login`, JSON.stringify({ email, password, token }), 
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

export const register = async (formdata, token) => {
    try {
        const { data } = await axios.post(`${baseUrl}/auth/register`, JSON.stringify( formdata, token ), 
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        });
        return data;
    } catch (error) {
        console.error(error);
        throw new Error('Greška prilikom registracije korisnika.');
    }
};