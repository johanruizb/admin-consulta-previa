import { formatNumber } from "@/components/utils";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import Typography from "@mui/joy/Typography";
import Grid from "@mui/material/Grid2";
import Stack from "@mui/material/Stack";
import useSWR from "swr";

export default function EsperaSummary() {
    const { data } = useSWR("/api/usuarios/espera/summary");

    return (
        <Grid
            container
            spacing={1.25 / 2}
            sx={{
                flex: 1,
                justifyContent: "flex-end",
            }}
        >
            <Grid
                size={{
                    xs: 12,
                    md: 3,
                }}
            >
                <Card variant="outlined">
                    <CardContent>
                        <Typography level="title-md">
                            Personas en espera
                        </Typography>
                        <Stack>
                            <Stack
                                direction="row"
                                alignItems="center"
                                justifyContent="space-between"
                                // spacing={1.25}
                            >
                                <Typography level="body-md">
                                    Registrados hoy
                                </Typography>
                                <Typography level="h3">
                                    {formatNumber(data?.today)}
                                </Typography>
                            </Stack>
                            <Stack
                                direction="row"
                                alignItems="center"
                                justifyContent="space-between"
                                // spacing={1.25}
                            >
                                <Typography level="body-md">
                                    Registrados en total
                                </Typography>
                                <Typography level="h3">
                                    {formatNumber(data?.total)}
                                </Typography>
                            </Stack>
                        </Stack>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
}
