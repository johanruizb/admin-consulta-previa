/* eslint-disable jsx-a11y/anchor-is-valid */
import Box from "@mui/joy/Box";
import Grid from "@mui/material/Grid2";
import FormularioCursos from "./constants";

export default function FiltrarCursos() {
    return (
        <Box
            sx={{
                display: { xs: "none", sm: "initial" },
            }}
        >
            <Grid container spacing={1.25}>
                {FormularioCursos.map((slotProps, index) => {
                    const {
                        Component,
                        size = {
                            xs: 12,
                            md: 3,
                        },
                        ...inputProps
                    } = slotProps;

                    return Component ? (
                        <Grid key={index} size={size}>
                            <Component inputProps={inputProps} />
                        </Grid>
                    ) : null;
                })}
            </Grid>
        </Box>
    );
}
