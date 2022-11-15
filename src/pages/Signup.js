import React from 'react';
import Layout from "../components/Layout";
import {Pane, Button, Heading, InlineAlert, TextInputField} from "evergreen-ui";
import {Link, useNavigate} from "react-router-dom";
import logo from "../assets/logo.png";
import {emailValidator, nameValidator, passwordValidator, usernameValidator} from "../utils/validator";
import {signup} from "../utils/auth";

function Signup(){
    const navigate = useNavigate();
    const [firstName, setFirstName] = React.useState({value: '', error: ''});
    const [lastName, setLastName] = React.useState({value: '', error: ''});
    const [email, setEmail] = React.useState({value: '', error: ''});
    const [username, setUsername] = React.useState({value: '', error: ''});
    const [password, setPassword] = React.useState({value: '', error: ''});
    const [showError, setShowError] = React.useState({value: false, error: ''});


    function checkLogin(){
        const usernameError = usernameValidator(username.value);
        const passwordError = passwordValidator(password.value);
        const firstNameError = nameValidator(firstName.value);
        const lastNameError = nameValidator(lastName.value);
        const emailError = emailValidator(email.value);

        if (usernameError || passwordError || firstNameError || lastNameError || emailError) {
            setShowError({value:true,error: "Incorrect Details"});
            setUsername({...username, error: usernameError});
            setPassword({...password, error: passwordError});
            setFirstName({...firstName, error: firstNameError});
            setLastName({...lastName, error: lastNameError});
            setEmail({...email, error: emailError});


            return;
        }
        signup(firstName.value, lastName.value, email.value, username.value, password.value).then(r => {
            if (r.status === 201){
                console.log(r);
                navigate('/login');
            }
        });

    }

    return(
        <Layout>
            <div style={{width:'100%', height:'100vh',display:'flex', justifyContent:'center'}}>
                <Pane
                    height={630}
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
                        >Sign up - Tasksy </Heading>
                        <div style={{marginTop:15}}>
                            <TextInputField
                                onChange={e => setFirstName({value: e.target.value, error: ''})}
                                label={"First Name"}
                                value={firstName.value}
                                placeholder={"Jane"}
                                type={"name"}
                                inputWidth={300}
                                inputHeight={35}
                                margin={15}
                                textAlign={"left"}
                                fontFamily={'Cairo'}
                                fontWeight={'bolder'}
                            />
                            <TextInputField
                                onChange={e => setLastName({value: e.target.value, error: ''})}
                                label={"Last Name"}
                                value={lastName.value}
                                placeholder={"Doe"}
                                type={"name"}
                                inputWidth={300}
                                inputHeight={35}
                                margin={15}
                                textAlign={"left"}
                                fontFamily={'Cairo'}
                                fontWeight={'bolder'}
                            />
                            <TextInputField
                                onChange={e => setUsername({value: e.target.value, error: ''})}
                                label={"Username"}
                                value={username.value}
                                placeholder={"jannadoe21"}
                                type={"username"}
                                inputWidth={300}
                                inputHeight={35}
                                margin={15}
                                textAlign={"left"}
                                fontFamily={'Cairo'}
                                fontWeight={'bolder'}
                            />
                            <TextInputField
                                onChange={e => setEmail({value: e.target.value, error: ''})}
                                label={"Email"}
                                value={email.value}
                                placeholder={"janedoe@gmail.com"}
                                type={"email"}
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
                                fontFamily={"Cairo"}
                                fontWeight={"bolder"}
                            />
                            {showError.value &&
                                <InlineAlert margin={15} intent="danger">
                                    {showError.error}
                                </InlineAlert>
                            }
                            <Pane display="flex" margin={15} marginBottom={0} borderRadius={3}>
                                <Pane flex={1} alignItems="center" display="flex">
                                    <Link to={"/login"} style={{textDecoration: 'none',color:'#808080', fontSize:12, alignSelf:'center',fontFamily:'Cairo',fontWeight:"bolder"}}>Already have an account?</Link>
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
                                        Sign up
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
export default Signup;
