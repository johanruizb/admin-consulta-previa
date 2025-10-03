import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import Typography from "@mui/joy/Typography";
import Grid from "@mui/material/Grid2";
import Stack from "@mui/material/Stack";
import useSWR from "swr";
import { useCiclo } from "@/contexts/CicloContext";
import { formatNumber, getURL } from "../utils";
import { Fragment } from "react";

export default function UserSummary() {
    const { selectedCicloId } = useCiclo();

    const { data } = useSWR(
        getURL(`/api/usuarios/summary?ciclo_id=${selectedCicloId}`)
    );

    // Función para renderizar las tarjetas de cursos
    const renderCourseCards = (courses, type) => {
        if (!courses || courses.length === 0) return null;

        return courses.map((course) => (
            <Grid
                key={`${type}-${course.id}`}
                size={{
                    xs: 12,
                    md: courses.length >= 4 ? 3 : 12 / courses.length,
                }}
            >
                <Card variant="outlined">
                    <CardContent>
                        <Typography level="title-md">
                            {course.shortname}
                        </Typography>
                        <Stack>
                            <Stack
                                direction="row"
                                alignItems="center"
                                justifyContent="space-between"
                            >
                                <Typography level="body-md">
                                    Registrados
                                </Typography>
                                <Typography level="h3">
                                    {formatNumber(course.registrados)}
                                </Typography>
                            </Stack>
                            <Stack
                                direction="row"
                                alignItems="center"
                                justifyContent="space-between"
                            >
                                <Typography level="body-md">
                                    Validados
                                </Typography>
                                <Typography level="h3">
                                    {formatNumber(course.validados)}
                                </Typography>
                            </Stack>
                        </Stack>
                    </CardContent>
                </Card>
            </Grid>
        ));
    };

    // Combinar cursos y diplomados para renderizar todo junto
    const allCourses = [...(data?.cursos || []), ...(data?.diplomados || [])];

    return (
        <Grid
            container
            spacing={1.25 / 2}
            sx={{
                height: "100%",
            }}
        >
            {allCourses.length > 0 ? (
                renderCourseCards(allCourses, "all")
            ) : (
                <Fragment>
                    <Grid
                        size={{
                            md: 6,
                            xs: 0,
                        }}
                    >
                        <span />
                    </Grid>
                    <Grid
                        size={{
                            md: 6,
                            xs: 12,
                        }}
                        sx={{
                            height: "100%",
                        }}
                    >
                        <Card
                            variant="outlined"
                            sx={{
                                height: "100%",
                            }}
                        >
                            <CardContent
                                sx={{
                                    height: "100%",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                            >
                                <Typography level="body-md" textAlign="center">
                                    No hay cursos disponibles para el ciclo
                                    seleccionado
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Fragment>
            )}
        </Grid>
    );
}
