import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';


const Header = ({isAuth, userType, handleLogout}) => {

    const nav=useNavigate();

    const goToRegistration=()=>{
        nav('register');
    }

    return (
        <div style={{height:'60px',width:'100%',textAlign: 'center', backgroundColor: '#ededed', borderBottom:'3px solid #7393B3',  borderTop:'3px solid #7393B3'}}>
            <ButtonGroup  
                 spacing="0.5rem" aria-label="spacing button group" sx={{m: 0.5}}>
            {isAuth ? null :
                <Button
                    //className={({isActive}) => active(isActive)}
                    className='headerButton'
                    sx={{m: 1}}
                    variant='contained'
                    onClick={()=>nav('login')}
                >
                    Log in
                </Button>  
            }     
            {isAuth ? null :      
                <Button
                    //className={({isActive}) => active(isActive)}
                    variant='contained'
                    className='headerButton'
                    sx={{m: 1}}
                    onClick={goToRegistration}
                >
                    Registration
                </Button>
            }
            
            {isAuth && userType === "user" && (
                    <Button
                        variant='contained'
                        className='headerButton'
                        onClick={() => nav('userDashboard')}
                    >
                        User Dashboard
                    </Button>
            )}


            {isAuth && userType === 'admin' && (
                    <Button
                        variant='contained'
                        className='headerButton'
                        onClick={() => nav('adminDashboard')}
                    >
                        Admin Dashboard
                    </Button>
            )}

            {isAuth && (
                    <Button
                        variant='contained'
                        className='headerButton'
                        onClick={handleLogout}
                        href="/home"
                    >
                        Logout
                    </Button>
            )}
            </ButtonGroup>
        </div>
    )
}
export default Header;