import React, {
    useCallback, useEffect, useMemo, useRef, useState
} from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import TextField from "../common/TextField";
import LoadingButton from "../common/LoadingButton";
import SelectBox from "../common/SelectBox";
import { useStore } from "../../store";
import ShowSnackbarAlert from "../common/SnackBarAlert";
import SkeletonLoader from "../common/SkeletonLoader";
import { EVENTS, GlobalEventEmitter } from "../../services";

const DaysList = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const ShiftList = ["Days", "Days/Afternoons"];

export default function AddEditPlacementLocation() {
    const { placementLocationStore, hospitalStore, instructorStore } = useStore();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const editId = searchParams.get("id");

    const [loading, setLoading] = useState(true);
    const [editObj, setEditObj] = useState(null);

    const hospitalsList = useMemo(() => hospitalStore.list.slice().map((hospital) => ({
        name: hospital.campus,
        value: hospital._id
    })), [hospitalStore.list]);

    const instructorsList = useMemo(() => instructorStore.list.slice().map((instructor) => ({
        name: `${instructor.fname} ${instructor.lname}`,
        value: instructor._id
    })), [hospitalStore.list]);

    const nameRef = useRef(null);
    const hospitalRef = useRef(null);
    const instructorRef = useRef(null);
    const unitRef = useRef(null);
    const sectionRef = useRef(null);
    const dayRef = useRef(null);
    const shiftRef = useRef(null);
    const seatsRef = useRef(null);

    const fetchDetailsIfNeeded = useCallback(async () => {
        if (!hospitalStore.fetched) {
            await hospitalStore.fetchAll();
        }

        if (!instructorStore.fetched) {
            await instructorStore.fetchAll();
        }

        if (editId) {
            const location = await placementLocationStore.get(editId);
            setEditObj(location);
        }

        setLoading(false);
    }, []);

    const goBack = useCallback(() => {
        navigate("/placement-locations");
    }, []);

    const validate = useCallback((value, el, errMsg) => {
        let err = null;

        if (!value) {
            err = errMsg;
        }

        el.setError(err);
        return err === null;
    }, []);

    const validateSeats = useCallback((value) => {
        let err = null;
        if (!value) {
            err = "Please enter the number of seats";
        // eslint-disable-next-line no-restricted-globals
        } else if (isNaN(value)) {
            err = "Number of seats should be a number";
        }

        seatsRef.current.setError(err);
        return err === null;
    }, []);

    const handleSubmit = useCallback(async () => {
        const name = nameRef.current.value();
        const hospital = hospitalRef.current.getSelectedValue();
        const instructor = instructorRef.current.getSelectedValue();
        const unit = unitRef.current.value();
        const section = sectionRef.current.value();
        const day = dayRef.current.getSelectedValue();
        const shift = shiftRef.current.getSelectedValue();
        const seats = seatsRef.current.value();

        const isNameValid = validate(name, nameRef.current, "Please enter the name for this placement location");
        const isHospitalValid = validate(hospital, hospitalRef.current, "Please select the hospital");
        const isInstructorValid = validate(instructor, instructorRef.current, "Please select the instructor");
        const isUnitValid = validate(unit, unitRef.current, "Please enter the unit");
        const isSectionValid = validate(section, sectionRef.current, "Please enter the section");
        const isDayValid = validate(day, dayRef.current, "Please select the day");
        const isShiftValid = validate(day, shiftRef.current, "Please select the shift");
        const isSeatsValid = validateSeats(seats);

        if (!isNameValid || !isHospitalValid || !isInstructorValid || !isUnitValid || !isSectionValid || !isDayValid || !isShiftValid || !isSeatsValid) {
            return;
        }

        const params = {
            name, hospital, instructor, unit, section, day, seats, shift
        };

        if (editObj) {
            await placementLocationStore.edit(editObj._id, params);
            ShowSnackbarAlert({
                message: "Saved successfully"
            });
        } else {
            await placementLocationStore.addNew(params);
            ShowSnackbarAlert({
                message: "Added successfully"
            });
        }

        goBack();
    }, [editObj]);

    function renderActions() {
        return (
            <Box>
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

    function renderContent() {
        return (
            <Stack sx={{ width: "50%" }} spacing={2}>
                <TextField
                    label="Enter a name for this location for future use"
                    ref={nameRef}
                    value={editObj?.name}
                    required
                />
                <SelectBox
                    label="Select Hospital"
                    ref={hospitalRef}
                    required
                    selected={editObj?.hospital._id}
                    options={hospitalsList}
                />
                <SelectBox
                    label="Select Instructor"
                    ref={instructorRef}
                    required
                    selected={editObj?.instructor._id}
                    options={instructorsList}
                />
                <TextField
                    label="Unit"
                    ref={unitRef}
                    value={editObj?.unit}
                    required
                />
                <TextField
                    label="Section"
                    ref={sectionRef}
                    value={editObj?.section}
                    required
                />
                <SelectBox
                    label="Day"
                    ref={dayRef}
                    required
                    selected={editObj?.day}
                    options={DaysList}
                />
                <SelectBox
                    label="Shift"
                    ref={shiftRef}
                    required
                    selected={editObj?.shift || ""}
                    options={ShiftList}
                />
                <TextField
                    label="Seats"
                    ref={seatsRef}
                    value={editObj?.seats}
                    required
                />
                {renderActions()}
            </Stack>
        );
    }

    useEffect(() => {
        fetchDetailsIfNeeded();
    }, []);

    useEffect(() => {
        GlobalEventEmitter.emit(EVENTS.UPDATE_TOP_BAR, {
            text: editObj ? "Edit Placement Location" : "Add New Placement Location",
            navigateBackTo: "/placement-locations"
        });
    }, [editObj]);

    return (
        <Box sx={{ overflow: "auto", height: "calc(100vh - 60px)", p: 2 }}>
            {loading ? <SkeletonLoader /> : (
                <>
                    {renderContent()}
                </>
            )}
        </Box>
    );
}
