import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Fragment, useState } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { green, grey } from "@mui/material/colors";
import { toDefaultDateFormat } from "../utils";

export default function StudentPlacementHistory({ placementsHistory, placementLocationsHistory }) {
    const [expanded, setExpanded] = useState(false);

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    return (
        <Box sx={{ p: 2 }}>
            {placementsHistory.length ? placementsHistory.map((placement, index) => {
                const location = placementLocationsHistory[index];
                const fields = {
                    "Placement Date": new Date(placement.updatedAt).toLocaleString(),
                    "Location Name": location.name,
                    "Location Campus": location.hospital.name,
                    "Location Instructor": `${location.instructor.fname} ${location.instructor.lname}`,
                    "Location Unit": location.unit,
                    "Location Section": location.section,
                    "Location Shift": location.shift
                };
                return (
                    <Accordion
                        key={`placement-accordion-${index}`}
                        expanded={expanded === index}
                        onChange={handleChange(index)}
                        square={false}
                    >
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                        >
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            color: grey[700]
                                        }}
                                    >
                                        Placement Name
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            ml: 1.5,
                                            color: green[800]
                                        }}
                                    >
                                        {placement.name}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </AccordionSummary>
                        <AccordionDetails sx={{ mt: -2 }}>
                            <Grid
                                container
                                spacing={2}
                                sx={{ pb: 1 }}
                            >
                                {Object.keys(fields).map((key, i) => (
                                    <Fragment key={`location-info-${i}`}>
                                        <Grid item xs={6}>
                                            <Typography sx={{ color: "text.secondary" }}>
                                                {key}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography sx={{}}>
                                                {fields[key]}
                                            </Typography>
                                        </Grid>
                                    </Fragment>
                                ))}

                            </Grid>
                        </AccordionDetails>
                    </Accordion>
                );
            }) : (
                <em>No previous placements found for this student</em>
            )}
        </Box>
    );
}
