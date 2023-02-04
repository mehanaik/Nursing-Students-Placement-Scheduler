import * as React from "react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { createRoot } from "react-dom/client";

const Alert = React.forwardRef((props, ref) => (
    <MuiAlert
        elevation={6}
        ref={ref}
        variant="filled"
        {...props}
    />
));

const containerId = "snackBarAlertContainerDiv";

export function SnackbarAlert({
    children, message, severity, duration, onClose = () => {}
}) {
    const [open, setOpen] = React.useState(true);

    const handleClose = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }

        setOpen(false);
        onClose();
    };

    return (
        <Snackbar
            open={open}
            autoHideDuration={duration || 2000}
            onClose={handleClose}
            anchorOrigin={{
                vertical: "bottom",
                horizontal: "left"
            }}
        >
            <Alert
                onClose={handleClose}
                severity={severity || "success"}
                sx={{ width: "100%" }}
            >
                {children || message}
            </Alert>
        </Snackbar>
    );
}

export default function ShowSnackbarAlert(props) {
    let containerEl = document.getElementById(containerId);

    if (containerEl) {
        containerEl.remove();
    }

    containerEl = document.createElement("div");
    containerEl.id = containerId;
    document.body.appendChild(containerEl);

    createRoot(containerEl).render(
        <SnackbarAlert {...props} />
    );
}

export function ShowErrorAlert(message, duration = 2000) {
    ShowSnackbarAlert({
        message, duration, severity: "error"
    });
}

export function ShowSuccessAlert(message) {
    ShowSnackbarAlert({ message });
}
