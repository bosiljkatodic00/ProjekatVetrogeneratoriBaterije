import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios'
import { useNavigate } from 'react-router-dom';

const Login = () => {

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

  const handleSubmit = (e) => {
    e.preventDefault();
    // Ovde implementirati logiku za slanje podataka na server ili lokalno skladište
    axios.post('http://localhost:3000/login', formData)
      .then(response => {
        console.log(response.data)
        if(response.data === "Success"){
            navigate('/home')
        }
      })
      .catch(error => {
        console.error('Error:', error); // Ukoliko dođe do greške pri slanju zahteva, ovde možete obraditi grešku
      });
  };


  return (
    <div className="container-sm mt-5 bg-secondary text-white p-4" style={{ maxWidth: '600px', backgroundColor: 'grey'}}>
      <h2 className="text-center mb-4">Login</h2>
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
            
            <button type="submit" className="btn btn-primary">Log In</button>
          </form>
          <div className="mt-3 text-center">
            <p>Don't have an account? <a href="/register">Register</a></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
