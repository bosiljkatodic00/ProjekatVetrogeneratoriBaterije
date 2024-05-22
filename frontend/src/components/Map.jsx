import React, { useState, useEffect } from 'react';
import { GoogleMap, useLoadScript, MarkerF } from '@react-google-maps/api';

const libraries = ['places'];
const mapContainerStyle = {
  width: '50vw',
  height: '30vh',
};
const center = {
  lat: 44.787197, // default latitude
  lng: 20.457273, // default longitude
};

const Map = ({ vetrogenerators, batteries, onMapClick, isClickable }) => {

    const [markerPosition, setMarkerPosition] = useState({ lat: 44.787197, lng: 20.457273});

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: 'AIzaSyA55oNiR5BlhgjBlo9SAjxudjJ0ECnXp0o',
    libraries,
  });

  if (loadError) {
    return <div>Error loading maps</div>;
  }

  if (!isLoaded) {
    return <div>Loading maps</div>;
  }
  const handleMapClick = (e) => {
    if (isClickable) {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      setMarkerPosition({ lat, lng });
      onMapClick(lat, lng); // Pozivamo funkciju koju smo dobili kao prop
    }
};

  return (
    <div>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={10}
        center={center}
        onClick={isClickable ? handleMapClick : null} // Samo reaguje na klik ako je isClickable true
      >
        {/* Prikaz markera za vjetrogeneratore */}
        {vetrogenerators && vetrogenerators.map((vetrogenerator, index) => (
          <MarkerF
            key={index}
            position={{ lat: vetrogenerator.lokacija.coordinates[1], lng: vetrogenerator.lokacija.coordinates[0] }}
          />
        ))}

      {isClickable && <MarkerF position={{ lat: markerPosition.lat, lng: markerPosition.lng }} />}
      </GoogleMap>
    </div>
  );
};

export default Map;