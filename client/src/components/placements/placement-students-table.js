import {
    forwardRef,
    useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState
} from "react";
import Box from "@mui/material/Box";
import { observer } from "mobx-react";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import AddIcon from "@mui/icons-material/Add";
import { useStore } from "../../store";
import Table from "../common/Table";
import SelectBox from "../common/SelectBox";
import TextField from "../common/TextField";
import LoadingButton from "../common/LoadingButton";
import ShowConfirmDialog from "../common/ConfirmDialog";
import { ShowErrorAlert, ShowSuccessAlert } from "../common/SnackBarAlert";
import ShowDialog from "../common/Dialog";

let seatsCountChanges = {};
let changes = {};

const PlacementStudentsTable = forwardRef(({ data = {} }, ref) => {
    const { placementStore } = useStore();
    const navigate = useNavigate();

    const [showActionBtns, setShowActionBtns] = useState(false);

    const {
        placementLocations = [], placements = [], totalStudents, status
    } = data;

    const [availableSeatsMap, setAvailableSeatsMap] = useState(() => {
        const map = {
            "": Infinity
        };
        placementLocations.forEach((location) => {
            const totalSeats = Number(location.seats) || 0;
            const filledSeats = placements.filter((placement) => location._id === placement.placementLocationId).length;
            map[location._id] = totalSeats - filledSeats;
        });
        return map;
    }, [placementLocations]);

    const placementMap = useMemo(() => placements.reduce((obj, placement) => {
        obj[placement.studentId] = placement;
        return obj;
    }, {}), [placements]);

    const studentsPlacements = useMemo(() => data.students.map((student) => ({
        ...student,
        name: `${student.fname} ${student.lname}`,
        placementLocationId: placementMap[student._id]?.placementLocationId || "",
        notes: placementMap[student._id]?.notes || ""
    })), [data, placementMap]);

    // const [changes, setChanges] = useState({});

    const tableData = studentsPlacements.slice();

    const getLocations = useCallback(() => [
        { name: <em>None</em>, value: "" },
        ...placementLocations.map((location) => ({
            name: location.name,
            otherName: (
                <div>
                    {location.name}
                    <em>
                        {/* {"Total Seats: "}
                            <b>{location.seats}</b> */}
                        {" (Available Seats: "}
                        <b>{availableSeatsMap[location._id]}</b>
                        )
                    </em>
                </div>
            ),
            value: location._id,
            availableSeats: availableSeatsMap[location._id]
        }))
    ], [placementLocations, availableSeatsMap]);

    const [locationsListForSelectBox, setLocationsListForSelectBox] = useState(getLocations());

    const handleLocationChange = useCallback((studentId, newLocationId) => {
        const rowIndex = studentsPlacements.findIndex((tableRow) => tableRow.studentId === studentId);

        if (rowIndex === -1) {
            ShowErrorAlert("Oops! Something went wrong");
            return;
        }

        const row = studentsPlacements[rowIndex];

        if (newLocationId === "" || availableSeatsMap[newLocationId] > 0) {
            // const newChanges = { ...changes };
            if (!(row._id in changes)) {
                changes[row._id] = {
                    studentId: row._id,
                    placementLocationId: row.placementLocationId,
                    notes: row.notes
                };
            }

            changes[row._id] = {
                ...changes[row._id],
                placementLocationId: newLocationId
            };

            // setChanges(newChanges);

            setAvailableSeatsMap((old) => ({
                ...old,
                [row.placementLocationId]: old[row.placementLocationId] + 1,
                [newLocationId]: old[newLocationId] - 1
            }));

            setShowActionBtns(true);

            // set in table data
            const tableRowIndex = tableData.findIndex((tableRow) => tableRow.studentId === studentId);
            tableData[tableRowIndex].placementLocationId = newLocationId;
        } else {
            ShowErrorAlert("No seats available at this location");
        }
    }, [changes, availableSeatsMap]);

    const handleNotesChange = useCallback((studentId) => (value) => {
        const rowIndex = studentsPlacements.findIndex((tableRow) => tableRow.studentId === studentId);

        if (rowIndex === -1) {
            ShowErrorAlert("Oops! Something went wrong");
            return;
        }

        const row = studentsPlacements[rowIndex];

        // const newChanges = { ...changes };
        if (!(row._id in changes)) {
            changes[row._id] = {
                studentId: row._id,
                placementLocationId: row.placementLocationId,
                notes: row.notes
            };
        }

        changes[row._id] = {
            ...changes[row._id],
            notes: value
        };

        // setChanges(newChanges);

        setShowActionBtns(true);

        // set in table data
        const tableRowIndex = tableData.findIndex((tableRow) => tableRow.studentId === studentId);
        tableData[tableRowIndex].notes = value;
    }, [changes]);

    const handleSaveChanges = useCallback(async () => {
        const changesArr = [...Object.values(changes)];
        try {
            const params = {
                placements: Object.values(changesArr)
            };
            await placementStore.update(data._id, params);
            changes = {};
            setShowActionBtns(false);
            ShowSuccessAlert("Changes saved successfully");
        } catch {
            ShowErrorAlert("Oops! Something went wrong");
        }
    }, [changes]);

    const handleReset = useCallback(() => {
        ShowConfirmDialog({
            title: "Reset Changes",
            description: "Are you sure you want to reset the changes? Any unsaved changes will be lost.",
            actionBtnName: "Reset",
            onConfirm: async () => navigate(0)
        });
    }, []);

    const handleSeatCountChange = useCallback((location, seatsCount) => {
        seatsCountChanges[location._id] = Number(seatsCount);
    }, []);

    const handleAddSeat = useCallback(() => {
        const map = { ...availableSeatsMap };

        ShowDialog({
            title: "Add Additional Seats for Locations",
            actionBtnName: "Save",
            maxWidth: "lg",
            content: (
                <Stack spacing={2}>
                    {placementLocations.map((location, index) => (
                        <TextField
                            key={`add-seat-input-${index}`}
                            label={location.name}
                            value="0"
                            type="number"
                            onChange={(e) => handleSeatCountChange(location, e)}
                        />
                    ))}
                </Stack>
            ),
            onConfirm: () => {
                Object.keys(seatsCountChanges).forEach((key) => {
                    map[key] += seatsCountChanges[key];
                });
                seatsCountChanges = {};
                setAvailableSeatsMap(map);
            }
        });
    }, [availableSeatsMap]);

    const getToolBarActions = useCallback(() => (
        <Box>
            {/* <Typography variant="h6" component="span">Placements</Typography> */}
            {status === "created"
                ? (
                    <Tooltip title={(
                        <Typography variant="subtitle1">
                            Add additional seats to locations to assign students
                        </Typography>
                    )}
                    >
                        <Button
                            color="primary"
                            variant="text"
                            onClick={handleAddSeat}
                            startIcon={<AddIcon />}
                        >
                            Add Seat
                        </Button>
                    </Tooltip>
                ) : <Typography variant="h6" component="span">Students</Typography>}
            {showActionBtns ? (
                <>
                    |
                    <LoadingButton
                        color="success"
                        variant="text"
                        label="Save Changes"
                        onClick={() => handleSaveChanges(changes)}
                    />
                    |
                    <LoadingButton
                        color="error"
                        variant="text"
                        label="Reset Changes"
                        onClick={handleReset}
                    />
                </>
            ) : ""}
        </Box>
    ), [showActionBtns]);

    const columns = useMemo(() => [
        {
            name: "name", label: "Student Name"
        },
        {
            name: "studentId", label: "Student ID"
        },
        {
            label: "Placement Location",
            name: "placementLocationId",
            options: {
                // eslint-disable-next-line react/no-unstable-nested-components
                customBodyRender: (value, tableMeta) => {
                    if (data.status === "created") {
                        return (
                            <SelectBox
                                key={`student_location_${tableMeta.rowIndex}_${Date.now()}`}
                                selected={value || ""}
                                options={locationsListForSelectBox}
                                variant="standard"
                                size="small"
                                onChange={(val) => handleLocationChange(tableMeta.currentTableData[tableMeta.rowIndex]?.data[1] || "", val)}
                                onSelectPreventChange
                            />
                        );
                    }

                    if (value === "") {
                        return <em>Not Assigned</em>;
                    }

                    return locationsListForSelectBox.find((location) => location.value === value)?.name || "-";
                }
            }
        },
        {
            name: "notes",
            label: "Notes",
            options: {
                filter: false,
                // eslint-disable-next-line react/no-unstable-nested-components
                customBodyRender: (value, tableMeta) => {
                    if (data.status === "created") {
                        return (
                            <TextField
                                variant="standard"
                                required
                                multiline
                                onChange={handleNotesChange(tableMeta.currentTableData[tableMeta.rowIndex]?.data[1] || "")}
                                value={value}
                            />
                        );
                    }

                    return value;
                }
            }
        }
    ], [locationsListForSelectBox]);

    useEffect(() => {
        const newLocations = getLocations();
        setLocationsListForSelectBox(newLocations);
    }, [availableSeatsMap]);

    useImperativeHandle(ref, () => ({
        isUnSavedChangesPresent: () => showActionBtns
    }), [showActionBtns]);

    return (
        <Table
            data={tableData}
            columns={columns}
            title={getToolBarActions()}
            options={{
                elevation: 1,
                search: false,
                filter: false,
                selectableRows: "none",
                pagination: false,
                count: totalStudents || 0,
                tableBodyHeight: "calc(100vh - 265px)",
                downloadOptions: {
                    filename: `${data.name} Placement - Students List`
                },
                textLabels: {
                    body: {
                        noMatch: "No records found"
                    }
                },
                setTableProps: () => ({
                    // material ui v4 only
                    size: status === "created" ? "small" : "large"
                })
            }}
        />
    );
});

export default observer(PlacementStudentsTable);
