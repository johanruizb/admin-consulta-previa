import fetcher from "@/components/fetcher";
import Layout from "@/components/Home/Layout";
import usePermissionContext from "@/components/Home/permissionContext/usePermission";
import CustomPie from "@/components/Panel/CustomPie";
import { formatNumber, getURL } from "@/components/utils";
import { useCiclo } from "@/contexts/CicloContext";
import useClient from "@/hooks/useClient";
import usePermission from "@/hooks/usePermission";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import InsightsIcon from "@mui/icons-material/Insights";
import Box from "@mui/joy/Box";
import Breadcrumbs from "@mui/joy/Breadcrumbs";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import CircularProgress from "@mui/joy/CircularProgress";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Link from "@mui/joy/Link";
import Option from "@mui/joy/Option";
import Select from "@mui/joy/Select";
import Typography from "@mui/joy/Typography";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import { BarChart } from "@mui/x-charts/BarChart";
import { useFirstRender } from "@mui/x-data-grid";
import { useIsClient, useIsFirstRender } from "@uidotdev/usehooks";
import Head from "next/head";
import { useEffect, useState } from "react";
import useSWR from "swr";

const COLORS = {
    completados: "#2e7d32",
    enProgreso: "#1976d2",
    sinAvance: "#9e9e9e",
};

export default function EstadisticasAvancesPage() {
    const { selectedCicloId } = useCiclo();
    const [cursoId, setCursoId] = useState(null);
    const [grupoId, setGrupoId] = useState(null);
    const [mounted, setMounted] = useState(false);

    const { isLoading: permissionIsLoading } = usePermissionContext();
    usePermission("moodle.view_actividadescompletadas");
    useClient(() => setMounted(true));

    // Obtener cursos disponibles
    const { data: cursos, isLoading: cursosLoading } = useSWR(
        selectedCicloId
            ? getURL(
                  `api/usuarios/cursos/disponibles?ciclo_id=${selectedCicloId}`,
              )
            : null,
        fetcher,
    );

    // Obtener grupos del curso seleccionado
    const { data: grupos, isLoading: gruposLoading } = useSWR(
        selectedCicloId && cursoId
            ? getURL(
                  `api/moodle/curso/${cursoId}/grupos?ciclo_id=${selectedCicloId}`,
              )
            : null,
        fetcher,
    );

    // Obtener estadísticas de avances
    const params = new URLSearchParams();
    if (selectedCicloId) params.append("ciclo_id", selectedCicloId);
    if (cursoId) params.append("curso_id", cursoId);
    if (grupoId) params.append("grupo_id", grupoId);

    const { data, isLoading, error } = useSWR(
        selectedCicloId && cursoId
            ? getURL(`api/moodle/estadisticas-avances?${params.toString()}`)
            : null,
        fetcher,
    );

    const handleCursoChange = (_, value) => {
        setCursoId(value);
        setGrupoId(null);
    };

    const handleGrupoChange = (_, value) => {
        setGrupoId(value);
    };

    useEffect(() => {
        if (cursos && cursos.length > 0 && !cursoId) {
            setCursoId(cursos[0].id);
        }
    }, [cursos, cursoId]);

    if (!mounted || permissionIsLoading) {
        return (
            <Stack
                justifyContent="center"
                alignItems="center"
                width="100%"
                height="100vh"
            >
                <CircularProgress />
            </Stack>
        );
    }

    const resumen = data?.resumen_general || {};
    const distribucion = data?.distribucion_avance || [];
    const modulos = data?.avance_por_modulo || [];

    console.log("cursos", cursos);

    return (
        <Layout>
            <Head>
                <title>Estadísticas de avances - Consulta previa</title>
            </Head>

            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Breadcrumbs
                    size="sm"
                    separator={<ChevronRightRoundedIcon fontSize="sm" />}
                    sx={{ pl: 0 }}
                >
                    <Link underline="none" color="neutral" href="/">
                        <HomeRoundedIcon />
                    </Link>
                    <Typography color="primary" fontWeight={500}>
                        Estadísticas de avances
                    </Typography>
                </Breadcrumbs>
            </Box>

            <Typography level="h2" component="h1" sx={{ mb: 3 }}>
                <InsightsIcon sx={{ mr: 1, verticalAlign: "middle" }} />
                Estadísticas de avances
            </Typography>

            {/* Filtros */}
            <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                    <FormControl>
                        <FormLabel>Curso</FormLabel>
                        <Select
                            placeholder="Selecciona un curso"
                            value={cursoId}
                            onChange={handleCursoChange}
                            disabled={cursosLoading}
                        >
                            {cursos?.map((curso) => (
                                <Option key={curso.id} value={curso.id}>
                                    {curso.shortname}
                                </Option>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                    <FormControl>
                        <FormLabel>Grupo (opcional)</FormLabel>
                        <Select
                            placeholder="Todos los grupos"
                            value={grupoId}
                            onChange={handleGrupoChange}
                            disabled={
                                !cursoId || gruposLoading || !grupos?.length
                            }
                        >
                            <Option value={null}>Todos los grupos</Option>
                            {grupos
                                ?.filter((g) => g.id !== "all")
                                .map((grupo) => (
                                    <Option key={grupo.id} value={grupo.id}>
                                        {grupo.name}
                                    </Option>
                                ))}
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>

            {!cursoId && (
                <Card>
                    <CardContent>
                        <Typography
                            level="body-lg"
                            textAlign="center"
                            color="neutral"
                        >
                            Selecciona un curso para ver las estadísticas de
                            avance
                        </Typography>
                    </CardContent>
                </Card>
            )}

            {cursoId && isLoading && (
                <Stack justifyContent="center" alignItems="center" py={4}>
                    <CircularProgress />
                </Stack>
            )}

            {cursoId && error && (
                <Card color="danger">
                    <CardContent>
                        <Typography color="danger">
                            Error al cargar estadísticas: {error.message}
                        </Typography>
                    </CardContent>
                </Card>
            )}

            {cursoId && data && !isLoading && (
                <>
                    <Grid container spacing={1}>
                        <Grid size={6}>
                            {/* Cards de resumen */}
                            <Grid container spacing={1}>
                                <Grid size={{ xs: 6, md: 4 }}>
                                    <Card>
                                        <CardContent>
                                            <Typography
                                                level="body-sm"
                                                color="neutral"
                                            >
                                                Total personas
                                            </Typography>
                                            <Typography level="h2">
                                                {formatNumber(
                                                    resumen.total_personas,
                                                )}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                                <Grid size={{ xs: 6, md: 4 }}>
                                    <Card>
                                        <CardContent>
                                            <Typography
                                                level="body-sm"
                                                color="neutral"
                                            >
                                                Avance promedio
                                            </Typography>
                                            <Typography level="h2">
                                                {resumen.avance_promedio}%
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                                <Grid size={{ xs: 6, md: 4 }}>
                                    <Card
                                        sx={{
                                            borderLeft: `4px solid ${COLORS.completados}`,
                                        }}
                                    >
                                        <CardContent>
                                            <Typography
                                                level="body-sm"
                                                color="neutral"
                                            >
                                                Completados (100%)
                                            </Typography>
                                            <Typography
                                                level="h2"
                                                sx={{
                                                    color: COLORS.completados,
                                                }}
                                            >
                                                {formatNumber(
                                                    resumen.completados,
                                                )}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                                <Grid size={{ xs: 6, md: 4 }}>
                                    <Card
                                        sx={{
                                            borderLeft: `4px solid ${COLORS.enProgreso}`,
                                        }}
                                    >
                                        <CardContent>
                                            <Typography
                                                level="body-sm"
                                                color="neutral"
                                            >
                                                En progreso
                                            </Typography>
                                            <Typography
                                                level="h2"
                                                sx={{
                                                    color: COLORS.enProgreso,
                                                }}
                                            >
                                                {formatNumber(
                                                    resumen.en_progreso,
                                                )}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                                <Grid size={{ xs: 6, md: 4 }}>
                                    <Card
                                        sx={{
                                            borderLeft: `4px solid ${COLORS.sinAvance}`,
                                        }}
                                    >
                                        <CardContent>
                                            <Typography
                                                level="body-sm"
                                                color="neutral"
                                            >
                                                Sin avance
                                            </Typography>
                                            <Typography
                                                level="h2"
                                                sx={{ color: COLORS.sinAvance }}
                                            >
                                                {formatNumber(
                                                    resumen.sin_avance,
                                                )}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            </Grid>
                        </Grid>

                        <Grid size={6}>
                            {/* Gráficas */}
                            {/* Distribución de avance */}
                            <Card>
                                <CardContent>
                                    <Typography level="title-lg" sx={{ mb: 2 }}>
                                        Distribución de avance
                                    </Typography>
                                    <CustomPie data={distribucion} />
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>

                    {/* Gráficas por módulo */}
                    <Typography level="h3" sx={{ my: 1 }}>
                        Avance por actividad en cada módulo
                    </Typography>
                    <Grid container spacing={2}>
                        {modulos.map((modulo) => (
                            <Grid key={modulo.id} size={{ xs: 6 }}>
                                <Card>
                                    <CardContent>
                                        <Typography
                                            level="title-lg"
                                            sx={{ mb: 2 }}
                                        >
                                            {modulo.name}
                                        </Typography>
                                        {modulo.actividades?.length > 0 ? (
                                            <BarChart
                                                dataset={modulo.actividades}
                                                xAxis={[
                                                    {
                                                        scaleType: "band",
                                                        dataKey: "name",
                                                        tickLabelStyle: {
                                                            angle:
                                                                modulo
                                                                    .actividades
                                                                    .length > 4
                                                                    ? -45
                                                                    : 0,
                                                            textAnchor:
                                                                modulo
                                                                    .actividades
                                                                    .length > 4
                                                                    ? "end"
                                                                    : "middle",
                                                            fontSize: 11,
                                                        },
                                                    },
                                                ]}
                                                series={[
                                                    {
                                                        dataKey: "completados",
                                                        label: "Completados",
                                                        color: COLORS.completados,
                                                    },
                                                    {
                                                        dataKey:
                                                            "no_completados",
                                                        label: "Sin completar",
                                                        color: COLORS.sinAvance,
                                                    },
                                                ]}
                                                height={300}
                                                margin={{
                                                    bottom:
                                                        modulo.actividades
                                                            .length > 4
                                                            ? 120
                                                            : 40,
                                                }}
                                            />
                                        ) : (
                                            <Typography
                                                color="neutral"
                                                textAlign="center"
                                            >
                                                Sin actividades
                                            </Typography>
                                        )}
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                        {modulos.length === 0 && (
                            <Grid size={{ xs: 12 }}>
                                <Typography color="neutral" textAlign="center">
                                    No hay datos de módulos disponibles
                                </Typography>
                            </Grid>
                        )}
                    </Grid>
                </>
            )}
        </Layout>
    );
}
