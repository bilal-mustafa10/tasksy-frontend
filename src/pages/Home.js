import React from 'react';
import Layout from "../components/Layout";
import {isLoggedIn} from "axios-jwt";
import {getApplications} from "../utils/api";
import {getUserObject, logout, USERID} from "../utils/auth";

function Home(){
    const loggedIn = isLoggedIn();

    React.useEffect(() => {
        const updateUserObject = async () => {await getUserObject();}

        if (loggedIn){
            updateUserObject().then(r => console.log("Logged In"));
            console.log("User Id: ",USERID);
        }else{
            logout();
        }
    }, []);

    return(
        <Layout>
            <h1>Welcome to Tasksy Home Page</h1>
        </Layout>
    )
}

export default Home;
