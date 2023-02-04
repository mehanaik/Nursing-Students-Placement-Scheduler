import React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Backdrop from "@mui/material/Backdrop";

export default function PageLoader() {
    return (
        // <Box sx={{
        //     width: { xs: "95%", lg: "30%" },
        //     margin: "15% auto",
        //     textAlign: "center"
        // }}
        // >
        //     <CircularProgress />
        // </Box>
        <Backdrop
            sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open
            // onClick={handleClose}
        >
            {" "}
            <CircularProgress color="inherit" />
        </Backdrop>
    );
}
