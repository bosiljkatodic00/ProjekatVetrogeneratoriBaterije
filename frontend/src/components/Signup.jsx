import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import backgroundImage from '../images/photo.jpg'; // Putanja do pozadinske slike
import  auth  from '../config/firebase-config';
import {
  createUserWithEmailAndPassword
} from "firebase/auth";

const Signup = ({handleKorisnikInfo}) => {

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '', 
    userType: 'user'
  });

  const[error, setError] = useState(false);

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
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if(formData.firstName.length === 0 || formData.lastName.length === 0 || formData.email.length === 0 || formData.password.length === 0){
      setError(true);
      return;
    }
  
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;
      const token = await user.getIdToken();
  
      const payloadHeader = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
  
      const res = await axios.post("http://localhost:3000/auth/register", formData, payloadHeader);
      console.log(res.data);
  
      sessionStorage.setItem('isAuth', JSON.stringify(true));
      sessionStorage.setItem('korisnik', JSON.stringify(user));
      handleKorisnikInfo(true);
      alert("Uspješna registracija.");
      redirectTo(formData.userType);
    } catch (error) {
      console.error('Error:', error);
      window.alert('Došlo je do greške prilikom registracije. Molimo pokušajte ponovo.');
    }
  };
  

  return (
    <div style={{ textAlign: 'center', backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center', minHeight: '95vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
    <div style={{ position: 'relative', width: '450px', zIndex: 1, padding: '20px', backgroundColor: 'rgba(255, 255, 255, 0.5)', border: '2px solid white', borderRadius: '10px' }}>
    <h2 className="text-center mb-4" style={{ color: '#003C43' }}>Register</h2>
      <div className="row justify-content-center">
        <div className="col-md-6">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="firstName" className="form-label">Name:</label>
              <input 
                type="text" 
                className="form-control" 
                id="firstName" 
                name="firstName" 
                value={formData.firstName} 
                onChange={handleChange} 
                required 
              />
            </div>
            <div className="mb-3">
              <label htmlFor="lastName" className="form-label">Last Name:</label>
              <input 
                type="text" 
                className="form-control" 
                id="lastName" 
                name="lastName" 
                value={formData.lastName} 
                onChange={handleChange} 
                required 
              />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email:</label>
              <input 
                type="email" 
                className="form-control" 
                id="email" 
                name="email" 
                value={formData.email} 
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
                value={formData.password} 
                onChange={handleChange} 
                required 
              />
            </div>
            <div className="mb-3">
              <label htmlFor="userType" className="form-label">User Type:</label>
              <select 
                className="form-control" 
                id="userType" 
                name="userType" 
                value={formData.userType} 
                onChange={handleChange} 
                required 
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <button type="submit" className="btn btn-primary" style={{ backgroundColor: '#003C43' }}>Register</button>
          </form>
          <div className="mt-3 text-center">
            <p>Already have an account? <a href="/login" style={{ color: '#135D66' }}>Login</a></p>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Signup;
