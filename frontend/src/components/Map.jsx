import React, { useState, useEffect } from 'react';
import { GoogleMap, useLoadScript, MarkerF, InfoWindowF  } from '@react-google-maps/api';

const libraries = ['places'];

const mapContainerStyle = {
  width: '60vw',
  height: '50vh',
};

const center = {
  lat: 44.787197, // default latitude
  lng: 20.457273, // default longitude
};

const Map = ({ vetrogenerators, batteries, onMapClick, isClickable }) => {

  const [markerPosition, setMarkerPosition] = useState({ lat: 44.787197, lng: 20.457273});
  const [activeMarker, setActiveMarker] = useState(null); // aktivni marker
 // const [infoWindowPosition, setInfoWindowPosition] = useState(null); // pozicija InfoWindow

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

  const handleMarkerClick = (vetrogenerator) => {
    setActiveMarker(vetrogenerator);
  };

  const handleInfoWindowClose = () => {
    setActiveMarker(null);
  };

  return (
    <div>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={10}
        center={center}
        onClick={isClickable ? handleMapClick : null} // Samo reaguje na klik ako je isClickable true
      >
        {/* Prikaz markera za vetrogeneratore */}
        {vetrogenerators && vetrogenerators.map((vetrogenerator, index) => (
          <MarkerF
            key={index}
            position={{ lat: vetrogenerator.lokacija.coordinates[1], lng: vetrogenerator.lokacija.coordinates[0] }}
            onClick={() => handleMarkerClick(vetrogenerator)}
          />
        ))}

        {activeMarker && (
          <InfoWindowF 
            position={{ 
              lat: activeMarker.lokacija.coordinates[1], 
              lng: activeMarker.lokacija.coordinates[0] 
            }} 
            onCloseClick={handleInfoWindowClose}
          >
            <div style={{ maxWidth: '200px' }}>
              <p>VETROGENERATOR INFO:</p>
              <p>ID: {activeMarker._id}</p>
              <p>Nominalna Snaga: {activeMarker.nominalnaSnagaV}</p>
              <p>Trenutna Snaga: {activeMarker.trenutnaSnagaV}</p>
              <p>ID vlasnika: {activeMarker.vlasnik}</p>

            </div>
          </InfoWindowF>
        )}

        {isClickable && <MarkerF position={{ lat: markerPosition.lat, lng: markerPosition.lng }} />}
      </GoogleMap>
    </div>
  );
};

export default Map;