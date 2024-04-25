import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import backgroundImage from './photo.jpg'; // Putanja do pozadinske slike

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

  const handleSubmit = (e) => {
    e.preventDefault();
    // Ovde implementirati logiku za slanje podataka na server ili lokalno skladište

    if(firstName.length === 0 || lastName.length === 0 || email.length === 0
      || password.length === 0){
          setError(true);
          return;
    }

    const redirectTo = (userType) => {
        if(userType === 'admin'){
            navigate('/adminDashboard');
        }
        else if(userType === 'user'){
            navigate('/userDashboard');
        }
    }

    axios.post('http://localhost:3000/register', formData)
      .then(response => {
        console.log(response.data)
        if(response.data !== null){
          sessionStorage.clear();
          sessionStorage.setItem('isAuth', JSON.stringify(true));
          //sessionStorage.setItem('token', data.token)
          sessionStorage.setItem('korisnik', JSON.stringify(response.data));
          handleKorisnikInfo(true); //prvo se postave podaci pa se re reneruje
          alert("Uspješna registracija.");
          redirectTo(formData.userType);
        } else {
            sessionStorage.setItem('isAuth', JSON.stringify(false));           
            window.alert(response.data);
            handleKorisnikInfo(false);
        }    
      })
      .catch(error => {
        console.error('Error:', error); // Ukoliko dođe do greške pri slanju zahteva, ovde možete obraditi grešku
        window.alert('Došlo je do greške prilikom registracije. Molimo pokušajte ponovo.');
      });
    console.log(formData);
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
