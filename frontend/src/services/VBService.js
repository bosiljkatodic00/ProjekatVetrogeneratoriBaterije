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

export const start = async (id, token) => {
    try {
        const { data } = await axios.post(`${baseUrl}/vb/startSystem?id=${id}`,
        {}, // Prazno telo zahteva
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        });
        return data;
    } catch (error) {
        console.error(error);
        throw new Error('Greška prilikom pokretanja sistema.');
    }
}

export const stop = async (id, token) => {
    try {
        const { data } = await axios.post(`${baseUrl}/vb/stopSystem?id=${id}`,
        {}, // Prazno telo zahteva
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        });
        return data;
    } catch (error) {
        console.error(error);
        throw new Error('Greška prilikom zaustavljanja sistema.');
    }
}

export const getVHistory = async (id, token) => {
    try {
        const { data } = await axios.get(`${baseUrl}/vb/historyV?id=${id}`,
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        });
        return data;
    } catch (error) {
        console.error(error);
        throw new Error('Greška prilikom dobavljanja istorije vetrogeneratora.');
    }
};

export const getBHistory = async (id, token) => {
    try {
        const { data } = await axios.get(`${baseUrl}/vb/historyB?id=${id}`,
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        });
        return data;
    } catch (error) {
        console.error(error);
        throw new Error('Greška prilikom dobavljanja istorije baterije.');
    }
};