import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import backgroundImage from '../images/photo.jpg'; // Putanja do pozadinske slike
//import firebase from 'firebase/compat/app';
//import 'firebase/compat/auth';
// Importujte inicijalizaciju Firebase iz vašeg fajla
import  auth  from '../config/firebase-config';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { login } from '../services/UserService'; // Importujemo authService

const Login = ({handleKorisnikInfo}) => {

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

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

  
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;
      const token = await user.getIdToken();
  /*
      const payloadHeader = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
  */
      const data = await login(formData.email, formData.password, token);
      if(data !== null){
        console.log(data);
  
      sessionStorage.setItem('isAuth', JSON.stringify(true));
      sessionStorage.setItem('korisnik', JSON.stringify(user));
      handleKorisnikInfo(true);
      alert("Uspješna prijava.");
      redirectTo(data.type);
      } else
      {
      sessionStorage.setItem("isAuth", false);
      handleKorisnikInfo(false); 
      }
      
    } catch (error) {
      console.error('Error:', error);
      window.alert('Došlo je do greške prilikom prijave. Molimo pokušajte ponovo.');
    }
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
