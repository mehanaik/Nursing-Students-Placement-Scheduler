import React, { forwardRef } from "react";
import Slide from "@mui/material/Slide";

export const SlideTransition = forwardRef((props, ref) => (
    <Slide
        ref={ref}
        {...props}
        direction="up"
    />
));
