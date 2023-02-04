import React, {
    useCallback, useEffect, useRef, useState
} from "react";
import Box from "@mui/material/Box";
import { useParams } from "react-router-dom";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import LockIcon from "@mui/icons-material/Lock";
import AlertTitle from "@mui/material/AlertTitle";
import LoadingButton from "../common/LoadingButton";
import { useStore } from "../../store";
import PageLoader from "../common/PageLoader";
import { getStatusText } from "../utils";
import PlacementStudentsTable from "./placement-students-table";
import { EVENTS, GlobalEventEmitter } from "../../services";
import ShowConfirmDialog from "../common/ConfirmDialog";
import ShowSnackbarAlert, { ShowErrorAlert } from "../common/SnackBarAlert";

export default function ViewPlacement() {
    const { placementStore } = useStore();

    const { id } = useParams();

    const [data, setData] = useState(null);

    const studentsTableRef = useRef(null);

    const handleConfirmPlacement = useCallback(async () => {
        if (studentsTableRef.current.isUnSavedChangesPresent()) {
            ShowErrorAlert("Please save the changes and try again");
            return;
        }

        ShowConfirmDialog({
            title: "Confirm Placement",
            description: (
                <>
                    Are you sure you want to confirm this placement?
                    <Alert severity="warning" sx={{ mt: 2 }}>
                        <AlertTitle>Note</AlertTitle>
                        Once confirmed, you cannot
                        {" "}
                        <strong>modify</strong>
                        {" "}
                        or
                        {" "}
                        <strong>delete</strong>
                        {" "}
                        this placement
                    </Alert>
                </>
            ),
            actionBtnName: "Confirm",
            actionBtnColor: "primary",
            onConfirm: async () => {
                try {
                    await placementStore.confirmPlacement(id);
                    ShowSnackbarAlert({
                        message: "Placement confirmed successfully"
                    });
                } catch (err) {
                    ShowSnackbarAlert({
                        message: err.response?.data?.message || err.message,
                        severity: "error",
                        duration: 5000
                    });
                }
            }
        });
    }, []);

    function getToolBarStatus(dataObj) {
        if (dataObj === null) return "";

        if (dataObj.status === "confirmed") {
            return (
                <LoadingButton
                    color="success"
                    variant="text"
                    label="Confirmed"
                    disabled
                    startIcon={<LockIcon />}
                    sx={{ ml: 3 }}
                />
            );
        }

        return (
            <LoadingButton
                color="success"
                variant="text"
                label="Mark as Confirmed"
                startIcon={<LockIcon />}
                sx={{ ml: 3 }}
                onClick={handleConfirmPlacement}
            />
        );
    }

    const fetchDetails = useCallback(async () => {
        if (id) {
            const placement = await placementStore.get(id);
            setData(placement);
            GlobalEventEmitter.emit(EVENTS.UPDATE_TOP_BAR, {
                text: (
                    <>
                        {"Placement - "}
                        {placement?.name || "-"}
                        {getToolBarStatus(placement)}
                    </>
                ),
                navigateBackTo: "/placements"
            });
        } else {
            setData({});
        }
    }, []);

    function renderDetailsBox() {
        return (
            <Alert
                icon={false}
                severity={data.status === "created" ? "info" : "success"}
                sx={{ width: "100%", mb: 2 }}
                className="details-box"
            >
                <Stack
                    direction="row"
                    spacing={2}
                    justifyContent="space-evenly"
                    alignContent="center"
                    alignItems="center"
                    sx={{ width: "100%" }}
                >
                    <Typography
                        variant="subtitle1"
                        component="div"
                        align="center"
                    >
                        <Typography variant="h5" align="center">{data?.term || "-"}</Typography>
                        Term
                    </Typography>

                    <Typography
                        variant="subtitle1"
                        component="div"
                        align="center"
                    >
                        <Typography variant="h5" align="center">{data?.year || "-"}</Typography>
                        Year
                    </Typography>

                    <Typography
                        variant="subtitle1"
                        component="div"
                        align="center"
                    >
                        <Typography variant="h5" align="center">{data?.totalStudents || "0"}</Typography>
                        Students
                    </Typography>

                    <Typography
                        variant="subtitle1"
                        component="div"
                        align="center"
                    >
                        <Typography variant="h5" align="center">{data?.totalLocations || "0"}</Typography>
                        Locations
                    </Typography>

                    <Typography
                        variant="subtitle1"
                        component="div"
                        align="center"
                    >
                        <Typography variant="h5" align="center">{data?.totalSeats || "0"}</Typography>
                        Seats
                    </Typography>

                    <Typography
                        variant="subtitle1"
                        component="div"
                        align="center"
                    >
                        <Typography variant="h5" align="center">{data?.lastUpdatedAt || "-"}</Typography>
                        Last Modified
                    </Typography>

                    <Typography
                        variant="subtitle1"
                        component="div"
                        align="center"
                    >
                        {getStatusText(data.status, {
                            variant: "h6",
                            align: "center"
                        })}
                        {/* <Typography variant="h3" align="center">{ data?.statusText || "-"}</Typography> */}
                        Status
                    </Typography>
                </Stack>
            </Alert>
        );
    }

    function renderStudentsTable() {
        return <PlacementStudentsTable data={data} ref={studentsTableRef} />;
    }

    useEffect(() => {
        fetchDetails();
    }, []);

    if (data === null) {
        return <PageLoader />;
    }

    return (
        <Box
            className="placement-view-container"
            sx={{
                overflow: "auto",
                height: "calc(100vh - 65px)",
                p: 2
            }}
        >
            {renderDetailsBox()}
            {renderStudentsTable()}
        </Box>
    );
}
