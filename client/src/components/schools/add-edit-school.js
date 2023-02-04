import  React, { useCallback, useEffect, useRef, useState} from "react";
import Button from "@mui/material/Button";
import { useNavigate, useSearchParams } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Stack from "@mui/material/Stack";
import TextField from "../common/TextField";
import LoadingButton from "../common/LoadingButton";
import { useStore } from "../../store";
import SkeletonLoader from "../common/SkeletonLoader";
import ShowSnackbarAlert from "../common/SnackBarAlert";
import { EVENTS, GlobalEventEmitter } from "../../services";

export default function AddEditSchool() {
    const { schoolStore } = useStore();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const editId = searchParams.get("id");

    const [loading, setLoading] = useState(true);
    const [editObj, setEditObj] = useState(null);

    const nameRef = useRef(null);
    const campusRef = useRef(null);

    const goBack = useCallback(() => {
        navigate("/schools");
    }, []);

    const fetchDetails = useCallback(async () => {
        if (editId) {
            try {
                const school = await schoolStore.get(editId);
                setEditObj(school);
                setLoading(false);
            } catch {
                goBack();
            }
        } else {
            setLoading(false);
        }
    }, []);

    const validateName = useCallback((name) => {
        let err = null;

        if (!name) {
            err = "Please enter the name";
        }

        nameRef.current.setError(err);
        return err === null;
    }, []);

    const validateCampus = useCallback((campus) => {
        let err = null;

        if (!campus) {
            err = "Please enter the campus";
        }

        campusRef.current.setError(err);
        return err === null;
    }, []);

    const handleSubmit = useCallback(async () => {
        const name = nameRef.current.value();
        const campus = campusRef.current.value();

        const isNameValid = validateName(name);
        const isCampusValid = validateCampus(campus);

        if (!isNameValid || !isCampusValid) {
            return;
        }

        const params = { name, campus };

        if (editObj) {
            await schoolStore.edit(editObj._id, params);
            ShowSnackbarAlert({
                message: "Saved successfully"
            });
        } else {
            await schoolStore.addNew(params);
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
                    label="Name"
                    ref={nameRef}
                    autoFocus
                    autoComplete="off"
                    required
                    value={editObj?.name}
                />
                <TextField
                    label="Campus"
                    ref={campusRef}
                    value={editObj?.campus}
                    required
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
            text: editObj ? "Edit School" : "Add New School",
            navigateBackTo: "/schools"
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
