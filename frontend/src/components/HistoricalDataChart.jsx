import React, { useState, useEffect } from 'react';
import { getVHistory } from '../services/VBService';
import { getBHistory } from '../services/VBService';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Box from '@mui/material/Box';

const HistoricalDataChart = () => {
  const [historicalData, setHistoricalData] = useState([]);
  const token = sessionStorage.getItem('token');
  const userId = JSON.parse(sessionStorage.getItem('korisnik'))._id;

  useEffect(() => {
    const fetchData = async () => {
      try {
        let vData = await getVHistory(userId, token);
        let bData = await getBHistory(userId, token);

        // Spajanje podataka o vetrogeneratorima i baterijama u jedan niz
        let combinedData = [...vData, ...bData];
        setHistoricalData(combinedData);
      } catch (error) {
        console.error('Error fetching historical data:', error);
      }
    };

    fetchData();
  }, [userId, token]);

  // Mapiranje stanja na numeričke vrednosti
  const mapStateToNumeric = (state) => {
    switch (state) {
      case 'punjenje':
        return 1;
      case 'praznjenje':
        return -1;
      case 'mirovanje':
        return 0;
      default:
        return 0;
    }
  };

  const mapStateToString = (value) => {
    switch (value) {
      case 1:
        return 'punjenje';
      case -1:
        return 'praznjenje';
      case 0:
        return 'mirovanje';
      default:
        return '';
    }
  };

  // Grupisanje podataka po systemId, vetrogeneratorId i batteryId
  const groupedData = historicalData.reduce((acc, curr) => {
    const { systemId, vetrogeneratorId, batteryId, stanje, ...rest } = curr;
    if (!acc[systemId]) {
      acc[systemId] = {
        vetrogeneratorData: [],
        baterijaData: [],
      };
    }
    if (batteryId) {
      acc[systemId].baterijaData.push({ ...rest, stanje: mapStateToNumeric(stanje), type: 'baterija' });
    } else {
      acc[systemId].vetrogeneratorData.push({ ...rest, type: 'vetrogenerator' });
    }
    return acc;
  }, {});


 return (
  <Box sx={{ alignItems: 'center', justifyContent: 'center', backgroundColor: 'white', padding: 3, marginLeft: 5 }}>

    <div>

      {Object.keys(groupedData).map((systemId, index) => (
        
        <div key={index}>

          <h2>System ID: {systemId}</h2>

          <div>
            <h3>Vetrogenerator</h3>

            <ResponsiveContainer width="90%" height={400}>
              <LineChart data={groupedData[systemId].vetrogeneratorData} margin={{ top: 20, right: 30, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" label={{ value: 'Vreme', position: 'insideBottomRight', offset: -10 }}/>
                <YAxis label={{ value: 'Snaga (MW)', angle: -90, position: 'insideLeft', dx: -1, dy: -80 }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="trenutnaSnagaV" stroke="#269937" />
              </LineChart>
            </ResponsiveContainer>

          </div>
          
          <div>
            <h3>Baterija</h3>
            <ResponsiveContainer width="90%" height={400} marginLeft="10">
              <LineChart data={groupedData[systemId].baterijaData} margin={{ top: 20, right: 30, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" label={{ value: 'Vreme', position: 'insideBottomRight', offset: -10 }}/>
                <YAxis
                  tickFormatter={mapStateToString}
                  label={{ value: 'Stanje', angle: -90, position: 'insideLeft', dx: -40, dy: -120 }}
                  domain={[-1, 1]}
                  ticks={[-1, 0, 1]}
                />                
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="napunjenostB" stroke="#2403fc" />
                <Line type="step" dataKey="stanje" stroke="#fc0339" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      ))}

    </div>
    </Box>

  );
};

export default HistoricalDataChart;