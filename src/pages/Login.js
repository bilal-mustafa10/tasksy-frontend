import React from 'react';
import Layout from "../components/Layout";
import {Pane, Button, Heading, TextInputField, InlineAlert} from "evergreen-ui";
import {Link, useNavigate} from "react-router-dom";
import logo from "../assets/logo.png";
import {login} from "../utils/auth";
import {passwordValidator, usernameValidator} from "../utils/validator";

function Login(){
    const navigate = useNavigate();
    const [username, setUsername] = React.useState({value: '', error: ''});
    const [password, setPassword] = React.useState({value: '', error: ''});
    const [showError, setShowError] = React.useState({value: false, error: ''});


    function checkLogin(){
        setShowError(false);
        const usernameError = usernameValidator(username.value);
        const passwordError = passwordValidator(password.value);

        if (usernameError || passwordError) {
            setShowError({value:true,error: "Invalid Input"});
            setUsername({...username, error: usernameError});
            setPassword({...password, error: passwordError});
            return;
        }

        login(username.value, password.value).then(r => {
            if (r === 200){
                navigate('/dashboard');
            }else{
                setShowError({value:true,error: "Incorrect Username or Password"})
            }
        })
    }
    return(
        <Layout>
            <div style={{width:'100%', height:'100vh',display:'flex', justifyContent:'center'}}>
                <Pane
                    height={420}
                    width={350}
                    display="flex"
                    alignItems="flex-start"
                    justifyContent="center"
                    border="default"
                    borderRadius={10}
                    backgroundColor={"white"}
                    elevation={2}
                    padding={30}
                >
                    <div>
                        <img onClick={()=>{navigate('/')}} src={logo} alt="Tasksy Logo" height="60"  style={{margin: 10}} />
                        <Heading
                            textAlign={"center"}
                            padding={10}
                            fontSize={24}
                            size={500}
                            fontFamily={'Cairo'}
                            fontWeight={'bold'}
                        >Log in - Tasksy </Heading>
                        <div style={{marginTop:15}}>
                            <TextInputField
                                onChange={e => setUsername({value: e.target.value, error:''})}
                                label={"Username"}
                                value={username.value}
                                placeholder={"Username"}
                                type={"username"}
                                inputWidth={300}
                                inputHeight={35}
                                margin={15}
                                textAlign={"left"}
                                fontFamily={'Cairo'}
                                fontWeight={'bolder'}
                            />
                            <TextInputField
                                onChange={e => setPassword({value: e.target.value, error: ''})}
                                label={"Password"}
                                value={password.value}
                                placeholder={"Password"}
                                type={"password"}
                                inputWidth={300}
                                inputHeight={35}
                                margin={15}
                                textAlign={"left"}
                                fontFamily={'Cairo'}
                                fontWeight={'bolder'}
                            />
                            {showError.value &&
                                <InlineAlert margin={15} intent="danger">
                                    {showError.error}
                                </InlineAlert>
                            }
                            <Pane display="flex" margin={15} marginBottom={0} borderRadius={3}>
                                <Pane flex={1} alignItems="center" display="flex">
                                    <Link to={"/signup"} style={{textDecoration: 'none',color:'#808080', fontSize:12, alignSelf:'center',fontFamily:'Cairo',fontWeight:"bolder" }}>Don't have an account?</Link>
                                </Pane>
                                <Pane>
                                    <Button
                                        appearance="primary"
                                        intent="none"
                                        width={100}
                                        height={35}
                                        borderRadius={5}
                                        onClick={checkLogin}
                                        fontFamily={'Cairo'}
                                        fontWeight={'bold'}
                                    >
                                        Login
                                    </Button>
                                </Pane>
                            </Pane>
                        </div>
                    </div>
                </Pane>
            </div>

        </Layout>
    )
}
export default Login;
