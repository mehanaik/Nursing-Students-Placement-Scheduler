import React, {
    useContext, useRef, useCallback, useEffect
} from "react";
import { useNavigate } from "react-router-dom";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import InputAdornment from "@mui/material/InputAdornment";
import AccountCircle from "@mui/icons-material/AccountCircle";
import LockIcon from "@mui/icons-material/Lock";
import { Box } from "@mui/system";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import axios from "axios";
import TextField from "../common/TextField";
import LoadingButton from "../common/LoadingButton";
import ShowSnackbarAlert from "../common/SnackBarAlert";
import * as ValidateUtils from "./utils";
import { UserContext } from "../../services";
import Logo from "../../images/logo.png";
import { setAuthTokenToLocalStorage } from "../../axios";

export default function Login() {
    const { userData, setUserData } = useContext(UserContext);
    const navigate = useNavigate();

    const usernameRef = useRef(null);
    const passwordRef = useRef(null);
    const btnRef = useRef(null);

    const validate = useCallback((email, password) => {
        usernameRef.current.setError(email ? null : "Please enter the username");
        passwordRef.current.setError(password ? null : "Please enter the password");
        return email && password;
    }, []);

    const handleSubmit = async () => {
        try {
            const username = usernameRef.current.value();
            const password = passwordRef.current.value();

            const isUsernameValid = ValidateUtils.validateUsername(username, usernameRef.current);
            const isPasswordValid = ValidateUtils.validatePassword(password, passwordRef.current);

            if (!isUsernameValid || !isPasswordValid) {
                throw new Error();
            }

            const res = await axios.post("/user/login", { username, password });
            const { token, user } = res.data;
            setUserData({ token, user, fetched: true });
            setAuthTokenToLocalStorage(token);
            ShowSnackbarAlert({ message: "Logged in successfully" });
        } catch (err) {
            ShowSnackbarAlert({ message: err.response.data.message, severity: "error" });
        }
    };

    const handleKeyDown = useCallback((event) => {
        if (event.key === "Enter") {
            btnRef.current.click();
        }
    });

    function renderRegisterOption() {
        // return (
        //     <Typography
        //             color="primary"
        //             align="right"
        //             sx={{
        //                 textDecoration: "underline",
        //                 mt: 3,
        //                 cursor: "pointer",
        //                 display: "inline-block",
        //                 float: "right"
        //             }}
        //             onClick={() => { navigate("/register"); }}
        //         >
        //             Register
        //         </Typography>
        // )

        return "";
    }

    function renderUsername() {
        return (
            <TextField
                label="Username"
                ref={usernameRef}
                autoFocus
                required
                onKeyDown={handleKeyDown}
                autoComplete="off"
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <AccountCircle />
                        </InputAdornment>
                    )
                }}
            />
        );
    }

    function renderPassword() {
        return (
            <TextField
                label="Password"
                ref={passwordRef}
                type="password"
                autoComplete="off"
                required
                onKeyDown={handleKeyDown}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <LockIcon />
                        </InputAdornment>
                    )
                }}
            />
        );
    }

    function renderSubmitBtn() {
        return (
            <LoadingButton
                ref={btnRef}
                label="Login"
                onClick={handleSubmit}
                sx={{ mt: 3, width: 120 }}
            />
        );
    }

    function renderTopBar() {
        return (
            <AppBar position="static" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <Toolbar>
                    <Link href="/">
                        <img src={Logo} style={{ width: "40px", height: "40px" }} />
                    </Link>
                    <Typography
                        variant="h6"
                        component="div"
                        sx={{ flexGrow: 1, ml: 1, mt: -1 }}
                    >
                        Nursing Placement Schedular
                    </Typography>
                </Toolbar>
            </AppBar>
        );
    }

    return (
        <Box sx={{ overflow: "auto" }}>
            {renderTopBar()}
            <Paper
                elevation={4}
                square={false}
                sx={{
                    width: { xs: "95%", lg: "30%" },
                    margin: "5% auto",
                    textAlign: "center",
                    borderRadius: 5,
                    p: 3
                }}
            >

                <Typography
                    color="primary"
                    variant="h5"
                    noWrap
                    component="div"
                    p={1}
                >
                    Login
                </Typography>

                {renderUsername()}
                {renderPassword()}
                {renderRegisterOption()}
                {renderSubmitBtn()}
            </Paper>
        </Box>
    );
}
