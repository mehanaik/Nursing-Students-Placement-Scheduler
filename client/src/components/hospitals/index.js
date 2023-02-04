import React, {
    useCallback, useEffect, useMemo, useRef, useState
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
import Stack from "@mui/material/Stack";
import { useStore } from "../../store";
import Table from "../common/Table";
import ShowConfirmDialog from "../common/ConfirmDialog";
import ShowSnackbarAlert, { ShowErrorAlert, ShowSuccessAlert } from "../common/SnackBarAlert";
import ShowDialog from "../common/Dialog";
import UploadFile from "../common/UploadFile";
import { HOSPITAL_IMPORT_REQUIRED_HEADERS } from "../utils";

function Hospitals() {
    const { hospitalStore } = useStore();
    const uploadFileRef = useRef(null);
    const navigate = useNavigate();

    const { list, totalCount, fetched } = hospitalStore;

    const handleAddClick = useCallback(() => {
        navigate({ pathname: "add" });
    }, []);

    const handleImportClick = useCallback(() => {
        ShowDialog({
            title: "Import Hospitals",
            actionBtnName: "Import",
            content: <UploadFile
                ref={uploadFileRef}
                headers={HOSPITAL_IMPORT_REQUIRED_HEADERS}
            />,
            onConfirm: async () => {
                const fileData = await uploadFileRef.current.getFileData();
                if (fileData) {
                    try {
                        await hospitalStore.import(fileData);
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
        const hospitalList = toJS(hospitalStore.list);
        navigate({
            pathname: "edit",
            search: createSearchParams({
                id: hospitalList[index]._id
            }).toString()
        });
    }, []);

    const handleDeleteRow = useCallback((index) => {
        ShowConfirmDialog({
            title: "Delete Hospital",
            description: "Are you sure you want to delete this hospital?",
            actionBtnName: "Delete",
            onConfirm: async () => {
                try {
                    await hospitalStore.delete(index);
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
            title: "Delete Hospitals",
            description: `Are you sure you want to delete these ${selectedRows.length} hospital(s)?`,
            actionBtnName: "Delete",
            onConfirm: async () => {
                try {
                    await hospitalStore.deleteMultiple(selectedRows);
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
        <Stack direction="row" spacing={1}>
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
        </Stack>
    ), []);

    const columns = useMemo(() => [
        {
            name: "name", label: "Name"
        },
        {
            name: "campus", label: "Campus"
        },
        {
            name: "address", label: "Address"
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
        const fetchHospitals = async () => {
            if (!fetched) {
                await hospitalStore.fetchAll();
            }
        };

        fetchHospitals();
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
                        filename: "Hospitals"
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

export default observer(Hospitals);
