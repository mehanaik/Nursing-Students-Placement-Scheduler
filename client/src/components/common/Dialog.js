import * as React from "react";
import { createRoot } from "react-dom/client";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { ThemeProvider } from "@mui/system";
import { SlideTransition } from "./SlideTransition";
import LoadingButton from "./LoadingButton";
import { Theme } from "../../theme";

const containerId = "modalDialogContainerDiv";

function ModalDialog(props) {
    const [open, setOpen] = React.useState(true);

    const handleClose = React.useCallback(() => {
        setOpen(false);
        if (props.onClose) props.onClose();
    }, []);

    const handleAction = React.useCallback(async () => {
        try {
            await props.onConfirm();
            setOpen(false);
        } catch {
            throw new Error();
        }
    }, []);

    return (
        <ThemeProvider theme={Theme}>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-dialog-title"
                aria-describedby="modal-dialog-description"
                TransitionComponent={SlideTransition}
                maxWidth={props.maxWidth || "sm"}
            >
                <DialogTitle id="modal-dialog-title">
                    {props.title}
                </DialogTitle>
                <DialogContent id="modal-dialog-description">
                    {props.content}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="grey">{props.cancelBtnName || "Cancel"}</Button>
                    <LoadingButton
                        onClick={handleAction}
                        label={props.actionBtnName}
                        variant="text"
                    />
                </DialogActions>
            </Dialog>
        </ThemeProvider>
    );
}

export default function ShowDialog(props) {
    let containerEl = document.getElementById(containerId);

    if (containerEl) {
        containerEl.remove();
    }

    containerEl = document.createElement("div");
    containerEl.id = containerId;
    document.body.appendChild(containerEl);

    const rootEl = createRoot(containerEl);
    rootEl.render(
        <ModalDialog {...props} />
    );
}
