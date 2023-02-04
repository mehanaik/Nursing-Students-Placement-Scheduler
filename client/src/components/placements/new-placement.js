import React, {
    useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState
} from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import StepContent from "@mui/material/StepContent";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { toJS } from "mobx";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import { AppBar, Toolbar } from "@mui/material";
import { useStore } from "../../store";
import PageLoader from "../common/PageLoader";
import SelectBox from "../common/SelectBox";
import { getYearsList, TermsList } from "../utils";
import PlacementLocationsTable from "./placement-locations-table";
import { ShowErrorAlert, ShowSuccessAlert } from "../common/SnackBarAlert";
import TextField from "../common/TextField";
import LoadingButton from "../common/LoadingButton";
import { EVENTS, GlobalEventEmitter } from "../../services";

export default function NewPlacement() {
    const { placementLocationStore, placementStore } = useStore();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [activeStep, setActiveStep] = useState(0);

    const [stateObj, setStateObj] = useState({});

    const yearRef = useRef(null);
    const termRef = useRef(null);
    const nameRef = useRef(null);
    const locationTableRef = useRef(null);

    const goBack = useCallback(() => {
        navigate("/placements");
    }, []);

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleGoToLocations = useCallback(() => {
        const year = yearRef.current.getSelectedValue();
        if (!year) {
            ShowErrorAlert("Please select the Student's year");
            return;
        }
        const term = termRef.current.getSelectedValue();
        if (!term) {
            ShowErrorAlert("Please select the Student's term");
            return;
        }

        setStateObj((old) => ({
            ...old,
            year,
            term
        }));
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }, []);

    const handleGoToEnterDetails = useCallback(() => {
        const selected = locationTableRef.current.getSelected();
        if (selected.length > 0) {
            const newSelected = {
                ...stateObj, locations: selected
            };
            setStateObj(newSelected);
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
            return;
        }

        ShowErrorAlert("Please select the placement locations to allocate the students");
    }, [stateObj]);

    const handleCreate = useCallback(async () => {
        const name = nameRef.current.value();
        if (!name) {
            nameRef.current.setError("Please enter the name for this placement");
            return;
        }
        try {
            const id = await placementStore.createPlacement({
                ...stateObj,
                name
            });
            ShowSuccessAlert("Created Successfully");
            navigate(`/placements/${id}`);
        } catch (err) {
            ShowErrorAlert(err.message);
        }
    }, [stateObj]);

    const fetchDetailsIfNeeded = useCallback(async () => {
        if (!placementLocationStore.fetched) {
            await placementLocationStore.fetchAll();
        }

        setLoading(false);
    }, []);

    function renderSelectStudents() {
        return (
            <Stack sx={{ width: "30%", my: 2 }} spacing={2}>
                <SelectBox
                    label="Select Year"
                    ref={yearRef}
                    selected={stateObj.year || ""}
                    required
                    options={getYearsList()}
                />
                <SelectBox
                    label="Select Term"
                    ref={termRef}
                    options={TermsList}
                    selected={stateObj.term || ""}
                    required
                />
                <Box>
                    <Button
                        variant="contained"
                        onClick={handleGoToLocations}
                        sx={{ mt: 1, mr: 1 }}
                    >
                        Next
                    </Button>
                </Box>
            </Stack>
        );
    }

    function renderSelectLocations() {
        const tableData = toJS(placementLocationStore.list).map((obj) => ({
            ...obj,
            hospital: obj.hospital.campus,
            instructor: `${obj.instructor.fname} ${obj.instructor.lname}`
        }));
        return (
            <Stack spacing={2}>
                <PlacementLocationsTable
                    // key={`locations_table_${Date.now()}`}
                    ref={locationTableRef}
                    rows={tableData}
                    selectedRows={stateObj.locations || []}
                />
                <Box>
                    <Button
                        variant="contained"
                        onClick={handleGoToEnterDetails}
                        sx={{ mt: 1, mr: 1 }}
                    >
                        Next
                    </Button>
                    <Button
                        onClick={handleBack}
                        sx={{ mt: 1, mr: 1 }}
                    >
                        Back
                    </Button>
                </Box>
            </Stack>
        );
    }

    function renderEnterPlacementDetails() {
        return (
            <Stack sx={{ width: "30%", my: 2 }} spacing={2}>
                {/* <Alert severity="info">
                    <AlertTitle>
                        Please confirm the following:
                    </AlertTitle>
                    <Box>
                        Selected Year -
                        {" "}
                        <strong>{stateObj.year}</strong>
                    </Box>
                    <Box>
                        Selected Term -
                        {" "}
                        <strong>{stateObj.term}</strong>
                    </Box>
                    <Box>
                        Selected Locations -
                        {" "}
                        <strong>{stateObj.locations?.length || 0}</strong>
                    </Box>
                </Alert> */}
                <TextField
                    label="Name"
                    ref={nameRef}
                    value={stateObj.name || ""}
                    required
                    autoFocus
                />
                <Box>
                    <LoadingButton
                        variant="contained"
                        onClick={handleCreate}
                        sx={{ mt: 1, mr: 1 }}
                        label="Create"
                    />
                    <Button
                        onClick={handleBack}
                        sx={{ mt: 1, mr: 1 }}
                    >
                        Back
                    </Button>
                </Box>
            </Stack>
        );
    }

    const steps = useMemo(() => [
        {
            id: "selectStudents",
            name: "Select Students",
            description: "Select the Student's year and term for which you want to do the placement",
            renderFunc: renderSelectStudents
        },
        {
            id: "selectLocations",
            name: "Select Placement Locations",
            description: "Select the Placement locations to assign students",
            renderFunc: renderSelectLocations
        },
        {
            id: "enterPlacementDetails",
            name: "Placement Details",
            description: "Enter the name for the Placement for future use",
            renderFunc: renderEnterPlacementDetails
        }
    ], [stateObj]);

    function getStepDescription(step, index) {
        if (index === activeStep) {
            if (step.description) return <Typography>{step.description}</Typography>;

            return "";
        }

        if (index === 0) {
            return (
                <Typography variant="subtitle1">
                    {"Selected Term: "}
                    <Typography
                        variant="button"
                        color="primary"
                        component="span"
                    >
                        {stateObj.term || "-"}
                    </Typography>
                    {", Selected Year: "}
                    <Typography
                        variant="button"
                        color="primary"
                        component="span"
                    >
                        {stateObj.year || "-"}
                    </Typography>
                </Typography>
            );
        }

        if (index === 1) {
            return (
                <Typography variant="subtitle1">
                    {"Selected Locations: "}
                    <Typography
                        variant="button"
                        color="primary"
                        component="span"
                    >
                        {stateObj?.locations?.length || "-"}
                    </Typography>
                </Typography>
            );
        }

        return null;
    }

    function renderContent() {
        return (
            <Stepper
                activeStep={activeStep}
                orientation="vertical"
            >
                {steps.map((step, index) => (
                    <Step key={step.id}>
                        <StepLabel
                            optional={getStepDescription(step, index)}
                        >
                            <Typography variant="h6" component="div">{step.name}</Typography>
                            {/* {step.name} */}
                        </StepLabel>
                        <StepContent>
                            <Box sx={{ mb: 2 }}>
                                {step.renderFunc()}
                                <div />
                            </Box>
                        </StepContent>
                    </Step>
                ))}
            </Stepper>
        );
    }

    useEffect(() => {
        fetchDetailsIfNeeded();

        GlobalEventEmitter.emit(EVENTS.UPDATE_TOP_BAR, {
            text: "Create new placement",
            navigateBackTo: "/placements"
        });
    }, []);

    return (
        <Box sx={{
            overflow: "auto", height: "calc(100vh - 60px)", p: 2
        }}
        >
            {loading ? <PageLoader /> : renderContent()}
        </Box>
    );
}
