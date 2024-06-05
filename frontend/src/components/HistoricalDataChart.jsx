import React, { useState, useEffect } from 'react';
import { getVHistory } from '../services/VBService';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const HistoricalDataChart = () => {
  const [historicalData, setHistoricalData] = useState([]);
  const token = sessionStorage.getItem('token');
  const userId = JSON.parse(sessionStorage.getItem('korisnik'))._id;

  useEffect(() => {
    const fetchData = async () => {
      try {
        let response = await getVHistory(userId, token);
        setHistoricalData(response);
      } catch (error) {
        console.error('Error fetching historical data:', error);
      }
    };

    fetchData();
  }, [userId, token]);

  // Grupisanje podataka po vetrogeneratorId
  const groupedData = historicalData.reduce((acc, curr) => {
    const { vetrogeneratorId, ...rest } = curr;
    if (!acc[vetrogeneratorId]) {
      acc[vetrogeneratorId] = [];
    }
    acc[vetrogeneratorId].push(rest);
    return acc;
  }, {});

  return (
    <div>
      {Object.keys(groupedData).map((vetrogeneratorId, index) => (
        <div key={index}>
          <h2>Vetrogenerator {vetrogeneratorId}</h2>
          <ResponsiveContainer width="90%" height={400}>
            <LineChart data={groupedData[vetrogeneratorId]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="timestamp" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="trenutnaSnagaV" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ))}
    </div>
  );
};

export default HistoricalDataChart;
