import { useFormContext, useWatch } from "react-hook-form";

import Grid from "@mui/material/Grid2";

import TextField from "../Field/TextField";

export default function OtroGenero({ inputProps }) {
    const { control } = useFormContext();

    const genero = useWatch({
        control,
        name: "genero",
    });

    return (
        genero === 0 && (
            <Grid size={{ xs: 12, md: 6 }}>
                <TextField inputProps={inputProps} />
            </Grid>
        )
    );
}
