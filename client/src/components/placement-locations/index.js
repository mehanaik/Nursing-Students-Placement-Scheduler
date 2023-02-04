import React, {
    useCallback, useEffect, useMemo, useRef
} from "react";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import Box from "@mui/material/Box";
import { observer } from "mobx-react";
import { toJS } from "mobx";
import Tooltip from "@mui/material/Tooltip";
import EditIcon from "@mui/icons-material/EditRounded";
import { createSearchParams, useNavigate } from "react-router-dom";
import UploadIcon from "@mui/icons-material/Upload";
import { useStore } from "../../store";
import Table from "../common/Table";
import ShowConfirmDialog from "../common/ConfirmDialog";
import ShowSnackbarAlert, { ShowErrorAlert, ShowSuccessAlert } from "../common/SnackBarAlert";
import ShowDialog from "../common/Dialog";
import UploadFile from "../common/UploadFile";
import { PLACEMENT_LOCATIONS_REQUIRED_HEADERS } from "../utils";

function PlacementLocations() {
    const { placementLocationStore } = useStore();
    const tableInstanceRef = useRef(null);
    const uploadFileRef = useRef(null);
    const navigate = useNavigate();

    const { list, totalCount, fetched } = placementLocationStore;

    const handleAddClick = useCallback(() => {
        navigate({ pathname: "add" });
    }, []);

    const handleImportClick = useCallback(() => {
        ShowDialog({
            title: "Import Hospitals",
            actionBtnName: "Import",
            content: <UploadFile
                ref={uploadFileRef}
                headers={PLACEMENT_LOCATIONS_REQUIRED_HEADERS}
            />,
            onConfirm: async () => {
                const fileData = await uploadFileRef.current.getFileData();
                if (fileData) {
                    try {
                        await placementLocationStore.import(fileData);
                        ShowSuccessAlert("Imported successfully");
                    } catch (err) {
                        ShowErrorAlert(err.message);
                    }
                } else {
                    ShowErrorAlert("Please select the file", 3000);
                }
            }
        });
    }, []);

    const handleEditRow = useCallback((index) => {
        const locationsList = toJS(placementLocationStore.list);
        navigate({
            pathname: "edit",
            search: createSearchParams({
                id: locationsList[index]._id
            }).toString()
        });
    }, []);

    const handleDeleteRow = useCallback((index) => {
        ShowConfirmDialog({
            title: "Delete Placement Location",
            description: "Are you sure you want to delete this placement location?",
            actionBtnName: "Delete",
            onConfirm: async () => {
                try {
                    await placementLocationStore.delete(index);
                    ShowSnackbarAlert({
                        message: "Deleted successfully"
                    });
                } catch (err) {
                    ShowSnackbarAlert({
                        message: err.message, severity: "error"

                    });
                }
            }
        });
    }, []);

    const handleDeleteSelectedRows = useCallback((selectedRows) => {
        ShowConfirmDialog({
            title: "Delete Placement Locations",
            description: `Are you sure you want to delete these ${selectedRows.length} placement locations(s)?`,
            actionBtnName: "Delete",
            onConfirm: async () => {
                try {
                    await placementLocationStore.deleteMultiple(selectedRows);
                    ShowSnackbarAlert({
                        message: "Deleted successfully"
                    });
                } catch (err) {
                    ShowSnackbarAlert({
                        message: err.message, severity: "error"

                    });
                }
            }
        });
    }, []);

    const getToolBarActions = useCallback(() => (
        <Box>
            <Button
                startIcon={<AddIcon />}
                onClick={handleAddClick}
            >
                Add
            </Button>
            <Button
                startIcon={<UploadIcon />}
                onClick={handleImportClick}
            >
                Import
            </Button>
        </Box>
    ), []);

    const columns = useMemo(() => [
        {
            name: "name", label: "Name"
        },
        {
            name: "hospital",
            label: "Campus"
            // options: {
            //     // eslint-disable-next-line react/no-unstable-nested-components
            //     customBodyRender: (value) => {
            //         if (value) {
            //             return value.campus;
            //             // (
            //             //     <div>
            //             //         {`${value.name}, ${value.campus}`}
            //             //         <br />
            //             //         {`${value.address}`}
            //             //     </div>
            //             // );
            //         }

            //         return "";
            //     }
            // }
        },
        {
            name: "instructor",
            label: "Instructor"
            // options: {
            //     // eslint-disable-next-line react/no-unstable-nested-components
            //     customBodyRender: (value) => {
            //         if (value) {
            //             return `${value.fname} ${value.lname}`;
            //             // return (
            //             //     <div>
            //             //         {`${value.fname} ${value.lname}, ${value.number}`}
            //             //         <br />
            //             //         {`${value.email}`}
            //             //     </div>
            //             // );
            //         }

            //         return "";
            //     }
            // }
        },
        {
            name: "unit", label: "Unit"
        },
        {
            name: "section", label: "Section"
        },
        {
            name: "day", label: "Day"
        },
        {
            name: "shift", label: "Shift"
        },
        {
            name: "seats", label: "Seats"
        },
        {
            name: "",
            options: {
                viewColumns: false,
                setCellProps: () => ({ style: { width: "100px" } }),
                // eslint-disable-next-line react/no-unstable-nested-components
                customBodyRender: (value, tableMeta) => (
                    <Box sx={{ display: "flex", gap: "1rem" }}>
                        <Tooltip
                            title="Edit"
                            arrow
                            placement="left"
                        >
                            <EditIcon
                                color="action"
                                className="actionIcon"
                                fontSize="small"
                                sx={{ cursor: "pointer" }}
                                onClick={() => handleEditRow(tableMeta.rowIndex)}
                            />
                        </Tooltip>
                        <Tooltip
                            title="Delete"
                            arrow
                            placement="right"
                        >
                            <DeleteIcon
                                color="error"
                                className="actionIcon"
                                fontSize="small"
                                sx={{ cursor: "pointer" }}
                                onClick={() => handleDeleteRow(tableMeta.rowIndex)}
                            />
                        </Tooltip>
                    </Box>
                )
            }
        }
    ], []);

    useEffect(() => {
        const fetchAll = async () => {
            if (!fetched) {
                await placementLocationStore.fetchAll();
            }
        };

        fetchAll();
    }, []);

    const tableData = toJS(list).map((obj) => ({
        ...obj,
        hospital: obj.hospital.campus,
        instructor: `${obj.instructor.fname} ${obj.instructor.lname}`
    }));

    return (
        <Box>
            <Table
                key={`${Date.now()}`}
                ref={tableInstanceRef}
                data={tableData}
                columns={columns}
                title={getToolBarActions()}
                options={{
                    viewColumns: false,
                    search: false,
                    filter: false,
                    count: totalCount,
                    onRowsDelete: ({ data }) => {
                        const indexes = data.map((obj) => obj.index);
                        handleDeleteSelectedRows(indexes);
                        return false;
                    },
                    downloadOptions: {
                        filename: "Placement Locations"
                    },
                    textLabels: {
                        body: {
                            noMatch: !fetched ? "Fetching..." : "No records found"
                        }
                    }
                }}
            />
        </Box>
    );
}

export default observer(PlacementLocations);
