import {
    useState, useCallback, forwardRef, useImperativeHandle, useMemo, useEffect
} from "react";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import FormHelperText from "@mui/material/FormHelperText";

const SelectBox = forwardRef((props, ref) => {
    const [selected, setSelected] = useState(props.selected || "");
    const [errorMsg, setErrorMsg] = useState(null);

    const id = useMemo(() => props.id || `${Date.now()}`, []);

    const handleChange = useCallback((event) => {
        setErrorMsg(null);

        const { value } = event.target;

        if (props.onChange) {
            props.onChange(value);
        } else {
            setSelected(value);
        }
    }, []);

    useImperativeHandle(ref, () => ({
        getSelectedValue: () => selected,
        setError: (msg) => setErrorMsg(msg)
    }));

    useEffect(() => {
        setSelected(props.selected);
    }, [props.selected]);

    function renderOptions() {
        const options = props.options || [];

        if (!options.length) {
            return (
                <em style={{ marginLeft: 10 }}>No records found</em>
            );
        }

        return options.map((option) => {
            if (typeof option === "string") {
                return (
                    <MenuItem
                        key={`selectOption_${option}`}
                        value={option}
                    >
                        {option}
                    </MenuItem>
                );
            }

            return (
                <MenuItem
                    key={`selectOption_${option.value}`}
                    value={option.value}
                >
                    {option.otherName || option.name}
                </MenuItem>
            );
        });
    }

    return (
        <FormControl
            fullWidth
            disabled={props.disabled || false}
            error={errorMsg !== null}
            required={props.required || false}
            size={props.size || ""}
        >
            <InputLabel
                id={`${id}-select-label`}
                required={props.required || false}
            >
                {props.label}
            </InputLabel>
            <Select
                id={`${id}-select`}
                labelId={`${id}-select-label`}
                value={selected}
                label={props.label}
                onChange={handleChange}
                variant={props.variant || "outlined"}
                sx={props.sx || {}}
                displayEmpty
                renderValue={(newSelected) => {
                    const selectedOption = (props.options || []).find((option) => option.value === newSelected);
                    return selectedOption?.name || selectedOption?.otherName || newSelected;
                }}
            >
                {renderOptions()}
            </Select>
            {errorMsg ? <FormHelperText>{errorMsg}</FormHelperText> : ""}
        </FormControl>
    );
});

export default SelectBox;
