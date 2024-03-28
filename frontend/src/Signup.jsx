import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios'
import { useNavigate } from 'react-router-dom';

const Signup = () => {

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '', 
    userType: 'user'
  });

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
    axios.post('http://localhost:3000/register', formData)
      .then(response => {
        console.log(response.data)
        navigate('/login')
      })
      .catch(error => {
        console.error('Error:', error); // Ukoliko dođe do greške pri slanju zahteva, ovde možete obraditi grešku
      });
    console.log(formData);
  };


  return (
    <div className="container-sm mt-5 bg-secondary text-white p-4" style={{ maxWidth: '600px', backgroundColor: 'grey'}}>
      <h2 className="text-center mb-4">Register</h2>
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
            <button type="submit" className="btn btn-primary">Sign Up</button>
          </form>
          <div className="mt-3 text-center">
            <p>Already have an account? <a href="/login">Login</a></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
