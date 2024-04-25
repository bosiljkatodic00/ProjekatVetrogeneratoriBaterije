import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import backgroundImage from './photo.jpg'; // Putanja do pozadinske slike

const Login = ({handleKorisnikInfo}) => {

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

    //const [email, setEmail] = useState()
    //const [password, setPassword] = useState()
    const navigate = useNavigate()

    const handleChange = (e) => {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value
      });
    };

    const redirectTo = (userType) => {
      if(userType === 'admin'){
          navigate('/adminDashboard');
      }
      else if(userType === 'user'){
          navigate('/userDashboard');
      }
    }

  const handleSubmit = (e) => {
    e.preventDefault();
    // Ovde implementirati logiku za slanje podataka na server ili lokalno skladište
    axios.post('http://localhost:3000/login', formData)
      .then(response => {
        console.log(response.data)
        if(response.data.message === "Success"){
          sessionStorage.setItem('isAuth', JSON.stringify(true));
          //sessionStorage.setItem('token', data.token)
          sessionStorage.setItem('korisnik', JSON.stringify(response.data.user));
          handleKorisnikInfo(true); //prvo se postave podaci pa se renderuje
          window.alert("Uspješno prijavljivanje.");
          redirectTo(response.data.type)
        } else {
          window.alert(response.data);
          handleKorisnikInfo(false);
      }
      })
      .catch(error => {
        console.error('Error:', error); // Ukoliko dođe do greške pri slanju zahteva, ovde možete obraditi grešku
        window.alert('Došlo je do greške prilikom prijave. Molimo pokušajte ponovo.');
      });
  };


  return (
    <div style={{ textAlign: 'center', backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center', minHeight: '95vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
    <div style={{ position: 'relative', width: '400px', zIndex: 1, padding: '20px', backgroundColor: 'rgba(255, 255, 255, 0.5)', border: '2px solid white', borderRadius: '10px' }}>

    <h2 className="text-center mb-4" style={{ color: '#003C43' }}>Login</h2>
      <div className="row justify-content-center">
        <div className="col-md-6">
          <form onSubmit={handleSubmit}>

            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email:</label>
              <input 
                type="email" 
                className="form-control" 
                id="email" 
                name="email" 
                onChange={handleChange} 
                required 
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Password:</label>
              <input 
                type="password" 
                className="form-control" 
                id="password" 
                name="password" 
                onChange={handleChange} 
                required 
              />
            </div>
            
            <button type="submit" className="btn btn-primary" style={{ backgroundColor: '#003C43' }}>Log In</button>
          </form>
          <div className="mt-3 text-center">
            <p>Don't have an account? <a href="/register" style={{ color: '#135D66' }}>Register</a></p>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Login;
