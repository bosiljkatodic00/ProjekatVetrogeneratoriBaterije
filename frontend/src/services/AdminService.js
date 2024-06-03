import axios from 'axios';

const baseUrl = 'http://localhost:3000';

export const getUsers = async (token) => {
    try {
        const { data } = await axios.get(`${baseUrl}/user/allUsers`,
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        });
        return data;
    } catch (error) {
        console.error(error);
        throw new Error('Greška prilikom dobavljanja svih korisnika tipa User.');
    }
};

export const getV = async (token) => {
    try {
        const { data } = await axios.get(`${baseUrl}/vb/allVetrogenerators`,
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

export const getB = async (token) => {
    try {
        const { data } = await axios.get(`${baseUrl}/vb/allBatteries`,
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

export const blockUser = async (userId, token) => {
    try {
        const response = await axios.post(`${baseUrl}/user/block`, { userId }, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error(error);
        throw new Error('Greška prilikom blokiranja korisnika.');
    }
};

export const deleteV = async (vId, token) => {
    try {
        const response = await axios.delete(`${baseUrl}/vb/deleteV/${vId}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error(error);
        throw new Error('Greška prilikom brisanja vetrogeneratora.');
    }
};

export const deleteB = async (bId, token) => {
    try {
        const response = await axios.delete(`${baseUrl}/vb/deleteB/${bId}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error(error);
        throw new Error('Greška prilikom brisanja baterije.');
    }
};

export const updateV = async (vId, data, token) => {
    try {
        const response = await axios.put(`${baseUrl}/vb/updateV/${vId}`, data, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error(error);
        throw new Error('Greška prilikom izmjene vetrogeneratora.');
    }
};

export const updateB = async (bId, data, token) => {
    try {
        const response = await axios.put(`${baseUrl}/vb/updateB/${bId}`, data, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error(error);
        throw new Error('Greška prilikom izmjene baterije.');
    }
};

