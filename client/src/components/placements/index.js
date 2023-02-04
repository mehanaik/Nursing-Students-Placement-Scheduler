import React, {
    useCallback, useEffect, useMemo, useRef
} from "react";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import Box from "@mui/material/Box";
import { observer } from "mobx-react";
import { toJS } from "mobx";
import Tooltip from "@mui/material/Tooltip";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { createSearchParams, useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import { useStore } from "../../store";
import Table from "../common/Table";
import ShowConfirmDialog from "../common/ConfirmDialog";
import ShowSnackbarAlert, { ShowErrorAlert } from "../common/SnackBarAlert";

function Placements() {
    const { placementStore } = useStore();
    const tableInstanceRef = useRef(null);
    const navigate = useNavigate();

    const { list, totalCount, fetched } = placementStore;

    const tableData = useMemo(() => toJS(list), [list, fetched]);

    const handleAddClick = useCallback(() => {
        navigate({ pathname: "add" });
    }, []);

    const handleEditRow = useCallback((index) => {
        const locationsList = toJS(placementStore.list);
        navigate({
            pathname: "edit",
            search: createSearchParams({
                id: locationsList[index]._id
            }).toString()
        });
    }, []);

    const handleDeleteRow = useCallback((index) => {
        if (tableData[index].status === "confirmed") {
            ShowErrorAlert("You can delete a confirmed placement");
            return;
        }

        ShowConfirmDialog({
            title: "Delete Placement",
            description: "Are you sure you want to delete this placement?",
            actionBtnName: "Delete",
            onConfirm: async () => {
                try {
                    await placementStore.delete(index);
                    ShowSnackbarAlert({
                        message: "Deleted successfully"
                    });
                } catch (err) {
                    ShowSnackbarAlert({
                        message: err?.response?.data || err.message, severity: "error"

                    });
                }
            }
        });
    }, [tableData]);

    const getToolBarActions = useCallback(() => (
        <Box>
            <Button
                startIcon={<AddIcon />}
                onClick={handleAddClick}
            >
                Create
            </Button>
        </Box>
    ), []);

    const columns = useMemo(() => [
        { name: "name", label: "Placement Name" },
        // { name: "term", label: "Student Term" },
        // { name: "year", label: "Student Year" },
        { name: "totalStudents", label: "Total Students" },
        { name: "totalLocations", label: "Total Locations" },
        { name: "totalSeats", label: "Total Seats" },
        { name: "lastUpdatedAt", label: "Last updated at" },
        { name: "statusText", label: "Status" },
        {
            name: "",
            options: {
                viewColumns: false,
                setCellProps: () => ({ style: { width: "100px" } }),
                // eslint-disable-next-line react/no-unstable-nested-components
                customBodyRender: (value, tableMeta) => (
                    <Box sx={{ display: "flex", gap: "1rem" }}>
                        <Tooltip
                            title="View"
                            arrow
                            placement="bottom"
                        >
                            <VisibilityIcon
                                color="action"
                                className="actionIcon"
                                fontSize="small"
                                sx={{ cursor: "pointer" }}
                                onClick={() => handleEditRow(tableMeta.rowIndex)}
                            />
                        </Tooltip>
                        {tableData[tableMeta.rowIndex].status !== "confirmed"
                            ? (
                                <Tooltip
                                    title="Delete"
                                    arrow
                                    placement="bottom"
                                >
                                    <DeleteIcon
                                        color="error"
                                        className="actionIcon"
                                        fontSize="small"
                                        sx={{ cursor: "pointer" }}
                                        onClick={() => handleDeleteRow(tableMeta.rowIndex)}
                                    />
                                </Tooltip>
                            ) : ""}
                    </Box>
                )
            }
        }
    ], [tableData]);

    useEffect(() => {
        const fetchAll = async () => {
            if (!fetched) {
                await placementStore.fetchAll();
            }
        };

        fetchAll();
    }, []);

    return (
        <Box className="table-container">
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
                    selectableRows: "none",
                    downloadOptions: {
                        filename: "Placements"
                    },
                    textLabels: {
                        body: {
                            noMatch: !fetched ? "Fetching..." : "No records found"
                        }
                    },
                    onRowClick: (data, tableMeta) => {
                        navigate(`/placements/${tableData[tableMeta.rowIndex]._id}`);
                    }
                }}
            />
        </Box>
    );
}

export default observer(Placements);
