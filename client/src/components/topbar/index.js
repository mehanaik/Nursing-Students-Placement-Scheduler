import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import React, {
    useCallback, useContext, useEffect, useMemo, useState
} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";
import { AppBar, Tooltip } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";
import LoadingButton from "../common/LoadingButton";
import { Menus } from "../left-menu/utils";
import ShowSnackbarAlert from "../common/SnackBarAlert";
import { setAuthTokenToLocalStorage } from "../../axios";
import { EVENTS, GlobalEventEmitter, UserContext } from "../../services";

export default function Topbar() {
    const { userData, setUserData } = useContext(UserContext);
    const location = useLocation();
    const navigate = useNavigate();

    const [headerText, setHeaderText] = useState("");
    const [navigateBackTo, setNavigateBackTo] = useState(null);

    const [anchorEl, setAnchorEl] = useState(null);

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const updateHeader = useCallback(() => {
        if (location) {
            const currentMenu = Menus.find((menu) => location.pathname.startsWith(`/${menu.id}`));
            setHeaderText(currentMenu?.name || "");
            setNavigateBackTo(null);
        }
    }, [location]);

    const handleUpdate = useCallback((params) => {
        if (params.text) {
            setHeaderText(params.text);
        }

        if (params.navigateBackTo) {
            setNavigateBackTo(params.navigateBackTo);
        }
    }, []);

    const handleLogout = useCallback(() => {
        setUserData({
            token: undefined,
            user: undefined,
            fetched: true
        });
        setAuthTokenToLocalStorage("");
        ShowSnackbarAlert({ message: "Logged out successfully" });
    }, []);

    function renderLogout() {
        if (userData.user) {
            return (
                <div>
                    <IconButton
                        size="large"
                        aria-label="account of current user"
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                        onClick={handleMenu}
                    >
                        <AccountCircle />
                    </IconButton>
                    {anchorEl
                        ? (
                            <Menu
                                id="menu-appbar"
                                anchorEl={anchorEl}
                                anchorOrigin={{
                                    vertical: "top",
                                    horizontal: "right"
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: "top",
                                    horizontal: "right"
                                }}
                                open={Boolean(anchorEl)}
                                onClose={handleClose}
                            >
                                <MenuItem onClick={handleLogout}>
                                    <Typography color="red">Logout</Typography>
                                </MenuItem>
                            </Menu>
                        ) : ""}
                </div>
            );
        }

        return "";
    }

    useEffect(() => {
        GlobalEventEmitter.on(EVENTS.UPDATE_TOP_BAR, handleUpdate);

        return () => {
            GlobalEventEmitter.off(EVENTS.UPDATE_TOP_BAR, handleUpdate);
        };
    }, []);

    useEffect(() => {
        updateHeader();
    }, [location]);

    return (
        <AppBar
            position="sticky"
            color="transparent"
        >
            <Toolbar disableGutters>
                <Typography
                    variant="h5"
                    component="div"
                    sx={{ flexGrow: 1, ml: 2 }}
                >
                    {navigateBackTo ? (
                        <Tooltip title="Go back">
                            <IconButton
                                edge="start"
                                color="inherit"
                                aria-label="go back"
                                sx={{ mr: 1 }}
                                onClick={() => {
                                    updateHeader();
                                    navigate(navigateBackTo);
                                }}
                            >
                                <ArrowBackIcon />
                            </IconButton>
                        </Tooltip>
                    ) : ""}
                    {headerText || ""}
                </Typography>
                {renderLogout()}
            </Toolbar>
        </AppBar>
    );
}
