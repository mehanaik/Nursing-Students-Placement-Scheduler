import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import {
    forwardRef, useCallback, useImperativeHandle, useState
} from "react";

const PlacementLocationsTable = forwardRef(({ rows, selectedRows = [] }, ref) => {
    const [selected, setSelected] = useState(selectedRows.reduce((obj, row) => {
        obj[row] = true;
        return obj;
    }, {}));

    const handleSelectAll = useCallback((event) => {
        const { checked } = event.target;
        if (checked) {
            const newSelected = rows.reduce((obj, row) => {
                obj[row._id] = true;
                return obj;
            }, {});
            setSelected(newSelected);
        } else {
            setSelected({});
        }
    }, [rows]);

    const handleSelect = useCallback((event, row) => {
        const { checked } = event.target;
        const newSelected = { ...selected };
        if (checked) {
            newSelected[row._id] = true;
        } else {
            delete newSelected[row._id];
        }
        setSelected(newSelected);
    }, [selected]);

    useImperativeHandle(ref, () => ({
        getSelected: () => Object.keys(selected)
    }), [selected]);

    const numSelected = Object.keys(selected).length;
    const rowCount = rows.length;

    return (
        <TableContainer component={Paper} sx={{ width: "80%", maxHeight: 500, overflowY: "auto" }}>
            <Table stickyHeader sx={{ width: "98%" }}>
                <TableHead>
                    <TableRow>
                        <TableCell padding="checkbox">
                            <Checkbox
                                color="primary"
                                indeterminate={numSelected > 0 && numSelected < rowCount}
                                checked={rowCount > 0 && numSelected === rowCount}
                                onClick={handleSelectAll}
                            />
                        </TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Campus</TableCell>
                        <TableCell>Instructor</TableCell>
                        <TableCell>Unit</TableCell>
                        <TableCell>Section</TableCell>
                        <TableCell>Day</TableCell>
                        <TableCell>Shift</TableCell>
                        <TableCell align="right">Seats</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.length ? rows.map((row) => (
                        <TableRow
                            key={row._id}
                            sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                        >
                            <TableCell padding="checkbox">
                                <Checkbox
                                    color="primary"
                                    checked={selected[row._id] || false}
                                    onChange={(e) => handleSelect(e, row)}
                                />
                            </TableCell>
                            <TableCell>{row.name}</TableCell>
                            <TableCell>{row.hospital}</TableCell>
                            <TableCell>{row.instructor}</TableCell>
                            <TableCell>{row.unit}</TableCell>
                            <TableCell>{row.section}</TableCell>
                            <TableCell>{row.day}</TableCell>
                            <TableCell>{row.shift}</TableCell>
                            <TableCell align="right">{row.seats}</TableCell>
                        </TableRow>
                    )) : <TableRow key="noResult"><TableCell align="center" colSpan={9}><em>No locations found!</em></TableCell></TableRow>}
                </TableBody>
            </Table>
        </TableContainer>
    );
});

export default PlacementLocationsTable;
