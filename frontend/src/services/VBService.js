import axios from 'axios';

const baseUrl = 'http://localhost:3000';

export const createVB = async (formdata, token) => {
    try {
        const { data } = await axios.post(`${baseUrl}/vb/create`, formdata,
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        });
        return data;
    } catch (error) {
        console.error(error);
        throw new Error('Greška prilikom kreiranja vetrogeneratora i baterije.');
    }
};