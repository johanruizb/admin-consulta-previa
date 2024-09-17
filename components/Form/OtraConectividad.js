import { useFormContext, useWatch } from "react-hook-form";

import Grid from "@mui/material/Grid2";

import TextField from "../Field/TextField";

export default function OtraConectividad({ inputProps }) {
    const { control } = useFormContext();

    const conectividad = useWatch({
        control,
        name: "conectividad",
    });

    return (
        conectividad === "otra" && (
            <Grid size={{ xs: 12, md: 6 }}>
                <TextField inputProps={inputProps} />
            </Grid>
        )
    );
}
