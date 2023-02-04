import React, {
    forwardRef, useCallback, useImperativeHandle, useState
} from "react";
import MUITextField from "@mui/material/TextField";
import { debounce } from "@mui/material";

const TextField = forwardRef((props, ref) => {
    const [value, setValue] = useState(props.value || "");
    const [errorMsg, setErrorMsg] = useState(null);

    const handleBlur = useCallback(() => {
        setErrorMsg(null);
        if (props.onBlur) {
            props.onBlur();
        }
    }, []);

    const handleOnChange = debounce((newVal) => {
        if (props.onChange) {
            props.onChange(newVal);
        }
    }, 300);

    const handleChange = useCallback((event) => {
        const newValue = event.target.value;
        setValue(newValue);
        handleOnChange(newValue);
    }, [value]);

    useImperativeHandle(ref, () => ({
        value: () => String(value).trim(),
        setError: (msg) => setErrorMsg(msg),
        setValue: (val) => setValue(val)
    }));

    return (
        <MUITextField
            {...props}
            ref={ref}
            value={value}
            onChange={handleChange}
            error={errorMsg !== null}
            helperText={errorMsg || ""}
            onBlur={handleBlur}
        />
    );
});

TextField.defaultProps = {
    margin: "normal",
    variant: "outlined",
    fullWidth: true
};

export default TextField;
