import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getV } from '../services/VBService';
import { getB } from '../services/VBService';

const UserOverview = () => {
  const [vetrogenerators, setVetrogenerators] = useState([]);
  const [batteries, setBatteries] = useState([]);
  const [korisnik, setKorisnik] = useState(null);
  const [token, setToken] = useState(null);


  useEffect(() => {
    const userFromStorage = JSON.parse(sessionStorage.getItem('korisnik'));
    const tokenFromStorage = sessionStorage.getItem('token');

    if (userFromStorage) {
      setKorisnik(userFromStorage);
    }
    if (tokenFromStorage) {
      setToken(tokenFromStorage);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (korisnik && token) {
        try {
          // Preuzimanje vetrogeneratora i baterija paralelno
          const [responseV, responseB] = await Promise.all([
            getV(korisnik._id, token),
            getB(korisnik._id, token)
          ]);
          
          // Postavljanje stanja za vetrogeneratore i baterije
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
  }, [korisnik, token]);

  return (
    <div>
      <h2>Vaši vetrogeneratori:</h2>
      <ul>
        {vetrogenerators.map((vetrogenerator, index) => (
          <li key={index}>
            <strong>Snaga:</strong> {vetrogenerator.trenutnaSnagaV}
          </li>
        ))}
      </ul>
      <h2>Vaše baterije:</h2>
      <ul>
        {batteries.map((battery, index) => (
          <li key={index}>
            <strong>Napunjenost:</strong> {battery.napunjenostB}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserOverview;
