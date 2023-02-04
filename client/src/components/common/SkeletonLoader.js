import React from "react";
import Skeleton from "@mui/material/Skeleton";

export default function SkeletonLoader() {
    return Array.from(Array(5)).map((_, i) => (
        <Skeleton
            key={`loading_${i}`}
            variant="text"
            sx={{ fontSize: "1rem", m: 1, width: "50%" }}
        />
    ));
}
