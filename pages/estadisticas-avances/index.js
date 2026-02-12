import fetcher from "@/components/fetcher";
import Layout from "@/components/Home/Layout";
import usePermissionContext from "@/components/Home/permissionContext/usePermission";
import ExportAvances from "@/components/Pages/Avances/ExportarAvances";
import GraficoAvanceGrupos from "@/components/Pages/Avances/GraficoAvanceGrupos";
import TablaAvanceGrupos from "@/components/Pages/Avances/TablaAvanceGrupos";
import CustomPie from "@/components/Panel/CustomPie";
import { formatNumber, getURL } from "@/components/utils";
import { useCiclo } from "@/contexts/CicloContext";
import useAvancePorGrupo from "@/hooks/useAvancePorGrupo";
import useClient from "@/hooks/useClient";
import usePermission from "@/hooks/usePermission";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import { Divider } from "@mui/joy";
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
import Head from "next/head";
import { useCallback, useEffect, useMemo, useState } from "react";
import useSWR from "swr";

const COLORS = {
    completados: "#2e7d32",
    enProgreso: "#1976d2",
    sinAvance: "#607d8b",
};

const DISTRIBUCION_COLORS = [
    "#607d8b", // 0% - Blue Grey
    "#f44336", // 1-25% - Rojo
    "#ff9800", // 26-50% - Naranja
    "#ffc107", // 51-75% - Amarillo
    "#8bc34a", // 76-99% - Verde claro
    "#2e7d32", // 100% - Verde
];

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
    const statsUrl = useMemo(() => {
        const params = new URLSearchParams();
        if (selectedCicloId) params.append("ciclo_id", selectedCicloId);
        if (cursoId) params.append("curso_id", cursoId);
        if (grupoId) params.append("grupo_id", grupoId);
        return params.toString();
    }, [selectedCicloId, cursoId, grupoId]);

    const { data, isLoading, error } = useSWR(
        selectedCicloId && cursoId
            ? getURL(`api/moodle/estadisticas-avances?${statsUrl}`)
            : null,
        fetcher,
    );

    const handleCursoChange = useCallback((_, value) => {
        setCursoId(value);
        setGrupoId(null);
    }, []);

    const handleGrupoChange = useCallback((_, value) => {
        setGrupoId(value);
    }, []);

    useEffect(() => {
        if (cursos && cursos.length > 0 && !cursoId) {
            setCursoId(cursos[0].id);
        }
    }, [cursos, cursoId]);

    const resumen = data?.resumen_general || {};
    const distribucion = data?.distribucion_avance || [];
    const modulos = data?.avance_por_modulo || [];

    // Avance por grupo
    const {
        data: avanceGrupos,
        isLoading: avanceGruposLoading,
        hasData: hasAvanceGrupos,
    } = useAvancePorGrupo(selectedCicloId, cursoId);

    const exportFilterValues = useMemo(
        () => ({
            ciclo_id: selectedCicloId,
            activity__module__course_id: cursoId,
            grupo_usuario: grupoId || "all",
        }),
        [selectedCicloId, cursoId, grupoId],
    );

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

    return (
        <Layout>
            <Head>
                <title>Estadísticas de avances - Consulta previa</title>
            </Head>

            <Box
                sx={{
                    flex: 1,
                    overflowY: "auto",
                    mx: { xs: -2, md: -6 },
                    px: { xs: 2, md: 6 },
                }}
            >
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
                    <Typography level="h2" component="h1">
                        Estadísticas de avances
                    </Typography>
                    <ExportAvances filterValues={exportFilterValues} />
                </Box>

                {/* Filtros */}
                <Box
                    sx={{
                        position: "sticky",
                        top: -16,
                        zIndex: 100,
                        bgcolor: "background.body",
                        py: 2,
                        mb: 2,
                        mt: -1,
                        mx: { xs: -2, md: -6 },
                        px: { xs: 2, md: 6 },
                        transition: "box-shadow 0.3s ease-in-out",
                        borderColor: "divider",
                        // border: "1px solid",
                        borderWidth: "0 0 1px 0",
                        borderStyle: "solid",
                    }}
                >
                    <Grid container spacing={1}>
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
                </Box>

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
                            <Grid size={{ xs: 12, md: 6 }}>
                                {/* Cards de resumen */}
                                <Card
                                    sx={{
                                        minHeight: "280px",
                                        bgcolor: "transparent !important",
                                        borderColor: "transparent !important",
                                        pb: "0px !important",
                                    }}
                                >
                                    <CardContent>
                                        <Typography level="title-lg" sx={{ mb: 2 }}>
                                            Estado general del avance
                                        </Typography>
                                        <Stack
                                            spacing={1}
                                            direction="row"
                                            sx={{ mb: 0.5 }}
                                        >
                                            <Card sx={{ flex: 1 }}>
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
                                            <Card sx={{ flex: 1 }}>
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
                                        </Stack>

                                        <Stack
                                            spacing={1}
                                            direction="row"
                                        // sx={{ my: 0.5 }}
                                        >
                                            <Card
                                                sx={{
                                                    borderLeft: `4px solid ${COLORS.sinAvance}`,
                                                    flex: 1,
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
                                                        sx={{
                                                            color: COLORS.sinAvance,
                                                        }}
                                                    >
                                                        {formatNumber(
                                                            resumen.sin_avance,
                                                        )}
                                                    </Typography>
                                                </CardContent>
                                            </Card>

                                            <Card
                                                sx={{
                                                    borderLeft: `4px solid ${COLORS.enProgreso}`,
                                                    flex: 1,
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

                                            <Card
                                                sx={{
                                                    borderLeft: `4px solid ${COLORS.completados}`,
                                                    flex: 1,
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
                                        </Stack>
                                    </CardContent>
                                </Card>
                            </Grid>

                            {/* Gráficas */}
                            <Grid size={{ xs: 12, md: 6 }}>
                                {/* Distribución de avance */}
                                <Card sx={{ minHeight: "280px", height: "100%" }}>
                                    <CardContent>
                                        <Typography level="title-lg" sx={{ mb: 2 }}>
                                            Distribución de avance
                                        </Typography>
                                        <CustomPie
                                            data={distribucion}
                                            colors={DISTRIBUCION_COLORS}
                                        />
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>

                        {/* Gráficas por módulo */}
                        <Typography level="h3" sx={{ my: 1 }}>
                            Avance por actividad en cada módulo
                        </Typography>
                        <Grid
                            container
                            spacing={1}
                        >
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

                        {/* Avance por grupo */}
                        {avanceGruposLoading && (
                            <Stack
                                justifyContent="center"
                                alignItems="center"
                                py={4}
                            >
                                <CircularProgress />
                            </Stack>
                        )}

                        {hasAvanceGrupos && !avanceGruposLoading && (
                            <>
                                <Divider sx={{
                                    mb: 1,
                                    mt: 3,
                                }} />
                                <Typography level="h3" sx={{ my: 1 }}>
                                    Avance por grupo
                                </Typography>
                                <Grid container spacing={1} sx={{ pb: 2 }}>
                                    <Grid size={{ xs: 12 }}>
                                        <GraficoAvanceGrupos
                                            data={
                                                avanceGrupos?.resumen_grafico
                                            }
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12 }}>
                                        <TablaAvanceGrupos
                                            data={avanceGrupos}
                                            cicloId={selectedCicloId}
                                            cursoId={cursoId}
                                        />
                                    </Grid>
                                </Grid>
                            </>
                        )}
                    </>
                )}
            </Box>
        </Layout>
    );
}
