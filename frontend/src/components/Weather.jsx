import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { TextField, Button, Typography, Grid } from '@mui/material';
import { WiThermometer, WiStrongWind, WiHumidity, WiBarometer } from 'react-icons/wi';

const Weather = () => {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);

  const fetchData = async (cityName) => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=555759959b78b35d289a0baaf5ca0782`
      );
      setWeatherData(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData('Belgrade');
  }, []);

  const handleInputChange = (e) => {
    setCity(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchData(city);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <TextField
          type="text"
          label="Unesite ime grada"
          value={city}
          onChange={handleInputChange}
          variant="outlined"
          size="small"
        />
        <Button type="submit" variant="contained" color="primary" sx={{marginLeft: 1, marginBottom: 1}}>Pretraži</Button>
      </form>
      {weatherData && (
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12}>
            <Typography variant="h5">{weatherData.name}</Typography>
          </Grid>
          <Grid item xs={6}>
            <WiThermometer size={32} color="#1976d2" />
            <Typography variant="body1">
              Temperatura: {weatherData.main.temp}°C
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <WiStrongWind size={32} color="#1976d2" />
            <Typography variant="body1">
              Brzina vjetra: {weatherData.wind.speed}m/s
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <WiHumidity size={32} color="#1976d2" />
            <Typography variant="body1">
              Vlažnost vazduha: {weatherData.main.humidity}%
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <WiBarometer size={32} color="#1976d2" />
            <Typography variant="body1">
              Vazdušni pritisak: {weatherData.main.pressure}
            </Typography>
          </Grid>
        </Grid>

      )}
    </div>
  );
};

export default Weather;
