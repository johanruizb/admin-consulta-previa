import CicloSelector from "@/components/Ciclos/CicloSelector";
import fetcher from "@/components/fetcher";
import Layout from "@/components/Home/Layout";
import CustomPie from "@/components/Panel/CustomPie";
import InscripcionesPorPeriodo from "@/components/Panel/InscripcionesPorPeriodo";
import UserSummary from "@/components/Registros/UserSummary";
import { formatNumber, getURL } from "@/components/utils";
import { useCiclo } from "@/contexts/CicloContext";
import useClient from "@/hooks/useClient";
import getParams from "@/utils/params";
import { initializePreload } from "@/utils/preloadData";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import Box from "@mui/joy/Box";
import Breadcrumbs from "@mui/joy/Breadcrumbs";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import CircularProgress from "@mui/joy/CircularProgress";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Link from "@mui/joy/Link";
import Radio from "@mui/joy/Radio";
import RadioGroup from "@mui/joy/RadioGroup";
import Typography from "@mui/joy/Typography";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import { BarChart } from "@mui/x-charts/BarChart";
import { usePrevious } from "@uidotdev/usehooks";
import dayjs from "dayjs";
import "dayjs/locale/es";
import Head from "next/head";
import { useEffect, useEffectEvent, useState } from "react";
import useSWR from "swr";

dayjs.locale("es");

export default function Page() {
    const { selectedCicloId } = useCiclo();
    const [curso, setCurso] = useState();

    const { data, isLoading } = useSWR(
        selectedCicloId && curso
            ? getURL(
                  `api/usuarios/estadisticas?${getParams({
                      ciclo_id: selectedCicloId,
                      courses: Array.isArray(curso) ? curso : curso?.split(","),
                  })}`
              )
            : null,
        fetcher
    );

    const { data: cursos, isLoading: cursosIsLoading } = useSWR(
        selectedCicloId
            ? getURL(
                  `api/usuarios/cursos/disponibles?ciclo_id=${selectedCicloId}`
              )
            : null,
        fetcher
    );

    const [mounted, setMounted] = useState(false);

    useClient(() => setMounted(true));

    const handleCursoChange = (event) => {
        const value = event.target.value;
        let newCurso;

        // Si el valor es una cadena con comas, es el array de "Todos los cursos"
        if (typeof value === "string" && value.includes(",")) {
            newCurso = value.split(",").map((id) => parseInt(id));
        } else {
            // Es un ID individual de curso
            newCurso = [parseInt(value)];
        }

        setCurso(newCurso);
    };

    const prevCicloId = usePrevious(selectedCicloId);

    // Reiniciar selección de curso si cambia el ciclo
    const resetSelectedCurso = useEffectEvent(() => {
        setCurso(cursos?.map((c) => c.id));
    });

    useEffect(() => {
        if (selectedCicloId && selectedCicloId !== prevCicloId) {
            resetSelectedCurso();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedCicloId, prevCicloId, cursos]);

    if (!mounted) return null;

    const loading = isLoading || cursosIsLoading || !curso;

    return (
        <Layout>
            <Head>
                <title>Inicio - Consulta previa</title>
            </Head>
            <Box sx={{ display: "flex", alignItems: "center" }}>
                <Breadcrumbs
                    size="sm"
                    aria-label="breadcrumbs"
                    separator={<ChevronRightRoundedIcon fontSize="sm" />}
                    sx={{ pl: 0 }}
                >
                    <Link
                        underline="none"
                        color="neutral"
                        href="/"
                        aria-label="Home"
                    >
                        <HomeRoundedIcon />
                    </Link>
                </Breadcrumbs>
            </Box>
            <Box
                sx={{
                    display: "flex",
                    mb: 1,
                    gap: 1,
                    flexDirection: { xs: "column", sm: "row" },
                    alignItems: { xs: "start", sm: "center" },
                    flexWrap: "wrap",
                    justifyContent: "space-between",
                }}
            >
                <Stack
                    spacing={1.25 / 2}
                    direction={{ xs: "row", md: "column" }}
                    flex={{ xs: 1, md: "unset" }}
                    justifyContent={{ xs: "space-between", md: "normal" }}
                    sx={{
                        width: { xs: "100%", md: "unset" },
                    }}
                >
                    <Typography level="h2" component="h1">
                        Estadísticas
                    </Typography>
                    <CicloSelector />
                </Stack>
                <Box
                    sx={{
                        flex: { xs: 1, md: 0.5 },
                        maxWidth: { md: "calc(50% - 152.23px)" },
                        width: "100%",
                    }}
                >
                    <FormControl>
                        <FormLabel id="cursos-select-label">
                            Estadísticas por curso
                        </FormLabel>
                        {cursosIsLoading ? (
                            <CircularProgress />
                        ) : (
                            <RadioGroup
                                value={
                                    Array.isArray(curso) &&
                                    curso.length === cursos?.length
                                        ? cursos?.map((c) => c.id).join(",")
                                        : curso?.[0]?.toString() || ""
                                }
                                onChange={handleCursoChange}
                            >
                                <Radio
                                    value={cursos?.map((c) => c.id).join(",")}
                                    label="Todos los cursos"
                                />
                                {cursos?.map((item) => (
                                    <Radio
                                        key={item.id}
                                        value={item.id.toString()}
                                        label={item.shortname}
                                    />
                                ))}
                                {cursos?.length === 0 && (
                                    <Typography level="body-sm">
                                        No hay cursos disponibles
                                    </Typography>
                                )}
                            </RadioGroup>
                        )}
                    </FormControl>
                </Box>
            </Box>
            {loading ? (
                <Stack
                    justifyContent="center"
                    alignContent="center"
                    alignItems="center"
                    width="100%"
                    height="100%"
                >
                    <CircularProgress />
                </Stack>
            ) : data?.has_statistics ? (
                <Grid
                    container
                    spacing={1.25 / 2}
                    sx={{
                        pb: "10px",
                    }}
                >
                    <Grid size={12}>
                        <InscripcionesPorPeriodo courses={curso} />
                    </Grid>
                    <Grid size={{ xs: 12, md: 3 }}>
                        <UserSummary
                            slotProps={{
                                item: { size: 12 },
                                root: {
                                    spacing: 1.25 / 2,
                                    direction: "column",
                                },
                            }}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 3 }}>
                        <Card
                            variant="outlined"
                            sx={{
                                // width: "100%",
                                height: "100%",
                            }}
                        >
                            <CardContent>
                                <Typography level="title-lg">
                                    Personas registradas
                                </Typography>
                                <Stack
                                    // flex={0.5}
                                    justifyContent="center"
                                >
                                    <Stack
                                        direction="row"
                                        alignItems="center"
                                        justifyContent="space-between"
                                        spacing={1.25}
                                    >
                                        <Typography level="body-md">
                                            Hoy
                                        </Typography>
                                        <Typography level="h2">
                                            {formatNumber(data.today)}
                                        </Typography>
                                    </Stack>
                                    <Stack
                                        direction="row"
                                        alignItems="center"
                                        justifyContent="space-between"
                                        spacing={1.25}
                                    >
                                        <Typography level="body-md">
                                            Total, desde el inicio
                                        </Typography>
                                        <Typography level="h2">
                                            {formatNumber(data.total)}
                                        </Typography>
                                    </Stack>
                                </Stack>
                                <Stack justifyContent="center">
                                    <Stack
                                        direction="row"
                                        alignItems="center"
                                        justifyContent="space-between"
                                        spacing={1.25}
                                    >
                                        <Typography level="body-md">
                                            Personas validadas
                                        </Typography>
                                        <Typography level="h2">
                                            {formatNumber(data.validated)}
                                        </Typography>
                                    </Stack>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Card
                            variant="outlined"
                            sx={{
                                // width: "100%",
                                height: "100%",
                            }}
                        >
                            <CardContent>
                                <Typography level="title-lg">
                                    Personas por etnia
                                </Typography>
                                <Grid container columnSpacing={5}>
                                    {data?.etnia?.map((item, index) => (
                                        <Grid
                                            key={index}
                                            size={{ xs: 12, md: 6 }}
                                        >
                                            <Stack
                                                direction="row"
                                                alignItems="center"
                                                justifyContent="space-between"
                                                // spacing={1.25}
                                                // flex={1}
                                            >
                                                <Typography level="body-md">
                                                    {item.label}
                                                </Typography>
                                                <Typography level="h2">
                                                    {formatNumber(item.value)}
                                                </Typography>
                                            </Stack>
                                        </Grid>
                                    ))}
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid size={{ md: 12 }}>
                        <Card
                            variant="outlined"
                            sx={{
                                // width: "100%",
                                height: "100%",
                            }}
                        >
                            <CardContent>
                                <Typography level="title-lg">
                                    Personas por rol
                                </Typography>
                                <CustomPie
                                    data={data?.rol}
                                    slotProps={{
                                        item: {
                                            root: {
                                                size: { xs: 12, lg: 6 },
                                            },
                                        },
                                        pie: {
                                            root: {
                                                sx: {
                                                    width: {
                                                        xs: "100%",
                                                        md: "20%",
                                                    },
                                                },
                                            },
                                        },
                                    }}
                                />
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Card
                            variant="outlined"
                            sx={{
                                // width: "100%",
                                height: "100%",
                            }}
                        >
                            <CardContent>
                                <Typography level="title-lg">
                                    Personas por rangos de edad
                                </Typography>
                                <CustomPie data={data?.edad} />
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Card
                            variant="outlined"
                            sx={{
                                // width: "100%",
                                height: "100%",
                            }}
                        >
                            <CardContent>
                                <Typography level="title-lg">
                                    Personas por género
                                </Typography>
                                <CustomPie
                                    data={data?.genero}
                                    slotProps={{
                                        item: {
                                            root: {
                                                size: 12,
                                            },
                                        },
                                    }}
                                />
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Card
                            variant="outlined"
                            sx={{
                                // width: "100%",
                                height: "100%",
                            }}
                        >
                            <CardContent>
                                <Typography level="title-lg">
                                    Personas por zona
                                </Typography>
                                <CustomPie data={data?.zona} />
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid size={12}>
                        <Card
                            variant="outlined"
                            sx={{
                                // width: "100%",
                                height: "100%",
                            }}
                        >
                            <CardContent>
                                <Typography level="title-lg">
                                    Personas por departamento
                                </Typography>

                                <BarChart
                                    dataset={data?.departamento || []}
                                    xAxis={[
                                        { scaleType: "band", dataKey: "label" },
                                    ]}
                                    series={[
                                        {
                                            dataKey: "value",
                                            // label: "London",
                                        },
                                    ]}
                                    height={300}
                                />
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            ) : (
                <Typography level="body-md">
                    No hay estadísticas disponibles
                </Typography>
            )}
        </Layout>
    );
}
