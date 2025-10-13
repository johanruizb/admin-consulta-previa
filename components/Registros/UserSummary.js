import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import Typography from "@mui/joy/Typography";
import Grid from "@mui/material/Grid";
import useSWR from "swr";
import { useCiclo } from "@/contexts/CicloContext";
import { formatNumber, getURL } from "../utils";
import { Fragment } from "react";
import { Stack } from "@mui/material";
import { Tooltip } from "@mui/joy";

export default function UserSummary({ slotProps }) {
    const { selectedCicloId } = useCiclo();

    const { data } = useSWR(
        getURL(`/api/usuarios/summary?ciclo_id=${selectedCicloId}`)
    );

    const { root, content, item } = slotProps || {};

    // Función para renderizar las tarjetas de cursos
    const renderCourseCards = (courses, type) => {
        if (!courses || courses.length === 0) return null;

        // Calcular el tamaño por defecto si no se proporciona itemSize
        const defaultSize = {
            xs: 12,
            md: courses.length >= 4 ? 3 : 12 / courses.length,
        };

        return courses.map((course) => (
            <Grid
                key={`${type}-${course.id}`}
                size={defaultSize}
                direction="row"
                {...(item || {})}
            >
                <Card variant="outlined">
                    <CardContent
                        sx={{
                            ...(content?.sx || {}),
                        }}
                    >
                        <Typography level="title-md">
                            {course.shortname}
                        </Typography>
                        <Stack direction="row" spacing={1}>
                            <Tooltip title="Registrados" arrow>
                                <Typography
                                    level="body-lg"
                                    // color="primary"
                                    fontWeight="bold"
                                >
                                    {formatNumber(course.registrados)}
                                </Typography>
                            </Tooltip>
                            <Typography level="body-lg">/</Typography>
                            <Tooltip title="Validados" arrow>
                                <Typography
                                    level="body-lg"
                                    // color="success"
                                    fontWeight="bold"
                                >
                                    {formatNumber(course.validados)}
                                </Typography>
                            </Tooltip>
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
            {...(root || {})}
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
