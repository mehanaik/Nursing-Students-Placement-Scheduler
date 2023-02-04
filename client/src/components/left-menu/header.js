import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";

import Logo from "../../images/logo.png";

export default function LeftMenuHeader() {
    return (
        <AppBar position="static" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
            <Toolbar disableGutters sx={{ pl: 1 }}>
                <Link href="/">
                    <img src={Logo} style={{ width: "40px", height: "40px", verticalAlign: "middle" }} />
                    <Typography
                        variant="body1"
                        color="white"
                        component="span"
                        sx={{ ml: 1, verticalAlign: "middle" }}
                    >
                        Nursing Placement Schedular
                    </Typography>
                </Link>
            </Toolbar>
        </AppBar>
    );
}
