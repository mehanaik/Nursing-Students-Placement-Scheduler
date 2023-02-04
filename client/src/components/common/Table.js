import React, { forwardRef } from "react";
import MUIDataTable from "mui-datatables";

const Table = forwardRef(({ options = {}, ...otherProps }, ref) => (
    <MUIDataTable
        ref={ref}
        options={{
            tableBodyHeight: "calc(100vh - 180px)",
            rowsPerPage: 50,
            rowsPerPageOptions: [50],
            print: false,
            textLabels: {
                body: {
                    noMatch: "No records found"
                }
            },
            ...options
        }}
        {...otherProps}
    />
));

export default Table;
