import React, {
    forwardRef, useCallback, useImperativeHandle, useState
} from "react";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import MUIDateTimePicker from "@mui/lab/DateTimePicker";
import TextField from "./TextField";

const DateTimePicker = forwardRef((props, ref) => {
    const [open, setOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState(props.selected || new Date());

    const handleTextFieldClick = useCallback((event) => {
        event.stopPropagation();
        setOpen(true);
    }, []);

    useImperativeHandle(ref, () => ({
        getSelectedDate: () => selectedDate || null
    }));

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <MUIDateTimePicker
                open={open}
                label={props.label}
                value={selectedDate}
                onChange={(newValue) => setSelectedDate(newValue)}
                maxDateTime={new Date()}
                clearable
                showTodayButton
                onClose={() => setOpen(false)}
                renderInput={(inputProps) => (
                    <TextField
                        onClick={handleTextFieldClick}
                        {...inputProps}
                    />
                )}
                PopperProps={{ placement: "top-start" }}
                DialogProps={{ fullWidth: false, maxWidth: "xs" }}
                {...props}
            />
        </LocalizationProvider>
    );
});

export default DateTimePicker;
