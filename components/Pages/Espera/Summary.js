import { formatNumber } from "@/components/utils";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import Typography from "@mui/joy/Typography";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import useSWR from "swr";

export default function EsperaSummary() {
    const { data } = useSWR("/api/usuarios/espera/summary");

    return (
        <Grid
            container
            sx={{
                flex: 1,
                justifyContent: "flex-end",
            }}
        >
            <Grid
                size={{
                    xs: 12,
                    md: "auto",
                }}
            >
                <Card variant="outlined">
                    <CardContent>
                        <Stack>
                            <Stack
                                direction="row"
                                alignItems="center"
                                justifyContent="space-between"
                                spacing={2.25}
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
                                spacing={2.25}
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
