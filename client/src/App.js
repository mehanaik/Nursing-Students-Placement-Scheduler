import "./scss/common.scss";

import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@mui/system";
import React, { useCallback, useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Div100vh from "react-div-100vh";
import axios from "axios";
import Topbar from "./components/topbar";
import LeftMenu from "./components/left-menu";
import AppRoutes from "./App-routes";
import { UserContextProvider } from "./services";
import { Theme } from "./theme";
import { getAuthTokenFromLocalStorage, setAuthTokenToLocalStorage } from "./axios";

export default function App() {
    const [userData, setUserData] = useState({
        token: undefined,
        user: undefined,
        fetched: false
    });

    const fetchCurrentUser = useCallback(async () => {
        const token = getAuthTokenFromLocalStorage();

        if (!token) {
            setAuthTokenToLocalStorage("");
            return null;
        }

        const tokenResponse = await axios.post(
            "/user/isValidToken",
            null,
            { headers: { "x-auth-token": token } }
        );

        if (tokenResponse.data) {
            const userRes = await axios.get("/user", {
                headers: { "x-auth-token": token }
            });

            setAuthTokenToLocalStorage(token);

            return {
                token,
                user: userRes.data
            };
        }

        return null;
    }, []);

    const checkIfUserLoggedIn = useCallback(async () => {
        try {
            const currentUserData = await fetchCurrentUser();
            setUserData({
                ...(currentUserData || userData),
                fetched: true
            });
        } catch {
            setAuthTokenToLocalStorage("");
        }
    }, []);

    useEffect(() => {
        checkIfUserLoggedIn();
    }, []);

    function renderContent() {
        if (userData.fetched) {
            return (
                <Box component="main" sx={{ flexGrow: 1 }}>
                    <Div100vh style={{
                        display: "flex",
                        flexDirection: "column"
                    }}
                    >
                        <Topbar />
                        <AppRoutes />
                    </Div100vh>
                </Box>
            );
        }

        return (
            <Box sx={{
                width: { xs: "95%", lg: "30%" },
                margin: "15% auto",
                textAlign: "center"
            }}
            >
                <CircularProgress />
            </Box>
        );
    }

    return (
        <ThemeProvider theme={Theme}>
            <BrowserRouter>
                <UserContextProvider value={{ userData, setUserData }}>
                    <Box sx={{ display: "flex" }}>
                        <CssBaseline />
                        <LeftMenu />
                        {renderContent()}
                    </Box>
                </UserContextProvider>
            </BrowserRouter>
        </ThemeProvider>
    );
}
