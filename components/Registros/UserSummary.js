import { Card, CardContent, Typography } from "@mui/joy";
import Grid from "@mui/material/Grid2";
import Stack from "@mui/material/Stack";
import useSWR from "swr";
import { formatNumber } from "../utils";

export default function UserSummary() {
    const { data } = useSWR("/api/usuarios/summary");

    return (
        <Grid container spacing={1.25 / 2}>
            <Grid
                size={{
                    xs: 12,
                    md: 3,
                }}
            >
                <Card variant="outlined">
                    <CardContent>
                        <Typography level="title-md">
                            Curso - Sociedad civil
                        </Typography>
                        <Stack>
                            <Stack
                                direction="row"
                                alignItems="center"
                                justifyContent="space-between"
                                // spacing={1.25}
                            >
                                <Typography level="body-md">
                                    Registrados
                                </Typography>
                                <Typography level="h3">
                                    {formatNumber(
                                        data?.cursos.sociedad_civil.registrados
                                    )}
                                </Typography>
                            </Stack>
                            <Stack
                                direction="row"
                                alignItems="center"
                                justifyContent="space-between"
                                // spacing={1.25}
                            >
                                <Typography level="body-md">
                                    Validados
                                </Typography>
                                <Typography level="h3">
                                    {formatNumber(
                                        data?.cursos.sociedad_civil.validados
                                    )}
                                </Typography>
                            </Stack>
                        </Stack>
                    </CardContent>
                </Card>
            </Grid>
            <Grid
                size={{
                    xs: 12,
                    md: 3,
                }}
            >
                <Card variant="outlined">
                    <CardContent>
                        <Typography level="title-md">
                            Curso - Funcionarios
                        </Typography>
                        <Stack>
                            <Stack
                                direction="row"
                                alignItems="center"
                                justifyContent="space-between"
                                // spacing={1.25}
                            >
                                <Typography level="body-md">
                                    Registrados
                                </Typography>
                                <Typography level="h3">
                                    {formatNumber(
                                        data?.cursos.funcionarios.registrados
                                    )}
                                </Typography>
                            </Stack>
                            <Stack
                                direction="row"
                                alignItems="center"
                                justifyContent="space-between"
                                // spacing={1.25}
                            >
                                <Typography level="body-md">
                                    Validados
                                </Typography>
                                <Typography level="h3">
                                    {formatNumber(
                                        data?.cursos.funcionarios.validados
                                    )}
                                </Typography>
                            </Stack>
                        </Stack>
                    </CardContent>
                </Card>
            </Grid>
            <Grid
                size={{
                    xs: 12,
                    md: 3,
                }}
            >
                <Card variant="outlined">
                    <CardContent>
                        <Typography level="title-md">
                            Diplomado - Sociedad civil
                        </Typography>
                        <Stack>
                            <Stack
                                direction="row"
                                alignItems="center"
                                justifyContent="space-between"
                                // spacing={1.25}
                            >
                                <Typography level="body-md">
                                    Registrados
                                </Typography>
                                <Typography level="h3">
                                    {formatNumber(
                                        data?.diplomados.sociedad_civil
                                            .registrados
                                    )}
                                </Typography>
                            </Stack>
                            <Stack
                                direction="row"
                                alignItems="center"
                                justifyContent="space-between"
                                // spacing={1.25}
                            >
                                <Typography level="body-md">
                                    Validados
                                </Typography>
                                <Typography level="h3">
                                    {formatNumber(
                                        data?.diplomados.sociedad_civil
                                            .validados
                                    )}
                                </Typography>
                            </Stack>
                        </Stack>
                    </CardContent>
                </Card>
            </Grid>
            <Grid
                size={{
                    xs: 12,
                    md: 3,
                }}
            >
                <Card variant="outlined">
                    <CardContent>
                        <Typography level="title-md">
                            Diplomado - Funcionarios
                        </Typography>
                        <Stack>
                            <Stack
                                direction="row"
                                alignItems="center"
                                justifyContent="space-between"
                                // spacing={1.25}
                            >
                                <Typography level="body-md">
                                    Registrados
                                </Typography>
                                <Typography level="h3">
                                    {formatNumber(
                                        data?.diplomados.funcionarios
                                            .registrados
                                    )}
                                </Typography>
                            </Stack>
                            <Stack
                                direction="row"
                                alignItems="center"
                                justifyContent="space-between"
                                // spacing={1.25}
                            >
                                <Typography level="body-md">
                                    Validados
                                </Typography>
                                <Typography level="h3">
                                    {formatNumber(
                                        data?.diplomados.funcionarios.validados
                                    )}
                                </Typography>
                            </Stack>
                        </Stack>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
}
