import fetcher from "@/components/fetcher";
import Layout from "@/components/Home/Layout";
import usePermissionContext from "@/components/Home/permissionContext/usePermission";
import {
    AvanceGruposSkeleton,
    DistribucionSkeleton,
    ModulosSkeleton,
    ResumenGeneralSkeleton,
    SectionLoader,
    TablaMetaSkeleton,
} from "@/components/Pages/Avances/EstadisticasSkeletons";
import { ConfiguracionCompletitudButton } from "@/components/Pages/Avances/ConfiguracionCompletitudModal";
import { PesosActividadesButton } from "@/components/Pages/Avances/PesosActividadesModal";
import ExportAvances from "@/components/Pages/Avances/ExportarAvances";
import GraficoAvanceGrupos from "@/components/Pages/Avances/GraficoAvanceGrupos";
import TablaAvanceGrupos from "@/components/Pages/Avances/TablaAvanceGrupos";
import TablaMetaCurso from "@/components/Pages/Avances/TablaMetaCurso";
import CustomPie from "@/components/Panel/CustomPie";
import { formatNumber, getURL } from "@/components/utils";
import { useCiclo } from "@/contexts/CicloContext";
import useAvancePorGrupo from "@/hooks/useAvancePorGrupo";
import useClient from "@/hooks/useClient";
import usePermission from "@/hooks/usePermission";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import { Divider, Tooltip } from "@mui/joy";
import Box from "@mui/joy/Box";
import Breadcrumbs from "@mui/joy/Breadcrumbs";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import Checkbox from "@mui/joy/Checkbox";
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
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
    const [selectedModulos, setSelectedModulos] = useState(null);
    const [mounted, setMounted] = useState(false);
    const filterChangeRef = useRef(null);

    const { isLoading: permissionIsLoading, isAdmin } = usePermissionContext();
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
        if (selectedModulos?.length) params.append("resumen_modulo_ids", selectedModulos.join(","));
        return params.toString();
    }, [selectedCicloId, cursoId, grupoId, selectedModulos]);

    const { data, isLoading, isValidating, error } = useSWR(
        selectedCicloId && cursoId
            ? getURL(`api/moodle/estadisticas-avances?${statsUrl}`)
            : null,
        fetcher,
        { keepPreviousData: true },
    );

    const isRefetching = isValidating && !isLoading;
    const lastFilter = filterChangeRef.current;
    const isResumenRefetching = isRefetching;
    const isModulosRefetching = isRefetching && lastFilter !== "modulo";
    const isTablaMetaRefetching = isRefetching && lastFilter !== "modulo";

    const handleCursoChange = useCallback((_, value) => {
        filterChangeRef.current = "course";
        setCursoId(value);
        setGrupoId(null);
        setSelectedModulos(null);
    }, []);

    const handleGrupoChange = useCallback((_, value) => {
        filterChangeRef.current = "group";
        setGrupoId(value);
    }, []);

    useEffect(() => {
        if (cursos && cursos.length > 0 && !cursoId) {
            setCursoId(cursos[0].id);
        }
    }, [cursos, cursoId]);

    // Auto-seleccionar módulo "Principal" cuando llegan los datos
    const modulosDisponibles = data?.modulos_disponibles || [];
    useEffect(() => {
        if (modulosDisponibles.length > 0 && selectedModulos === null && !isValidating) {
            const principal = modulosDisponibles.find((m) =>
                m.name.toLowerCase().includes("principal"),
            );
            setSelectedModulos(
                principal ? [principal.id] : modulosDisponibles.map((m) => m.id),
            );
        }
    }, [modulosDisponibles, selectedModulos, isValidating]);

    const handleModuloToggle = useCallback(
        (moduloId) => {
            filterChangeRef.current = "modulo";
            setSelectedModulos((prev) => {
                if (!prev) return [moduloId];
                if (prev.includes(moduloId)) {
                    if (prev.length === 1) return prev;
                    return prev.filter((id) => id !== moduloId);
                }
                return [...prev, moduloId];
            });
        },
        [],
    );

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
                                    placeholder="Todos"
                                    value={grupoId}
                                    onChange={handleGrupoChange}
                                    disabled={
                                        !cursoId || gruposLoading || !grupos?.length
                                    }
                                >
                                    <Option value={null}>Todos</Option>
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

                {cursoId && error && !data && (
                    <Card color="danger">
                        <CardContent>
                            <Typography color="danger">
                                Error al cargar estadísticas: {error.message}
                            </Typography>
                        </CardContent>
                    </Card>
                )}

                {cursoId && (data || isLoading) && (
                    <>
                        <Grid container spacing={1}>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <SectionLoader
                                    showSkeleton={!data}
                                    skeleton={<ResumenGeneralSkeleton />}
                                    isRefetching={isResumenRefetching}
                                >
                                    <Card
                                        sx={{
                                            minHeight: "280px",
                                            bgcolor: "transparent !important",
                                            borderColor: "transparent !important",
                                            pb: "0px !important",
                                        }}
                                    >
                                        <CardContent>
                                            <Typography level="title-lg" sx={{ mb: 1 }}>
                                                Estado general del avance
                                            </Typography>
                                            {modulosDisponibles.length > 0 && (
                                                <Stack
                                                    direction="row"
                                                    flexWrap="wrap"
                                                    gap={1.5}
                                                    sx={{ mb: 1.5 }}
                                                >
                                                    {modulosDisponibles.map((modulo) => (
                                                        <Checkbox
                                                            key={modulo.id}
                                                            label={modulo.name}
                                                            size="sm"
                                                            checked={selectedModulos?.includes(modulo.id) ?? false}
                                                            onChange={() => handleModuloToggle(modulo.id)}
                                                        />
                                                    ))}
                                                </Stack>
                                            )}
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
                                            </Stack>

                                            <Stack
                                                spacing={1}
                                                direction="row"
                                            >

                                                <Tooltip
                                                    title={`${resumen.sin_avance} personas no han realizado ninguna actividad`}
                                                    arrow
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
                                                                Inactivos
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
                                                </Tooltip>

                                                <Tooltip
                                                    title={`${resumen.en_progreso} personas han realizado al menos una actividad, pero no han alcanzado el 100% de avance`}
                                                    arrow
                                                >
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
                                                                En riesgo
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
                                                </Tooltip>


                                                <Tooltip
                                                    title={`${resumen.completados} personas han completado todas las actividades o han alcanzado el 100% de avance según la configuración de completitud establecida para el curso`}
                                                    arrow
                                                >

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
                                                                Completados
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
                                                </Tooltip>
                                            </Stack>
                                        </CardContent>
                                    </Card>
                                </SectionLoader>
                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }}>
                                <SectionLoader
                                    showSkeleton={!data}
                                    skeleton={<DistribucionSkeleton />}
                                    isRefetching={isResumenRefetching}
                                >
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
                                </SectionLoader>
                            </Grid>
                        </Grid>

                        {/* Gráficas por módulo */}
                        <Divider sx={{
                            mb: 1,
                            mt: 3,
                        }} />
                        <Typography level="h3" sx={{ my: 1 }}>
                            Avance por actividad en cada módulo
                        </Typography>
                        <SectionLoader
                            showSkeleton={!data}
                            skeleton={
                                <Grid container spacing={1}>
                                    <ModulosSkeleton />
                                </Grid>
                            }
                            isRefetching={isModulosRefetching}
                        >
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
                        </SectionLoader>

                        {/* Tabla de meta por curso */}
                        <SectionLoader
                            showSkeleton={!data}
                            skeleton={
                                <>
                                    <Divider sx={{ mb: 1, mt: 3 }} />
                                    <Typography level="h3" sx={{ my: 1 }}>
                                        Cumplimiento de la meta
                                    </Typography>
                                    <TablaMetaSkeleton />
                                </>
                            }
                            isRefetching={isTablaMetaRefetching}
                        >
                            {data?.tabla_meta && (
                                <>
                                    <Divider sx={{
                                        mb: 1,
                                        mt: 3,
                                    }} />
                                    <Stack direction="row" alignItems="center" gap={1} sx={{ my: 1 }}>
                                        <Typography level="h3">
                                            Cumplimiento de la meta
                                        </Typography>
                                        {isAdmin && cursoId && (
                                            <>
                                                <ConfiguracionCompletitudButton cursoId={cursoId} />
                                                <PesosActividadesButton cursoId={cursoId} />
                                            </>
                                        )}
                                    </Stack>
                                    <TablaMetaCurso data={data.tabla_meta} />
                                </>
                            )}
                        </SectionLoader>

                        {/* Avance por grupo */}
                        <SectionLoader
                            showSkeleton={avanceGruposLoading}
                            skeleton={
                                <>
                                    <Divider sx={{ mb: 1, mt: 3 }} />
                                    <Typography level="h3" sx={{ my: 1 }}>
                                        Avance por grupo
                                    </Typography>
                                    <AvanceGruposSkeleton />
                                </>
                            }
                            isRefetching={false}
                        >
                            {hasAvanceGrupos && (
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
                        </SectionLoader>
                    </>
                )}
            </Box>
        </Layout>
    );
}
