import {applyAuthTokenInterceptor, clearAuthTokens, getAccessToken, setAuthTokens} from 'axios-jwt';
import axios from 'axios';
import jwtDecode from "jwt-decode";


const BASE_URL = "http://127.0.0.1:8000/api";

export const axiosInstance = axios.create({baseURL: BASE_URL});

const requestRefresh = async (refreshToken) => {
    // Important! Do NOT use the axios instance that you supplied to applyAuthTokenInterceptor
    // because this will result in an infinite loop when trying to refresh the token.
    // Use the global axios client or a different instance
    try {
        const response = await axios.post(`${BASE_URL}/token/refresh/`, {
            refresh: refreshToken,
        });
        // If your backend supports rotating refresh tokens, you may also choose to return an object containing both tokens:
        if (response.data.refresh) {
            return {
                accessToken: response.data.access,
                refreshToken: response.data.refresh
            }
        } else {
            return {
                accessToken: response.data.access,
                refreshToken: refreshToken
            }
        }
    } catch (e) {
        console.log("Error getting a new token.");
    }

};
// 3. Add interceptor to your axios instance
applyAuthTokenInterceptor(axiosInstance, {requestRefresh});

export let USERID;

export const login = async (username, password) => {

    try {
        const params ={username: username, password: password};
        const response = await axiosInstance.post('/auth/login/', params);
        const decoded = jwtDecode(response.data.access);
        localStorage.setItem("UserId", decoded['user_id']);
        USERID = decoded['user_id']
        console.log(USERID);
        // save tokens to storage
        await setAuthTokens({
            accessToken: response.data.access,
            refreshToken: response.data.refresh,
        });
        return response.status;
    } catch (e) {
        return e.response.status;
    }

};

export const getUserObject = async () => {
    const userObject = await getAccessToken();
    console.log("User Object: ", userObject);
    if (userObject !== undefined) {
        const decoded = jwtDecode(userObject);
        console.log("User Object Decoded: ",decoded);
        USERID = decoded['user_id']
        localStorage.setItem("UserId", decoded['user_id']);
    }
}

export const logout = () => {
    clearAuthTokens();
};

export const signup = async (firstname, lastname, email, username, password ) => {
    const params = {
        first_name: firstname,
        last_name: lastname,
        username: username,
        email: email,
        password: password
    }
    console.log(params);
    return await axiosInstance.post('/register/', params);
};

