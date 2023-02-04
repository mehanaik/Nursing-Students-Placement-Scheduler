import { createTheme } from "@mui/material/styles";
import { purple, grey } from "@mui/material/colors";

export const Theme = createTheme({
    palette: {
        primary: {
            main: purple[500]
        },
        secondary: {
        // This is green.A700 as hex.
            main: "#11cb5f"
        },
        grey: {
            main: grey[500]
        }
    },
    typography: {
        fontFamily: "\"Lato\"",
        fontSize: 14,
        fontWeightLight: 300,
        fontWeightRegular: 400,
        fontWeightMedium: 600
    }
});
