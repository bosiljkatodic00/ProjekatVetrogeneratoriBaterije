import React from 'react';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/system';

const HeaderButton = styled(Button)({
  backgroundColor: '#003C43', // Željena boja
  color: 'white', // Boja teksta
  '&:hover': {
    backgroundColor: '#135D66', // Boja prilikom hovera
  },
});

const Header = ({ isAuth, userType, handleLogout }) => {
  const nav = useNavigate();

  const goToRegistration = () => {
    nav('register');
  };

  return (
    <div
      style={{
        height: '60px',
        width: '100%',
        textAlign: 'center',
        backgroundColor: '#135D66'
      }}
    >
      <ButtonGroup spacing="0.5rem" aria-label="spacing button group" sx={{ marginTop: 0.3, marginBottom: 1 }}>
        {!isAuth && (
          <HeaderButton
            sx={{ m: 1 }}
            variant="contained"
            onClick={() => nav('login')}
          >
            Log in
          </HeaderButton>
        )}
        {!isAuth && (
          <HeaderButton
            variant="contained"
            sx={{ m: 1 }}
            onClick={goToRegistration}
          >
            Registration
          </HeaderButton>
        )}
        {isAuth && userType === 'user' && (
          <HeaderButton
            variant="contained"
            onClick={() => nav('userDashboard')}
          >
            User Dashboard
          </HeaderButton>
        )}

        {isAuth && userType === 'admin' && (
          <HeaderButton
            variant="contained"
            onClick={() => nav('adminDashboard')}
          >
            Admin Dashboard
          </HeaderButton>
        )}

        {isAuth && (
          <HeaderButton
            variant="contained"
            onClick={handleLogout}
            href="/home"
          >
            Logout
          </HeaderButton>
        )}
      </ButtonGroup>
    </div>
  );
};

export default Header;
