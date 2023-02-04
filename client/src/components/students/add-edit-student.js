import React, {
    useCallback, useEffect, useMemo, useRef, useState
} from "react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import TextField from "../common/TextField";
import LoadingButton from "../common/LoadingButton";
import SelectBox from "../common/SelectBox";
import { useStore } from "../../store";
import ShowSnackbarAlert from "../common/SnackBarAlert";
import SkeletonLoader from "../common/SkeletonLoader";
import { getYearsList, isValidEmailAddress, TermsList } from "../utils";
import { EVENTS, GlobalEventEmitter } from "../../services";
import TabPanel from "../common/TabPanel";
import StudentPlacementHistory from "./student-placement-history";

export default function AddEditStudent() {
    const { studentStore, schoolStore } = useStore();
    const navigate = useNavigate();

    const { id: editId } = useParams();

    const [loading, setLoading] = useState(true);
    const [editObj, setEditObj] = useState(null);
    const [selectedTab, setSelectedTab] = useState(0);

    const schoolList = useMemo(() => schoolStore.list.slice().map((school) => ({
        name: `${school.name}, ${school.campus}`,
        value: school._id
    })), [schoolStore.list]);

    const fnameRef = useRef(null);
    const lnameRef = useRef(null);
    const studentIdRef = useRef(null);
    const emailRef = useRef(null);
    // const phoneNumberRef = useRef(null);
    // const schoolRef = useRef(null);
    const yearRef = useRef(null);
    const termRef = useRef(null);
    const notesRef = useRef(null);

    const handleTabChange = (event, newValue) => {
        setSelectedTab(newValue);
    };

    const fetchDetailsIfNeeded = useCallback(async () => {
        if (editId) {
            const student = await studentStore.get(editId);
            setEditObj(student);
        }

        setLoading(false);
    }, []);

    const goBack = useCallback(() => {
        navigate("/students");
    }, []);

    const validate = useCallback((value, el, errMsg) => {
        let err = null;

        if (!value) {
            err = errMsg;
        }

        el.setError(err);
        return err === null;
    }, []);

    const validateEmailAddress = useCallback(() => {
        const value = emailRef.current.value();
        let err = null;

        if (!value) {
            err = "Please enter the email";
        } else if (!isValidEmailAddress(value)) {
            err = "Invalid email address";
        }

        emailRef.current.setError(err);
        return err === null;
    }, []);

    const handleSubmit = useCallback(async () => {
        const fname = fnameRef.current.value();
        const lname = lnameRef.current.value();
        const studentId = studentIdRef.current.value();
        const email = emailRef.current.value();
        // const phoneNumber = phoneNumberRef.current.value();
        // const school = schoolRef.current.getSelectedValue();
        const year = yearRef.current.getSelectedValue();
        const term = termRef.current.getSelectedValue();
        const notes = notesRef.current.value();

        const isFNameValid = validate(fname, fnameRef.current, "Please enter the First name");
        const isLNameValid = validate(lname, lnameRef.current, "Please enter the Last name");
        const isStudentIdValid = validate(studentId, studentIdRef.current, "Please enter the Student ID");
        const isEmailValid = validateEmailAddress();
        // const isPhoneValid = validate(phoneNumber, phoneNumberRef.current, "Please enter the phone number");
        // const isSchoolValid = validate(school, schoolRef.current, "Please select the school");
        const isYearValid = validate(year, yearRef.current, "Please select the year");
        const isTermValid = validate(term, termRef.current, "Please select the term");

        if (!isFNameValid || !isLNameValid || !isStudentIdValid || !isEmailValid || !isYearValid || !isTermValid) {
            return;
        }

        const params = {
            fname, lname, studentId, email, year, term, notes
        };
        try {
            if (editObj) {
                await studentStore.edit(editObj._id, params);
                ShowSnackbarAlert({
                    message: "Saved successfully"
                });
            } else {
                await studentStore.addNew(params);
                ShowSnackbarAlert({
                    message: "Added successfully"
                });
            }

            goBack();
        } catch (err) {
            ShowSnackbarAlert({
                message: err.response?.data?.message || err.message,
                severity: "error"
            });
        }
    }, [editObj]);

    function renderContent() {
        return (
            <Stack sx={{ width: "50%", my: 2 }} spacing={2}>
                <TextField
                    label="Student ID"
                    ref={studentIdRef}
                    value={editObj?.studentId}
                    required
                    autoFocus
                />
                <TextField
                    label="First name"
                    ref={fnameRef}
                    value={editObj?.fname}
                    required
                />
                <TextField
                    label="Last name"
                    ref={lnameRef}
                    value={editObj?.lname}
                    required
                />
                <TextField
                    label="Email"
                    ref={emailRef}
                    value={editObj?.email}
                    required
                />
                {/* <TextField
                    label="Phone number"
                    ref={phoneNumberRef}
                    value={editObj?.phoneNumber}
                    required
                />
                <SelectBox
                    label="Select School"
                    ref={schoolRef}
                    required
                    selected={editObj?.school._id}
                    options={schoolList}
                /> */}
                <SelectBox
                    label="Select Year"
                    ref={yearRef}
                    required
                    selected={editObj?.year || ""}
                    options={getYearsList()}
                />
                <SelectBox
                    label="Select Term"
                    ref={termRef}
                    selected={editObj?.term || ""}
                    options={TermsList}
                    required
                />
                <TextField
                    label="Notes"
                    ref={notesRef}
                    value={editObj?.notes || ""}
                    multiline
                    rows={4}
                />
            </Stack>
        );
    }

    function renderActions() {
        return (
            <Box sx={{ mb: 2 }}>
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

    function renderTabs() {
        if (!editObj) {
            return (
                <>
                    {renderContent()}
                    {renderActions()}
                </>
            );
        }

        return (
            <Box sx={{ mt: 1 }}>
                <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                    <Tabs
                        value={selectedTab}
                        onChange={handleTabChange}
                    >
                        <Tab label="Details" />
                        <Tab label="Placement History" />
                    </Tabs>
                </Box>
                <TabPanel value={selectedTab} index={0}>
                    {renderContent()}
                    {renderActions()}
                </TabPanel>
                <TabPanel value={selectedTab} index={1}>
                    <StudentPlacementHistory
                        placementsHistory={editObj.placementsHistory}
                        placementLocationsHistory={editObj.placementLocationsHistory}
                    />
                </TabPanel>
            </Box>
        );
    }

    useEffect(() => {
        fetchDetailsIfNeeded();

        GlobalEventEmitter.emit(EVENTS.UPDATE_TOP_BAR, {
            text: editId ? "Edit Student" : "Add Student",
            navigateBackTo: "/students"
        });
    }, []);

    useEffect(() => {
        GlobalEventEmitter.emit(EVENTS.UPDATE_TOP_BAR, {
            text: editObj ? (
                <>
                    Student -
                    <em>
                        {`${editObj.fname} ${editObj.lname}`}

                    </em>
                </>
            ) : "Add New Student",
            navigateBackTo: "/students"
        });
    }, [editObj]);

    return (
        <Box sx={{ overflow: "auto", height: "calc(100vh - 60px)", px: 2 }}>
            {loading ? <SkeletonLoader /> : renderTabs()}
        </Box>
    );
}
