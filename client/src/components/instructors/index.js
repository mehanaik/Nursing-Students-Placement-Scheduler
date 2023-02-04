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
import { INSTRUCTOR_IMPORT_REQUIRED_HEADERS } from "../utils";

function Instructors() {
    const { instructorStore } = useStore();
    const uploadFileRef = useRef(null);
    const navigate = useNavigate();

    const { list, totalCount, fetched } = instructorStore;

    const handleAddClick = useCallback(() => {
        navigate({ pathname: "add" });
    }, []);

    const handleImportClick = useCallback(() => {
        ShowDialog({
            title: "Import Hospitals",
            actionBtnName: "Import",
            content: <UploadFile
                ref={uploadFileRef}
                headers={INSTRUCTOR_IMPORT_REQUIRED_HEADERS}
            />,
            onConfirm: async () => {
                const fileData = await uploadFileRef.current.getFileData();
                if (fileData) {
                    try {
                        await instructorStore.import(fileData);
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
        const instructorList = toJS(instructorStore.list);
        navigate({
            pathname: "edit",
            search: createSearchParams({
                id: instructorList[index]._id
            }).toString()
        });
    }, []);

    const handleDeleteRow = useCallback((index) => {
        ShowConfirmDialog({
            title: "Delete Instructor",
            description: "Are you sure you want to delete this instructor?",
            actionBtnName: "Delete",
            onConfirm: async () => {
                try {
                    await instructorStore.delete(index);
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
            title: "Delete Instructors",
            description: `Are you sure you want to delete these ${selectedRows.length} instructor(s)?`,
            actionBtnName: "Delete",
            onConfirm: async () => {
                try {
                    await instructorStore.deleteMultiple(selectedRows);
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
            name: "fname", label: "First Name"
        },
        {
            name: "lname", label: "Last Name"
        },
        {
            name: "email", label: "Email Address"
        },
        {
            name: "comments", label: "Comments"
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
                await instructorStore.fetchAll();
            }
        };

        fetchAll();
    }, []);

    return (
        <Box>
            <Table
                key={`${Date.now()}`}
                data={toJS(list)}
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
                        filename: "Instructors"
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

export default observer(Instructors);
