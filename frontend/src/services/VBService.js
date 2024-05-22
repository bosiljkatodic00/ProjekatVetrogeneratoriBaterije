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


export const getV = async (id, token) => {
    try {
        const { data } = await axios.get(`${baseUrl}/vb/vetrogenerators?id=${id}`,
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        });
        return data;
    } catch (error) {
        console.error(error);
        throw new Error('Greška prilikom dobavljanja vetrogeneratora.');
    }
};

export const getB = async (id, token) => {
    try {
        const { data } = await axios.get(`${baseUrl}/vb/batteries?id=${id}`,
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        });
        return data;
    } catch (error) {
        console.error(error);
        throw new Error('Greška prilikom dobavljanja baterija.');
    }
};