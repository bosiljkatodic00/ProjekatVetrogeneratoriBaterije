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

export const blockUser = async (userId) => {
    const response = await axios.post(`${API_URL}/users/block`, { userId });
    return response.data;
};

export const deleteVB = async (vbId) => {
    const response = await axios.delete(`${API_URL}/vetrogenerators/${vbId}`);
    return response.data;
};

// Implementirajte funkciju updateVB za izmjenu podataka vetrogeneratora i baterija
export const updateVB = async (vbId, data) => {
    const response = await axios.put(`${API_URL}/vetrogenerators/${vbId}`, data);
    return response.data;
};
