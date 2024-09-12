import Grid from "@mui/material/Grid2";
import { Fragment } from "react";

export default function EmptyField() {
    return (
        <Grid
            size={{
                md: 6,
            }}
            sx={{
                display: { xs: "none", md: "inline-block" },
            }}
        >
            <Fragment />
        </Grid>
    );
}
