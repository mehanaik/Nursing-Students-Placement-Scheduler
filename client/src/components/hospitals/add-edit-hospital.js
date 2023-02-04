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

export default function AddEditHospital() {
    const { hospitalStore } = useStore();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const editId = searchParams.get("id");

    const [loading, setLoading] = useState(true);
    const [editObj, setEditObj] = useState(null);

    const nameRef = useRef(null);
    const campusRef = useRef(null);
    const addressRef = useRef(null);

    const goBack = useCallback(() => {
        navigate("/hospitals");
    }, []);

    const fetchDetails = useCallback(async () => {
        if (editId) {
            try {
                const hospital = await hospitalStore.get(editId);
                setEditObj(hospital);
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

    const validateAddress = useCallback((address) => {
        let err = null;

        if (!address) {
            err = "Please enter the address";
        }

        addressRef.current.setError(err);
        return err === null;
    }, []);

    const handleSubmit = useCallback(async () => {
        const name = nameRef.current.value();
        const campus = campusRef.current.value();
        const address = addressRef.current.value();

        const isNameValid = validateName(name);
        const isCampusValid = validateCampus(campus);
        const isAddrValid = validateAddress(address);

        if (!isNameValid || !isAddrValid) {
            return;
        }

        const params = { name, campus, address };

        if (editObj) {
            await hospitalStore.edit(editObj._id, params);
            ShowSnackbarAlert({
                message: "Saved successfully"
            });
        } else {
            await hospitalStore.addNew(params);
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
                <TextField
                    label="Address"
                    ref={addressRef}
                    required
                    value={editObj?.address}
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
            text: editObj ? "Edit Hospital" : "Add New Hospital",
            navigateBackTo: "/hospitals"
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
