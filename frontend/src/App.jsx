import React, { useState, useEffect } from 'react'; 
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import Signup from './components/Signup'
import Login from './components/Login'
import Home from './components/Home'
import Header from './components/Header';
import AdminDashboard from './components/AdminDashboard'
import UserDashboard from './components/UserDashboard';

function App() {

  //da li je korisnik autentifikovan, on je autentifikovan i posle registracije i posle logovanje
  const [isAuth, setIsAuth] = useState(false);
  const [userType, setUserType] = useState('');
  const [isKorisnikInfoGot, setIsKorisnikInfoGot] = useState(false);  //da li smo dobili podatke o korisniku


  useEffect(() => {
    const getAuth = () => {
        if(sessionStorage.getItem('korisnik') !== null && sessionStorage.getItem('isAuth') !== null){
            setIsAuth(JSON.parse(sessionStorage.getItem('isAuth')))
            const korisnik = JSON.parse(sessionStorage.getItem('korisnik'))
            setUserType(korisnik.userType);
        }
    }
    getAuth();
  }, [isKorisnikInfoGot]); //kada dobijemo ove podatke, ova funkcija ce se rerenderovati i onda ce se azurirati stanja
                            //na taj nacin izqazvacemo ponovno azuriranje stranice i onda navbara
  
  const handleKorisnikInfo = (gotKorisnikInfo) => {
    setIsKorisnikInfoGot(gotKorisnikInfo);
  }
  

  const handleLogout = () => {
    sessionStorage.removeItem('korisnik');
    sessionStorage.removeItem('isAuth');
    sessionStorage.removeItem('token');
    setIsAuth(false);
    setTipKorisnika('');
    setIsKorisnikInfoGot(false);  
  }

  return (
    <div>
      <BrowserRouter>
      <Header isAuth={isAuth} userType = {userType} handleLogout={handleLogout}/>
        <Routes>
          <Route path='/register' element={<Signup handleKorisnikInfo={handleKorisnikInfo}/>}></Route>
          <Route path='/login' element={<Login handleKorisnikInfo={handleKorisnikInfo}/>}></Route>
          <Route path='/home' element={<Home />}></Route>
          <Route path='/' element={<Home />}></Route>
          <Route path='/adminDashboard' element={<AdminDashboard></AdminDashboard>}/>
          <Route path='/userDashboard' element={<UserDashboard></UserDashboard>}/>

        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
