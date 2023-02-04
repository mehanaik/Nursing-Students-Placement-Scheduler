import React, {
    useState, useCallback, forwardRef
} from "react";
import MUILoadingButton from "@mui/lab/LoadingButton";

const LoadingButton = forwardRef((props, ref) => {
    const [loading, setLoading] = useState(false);

    const handleClick = useCallback(async () => {
        try {
            setLoading(true);
            await props.onClick();
            setLoading(false);
        } catch (err) {
            setLoading(false);
        }
    }, []);

    return (
        <MUILoadingButton
            variant="contained"
            ref={ref}
            {...props}
            loading={loading}
            onClick={handleClick}
        >
            {props.label}
        </MUILoadingButton>
    );
});

export default LoadingButton;
