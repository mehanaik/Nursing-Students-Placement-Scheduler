import {
    useState, useCallback, useEffect, forwardRef, useImperativeHandle
} from "react";
import MUICheckbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";

const Checkbox = forwardRef((props, ref) => {
    const [checked, setChecked] = useState(props.checked || false);

    const handleChange = useCallback((event) => {
        setChecked(event.target.checked);
    }, []);

    useImperativeHandle(ref, () => ({
        isChecked: () => checked
    }));
    useEffect(() => {
        if (props.onChange) {
            props.onChange(checked);
        }
    }, [checked]);

    return (
        <FormControlLabel
            control={(
                <MUICheckbox
                    {...props}
                    checked={checked}
                    onChange={handleChange}
                />
)}
            label={props.label}
        />
    );
});

export default Checkbox;
