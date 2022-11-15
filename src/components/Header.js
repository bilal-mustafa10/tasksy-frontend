import React from 'react';
import logo from '../assets/logo.png';
import { Button, Heading } from "evergreen-ui";
import { useNavigate, useLocation } from "react-router-dom";
import { isLoggedIn } from "axios-jwt";
import {logout, USERID} from "../utils/auth";


const Header = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const loggedIn = isLoggedIn();
    const user_id = localStorage.getItem("UserId");

    const onLogoutClicked = () => {
        logout();
        navigate('/');
    }

    return (
        <div style={mainHeaderStyle}>
            {!(location.pathname === '/login' || location.pathname === '/signup') &&
                <>
                    <div style={headerStyle}>
                        <img onClick={()=>{navigate('/')}} src={logo} alt="Tasksy Logo" height="30" style={{margin: 10}} />
                        <Heading size={600}
                                 onClick={()=>{navigate('/')}}
                                 style={{fontFamily: 'Cairo',fontWeight:'bold',alignSelf:'center'}}
                        >
                            Tasksy
                        </Heading>
                    </div>

                    {loggedIn && user_id !== undefined ?
                        <>
                            <div style={buttonStyle}>
                                <Button
                                    onClick={()=>{navigate('/dashboard')}}
                                    marginRight={15}
                                    borderRadius={5}
                                    appearance="minimal"
                                    fontFamily={'Cairo'}
                                    fontWeight={'bold'}
                                    fontSize={13}
                                >
                                    Dashboard
                                </Button>
                                <Button
                                    onClick={onLogoutClicked}
                                    marginRight={50}
                                    borderRadius={5}
                                    justifyContent={"flex-end"}
                                    appearance="primary"
                                    fontFamily={'Cairo'}
                                    fontWeight={'bold'}
                                    fontSize={14}
                                >
                                    Log out
                                </Button>
                            </div>
                        </>
                        :
                        <>
                            <div style={buttonStyle}>
                                <Button
                                    onClick={()=>{navigate('/login')}}
                                    marginRight={15}
                                    borderRadius={5}
                                    appearance="minimal"
                                    fontFamily={'Cairo'}
                                    fontWeight={'bold'}
                                    fontSize={15}
                                >
                                    Log in
                                </Button>
                                <Button onClick={()=>{navigate('/signup')}}
                                        marginRight={50}
                                        borderRadius={5}
                                        justifyContent={"flex-end"}
                                        appearance="primary"
                                        fontFamily={'Cairo'}
                                        fontWeight={'bold'}
                                        fontSize={15}
                                >
                                    Sign up
                                </Button>
                            </div>
                        </>
                    }

                </>
            }

        </div>

    );
};

export default Header;

const mainHeaderStyle = {
    width: '100%',
    padding: '0.5em 1em',
    display: 'flex',
    height: '56px',
    position: 'fixed',
    alignItems: 'center',
    zIndex: 1
}
const headerStyle = {
    width: '100%',
    display: 'flex',
}

const buttonStyle = {
    display: 'flex',
    alignItems: 'center'
}
