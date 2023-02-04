import axios from "axios";

axios.defaults.baseURL = `${process.env.REACT_APP_API_URL}/api`;

export const getAuthTokenFromLocalStorage = () => localStorage.getItem("auth-token");

export const setTokenInHeader = () => {
    axios.defaults.headers.common["x-auth-token"] = getAuthTokenFromLocalStorage();
};

export const setAuthTokenToLocalStorage = (authToken) => {
    localStorage.setItem("auth-token", authToken);
    setTokenInHeader();
};
