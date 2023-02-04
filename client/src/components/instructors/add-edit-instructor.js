import React, {
    useCallback, useEffect, useRef, useState
} from "react";
import Button from "@mui/material/Button";
import { useNavigate, useSearchParams } from "react-router-dom";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import TextField from "../common/TextField";
import LoadingButton from "../common/LoadingButton";
import { useStore } from "../../store";
import ShowSnackbarAlert from "../common/SnackBarAlert";
import SkeletonLoader from "../common/SkeletonLoader";
import { EVENTS, GlobalEventEmitter } from "../../services";

export default function AddEditInstructor() {
    const { instructorStore } = useStore();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const editId = searchParams.get("id");

    const [loading, setLoading] = useState(true);
    const [editObj, setEditObj] = useState(null);

    const fnameRef = useRef(null);
    const lnameRef = useRef(null);
    const emailRef = useRef(null);
    const commentsRef = useRef(null);

    const goBack = useCallback(() => {
        navigate("/instructors");
    }, []);

    const fetchDetails = useCallback(async () => {
        if (editId) {
            try {
                const instructor = await instructorStore.get(editId);
                setEditObj(instructor);
                setLoading(false);
            } catch {
                goBack();
            }
        } else {
            setLoading(false);
        }
    }, []);

    const validateFName = useCallback((value) => {
        let err = null;

        if (!value) {
            err = "Please enter the instructor's first name";
        }

        fnameRef.current.setError(err);
        return err === null;
    }, []);

    const validateLName = useCallback((value) => {
        let err = null;

        if (!value) {
            err = "Please enter the instructor's last name";
        }

        lnameRef.current.setError(err);
        return err === null;
    }, []);

    const validateEmailAddress = useCallback((value) => {
        let err = null;

        if (!value) {
            err = "Please enter the instructor's email address";
        }

        emailRef.current.setError(err);
        return err === null;
    }, []);

    const handleSubmit = useCallback(async () => {
        const fname = fnameRef.current.value();
        const lname = lnameRef.current.value();
        const email = emailRef.current.value();
        const comments = commentsRef.current.value();

        const isFNameValid = validateFName(fname);
        const isLNameValid = validateLName(lname);
        const isEmailValid = validateEmailAddress(email);

        if (!isFNameValid || !isLNameValid || !isEmailValid) {
            return;
        }

        const params = {
            fname, lname, email, comments
        };

        if (editObj) {
            await instructorStore.edit(editObj._id, params);
            ShowSnackbarAlert({
                message: "Saved successfully"
            });
        } else {
            await instructorStore.addNew(params);
            ShowSnackbarAlert({
                message: "Added successfully"
            });
        }
        goBack();
    }, [editObj]);

    function renderContent() {
        return (
            <Stack sx={{ width: "40%" }} spacing={2}>
                <TextField
                    label="First name"
                    ref={fnameRef}
                    value={editObj?.fname}
                    required
                    autoFocus
                />
                <TextField
                    label="Last name"
                    ref={lnameRef}
                    value={editObj?.lname}
                    required
                />
                <TextField
                    label="Email address"
                    ref={emailRef}
                    value={editObj?.email}
                    required
                />
                <TextField
                    label="Comments"
                    ref={commentsRef}
                    value={editObj?.comments}
                    multiline
                    rows={4}
                />
            </Stack>
        );
    }

    function renderActions() {
        return (
            <Box mt={3}>
                <LoadingButton
                    label={editObj ? "Save" : "Add"}
                    onClick={handleSubmit}
                    sx={{ mr: 1 }}
                />
                <Button
                    onClick={goBack}
                    color="grey"
                    variant="outlined"
                >
                    Cancel
                </Button>
            </Box>
        );
    }

    useEffect(() => {
        fetchDetails();
    }, []);

    useEffect(() => {
        GlobalEventEmitter.emit(EVENTS.UPDATE_TOP_BAR, {
            text: editObj ? "Edit Instructor" : "Add New Instructor",
            navigateBackTo: "/instructors"
        });
    }, [editObj]);

    return (
        <Box sx={{
            overflow: "auto", height: "calc(100vh - 60px)", p: 2
        }}
        >
            {loading ? <SkeletonLoader /> : (
                <>
                    {renderContent()}
                    {renderActions()}
                </>
            )}
        </Box>
    );
}
