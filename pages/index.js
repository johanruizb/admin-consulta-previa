import CicloSelector from "@/components/Ciclos/CicloSelector";
import fetcher from "@/components/fetcher";
import Layout from "@/components/Home/Layout";
import CustomPie from "@/components/Panel/CustomPie";
import InscripcionesPorPeriodo from "@/components/Panel/InscripcionesPorPeriodo";
import { formatNumber, getURL } from "@/components/utils";
import { useCiclo } from "@/contexts/CicloContext";
import useClient from "@/hooks/useClient";
import getParams from "@/utils/params";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import LanguageIcon from "@mui/icons-material/Language";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { Divider } from "@mui/joy";
import Box from "@mui/joy/Box";
import Breadcrumbs from "@mui/joy/Breadcrumbs";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import CircularProgress from "@mui/joy/CircularProgress";
import Button from "@mui/joy/Button";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Option from "@mui/joy/Option";
import Select from "@mui/joy/Select";
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
import { Fragment, useEffect, useEffectEvent, useState } from "react";
import useSWR from "swr";
import RestartAltIcon from "@mui/icons-material/RestartAlt";

dayjs.locale("es");

const PLATFORM_OPTIONS = [
    { value: "web", label: "Web" },
    { value: "whatsapp", label: "WhatsApp" },
];

const getDefaultFilters = () => ({
    tipo_cliente: null,
    etnia: null,
    genero: null,
    zona: null,
    departamento: null,
    plataforma: null,
    courses: null,
});

export default function Page() {
    const { selectedCicloId } = useCiclo();
    const [filters, setFilters] = useState(getDefaultFilters);
    const [filterOptions, setFilterOptions] = useState({
        tipo_cliente: [],
        etnia: [],
        genero: [],
        zona: [],
        departamento: [],
        plataforma: [...PLATFORM_OPTIONS],
    });

    const activeFilters = Object.entries(filters).reduce(
        (acc, [key, value]) => {
            if (value) {
                acc[key] = value;
            }
            return acc;
        },
        {}
    );

    const { courses: curso } = filters;

    const statsParams =
        selectedCicloId && curso
            ? {
                  ciclo_id: selectedCicloId,
                  courses: Array.isArray(curso) ? curso : curso?.split(","),
                  ...activeFilters,
              }
            : null;

    const { data, isLoading } = useSWR(
        statsParams
            ? getURL(`api/usuarios/estadisticas?${getParams(statsParams)}`)
            : null,
        fetcher
    );

    const summaryParams = {
        ...activeFilters,
    };
    if (selectedCicloId) {
        summaryParams.ciclo_id = selectedCicloId;
    }
    const summaryQuery = getParams(summaryParams);
    const summaryUrl = `api/usuarios/summary${
        summaryQuery ? `?${summaryQuery}` : ""
    }`;

    const { data: summaryData } = useSWR(getURL(summaryUrl));

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

    useEffect(() => {
        setFilters(getDefaultFilters());
        setFilterOptions({
            tipo_cliente: [],
            etnia: [],
            genero: [],
            zona: [],
            departamento: [],
            plataforma: [...PLATFORM_OPTIONS],
        });
    }, [selectedCicloId]);

    useEffect(() => {
        if (!data) return;

        const formatOptions = (items) =>
            (items || [])
                .map((item) => {
                    if (item?.id === null || item?.id === undefined) {
                        return null;
                    }
                    return {
                        value: String(item.id),
                        label: item.label,
                    };
                })
                .filter(Boolean);

        const mergeOptions = (current, incoming) => {
            if (!incoming || incoming.length === 0) {
                return current;
            }
            const map = new Map();
            current.forEach((option) => {
                map.set(option.value, option);
            });
            incoming.forEach((option) => {
                map.set(option.value, option);
            });
            return Array.from(map.values()).sort((a, b) =>
                a.label.localeCompare(b.label, "es", { sensitivity: "base" })
            );
        };

        setFilterOptions((prev) => ({
            tipo_cliente: mergeOptions(
                prev.tipo_cliente,
                formatOptions(data?.rol)
            ),
            etnia: mergeOptions(prev.etnia, formatOptions(data?.etnia)),
            genero: mergeOptions(prev.genero, formatOptions(data?.genero)),
            zona: mergeOptions(prev.zona, formatOptions(data?.zona)),
            departamento: mergeOptions(
                prev.departamento,
                formatOptions(data?.departamento)
            ),
            plataforma: prev.plataforma,
        }));
    }, [data]);

    const handleCursoChange = (event) => {
        const value = event.target.value;
        let newCurso;

        if (typeof value === "string" && value.includes(",")) {
            newCurso = value.split(",").map((id) => parseInt(id, 10));
        } else {
            newCurso = [parseInt(value, 10)];
        }

        // setCurso(newCurso);
        setFilters((prev) => ({
            ...prev,
            courses: newCurso,
        }));
    };

    const handleFilterChange = (key) => (_event, newValue) => {
        setFilters((prev) => ({
            ...prev,
            [key]: newValue || null,
        }));
    };

    const prevCicloId = usePrevious(selectedCicloId);

    const resetSelectedCurso = useEffectEvent(() => {
        setFilters((prev) => ({
            ...prev,
            courses: cursos?.map((c) => c.id),
        }));
    });

    const resetFilters = useEffectEvent(() => {
        setFilters((prev) => {
            const base = getDefaultFilters();
            base.courses = Array.isArray(cursos)
                ? cursos.map((c) => c.id)
                : prev.courses;
            return base;
        });
    });

    useEffect(() => {
        if (selectedCicloId && selectedCicloId !== prevCicloId) {
            resetSelectedCurso();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedCicloId, prevCicloId, cursos]);

    if (!mounted) return null;

    const loading = isLoading || cursosIsLoading || !filters.courses;

    const filterConfig = [
        { key: "tipo_cliente", label: "Rol" },
        { key: "etnia", label: "Etnia" },
        { key: "genero", label: "Género" },
        { key: "zona", label: "Zona" },
        { key: "departamento", label: "Departamento" },
        { key: "plataforma", label: "Plataforma" },
    ];

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
            <Box
                sx={{
                    mb: 1,
                    display: "flex",
                    flexDirection: "column",
                    gap: 0.5,
                }}
            >
                <Button
                    variant="outlined"
                    size="sm"
                    onClick={resetFilters}
                    sx={{
                        alignSelf: { xs: "stretch", sm: "flex-end" },
                    }}
                    startDecorator={<RestartAltIcon />}
                >
                    Restablecer filtros
                </Button>
                <Grid container spacing={1.25 / 2}>
                    {filterConfig.map(({ key, label }) => (
                        <Grid
                            key={key}
                            size={{ xs: 12, sm: 6, md: 4, lg: 2 }}
                            sx={{
                                width: "100%",
                            }}
                        >
                            <FormControl>
                                <FormLabel>{label}</FormLabel>
                                <Select
                                    value={filters[key] ?? ""}
                                    onChange={handleFilterChange(key)}
                                    placeholder="Todos"
                                    size="sm"
                                >
                                    <Option value="">Todos</Option>
                                    {filterOptions[key]?.map((option) => (
                                        <Option
                                            key={option.value}
                                            value={option.value}
                                        >
                                            {option.label}
                                        </Option>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                    ))}
                </Grid>
            </Box>
            <Grid
                container
                spacing={1.25 / 2}
                sx={{
                    pb: "10px",
                }}
            >
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
                    <Fragment>
                        <Grid size={{ xs: 12, md: 4 }}>
                            <Card
                                variant="outlined"
                                sx={{
                                    height: "100%",
                                }}
                            >
                                <CardContent>
                                    <Typography level="title-lg">
                                        Personas registradas
                                    </Typography>
                                    <Divider sx={{ mt: 1 }} />
                                    <Stack justifyContent="center">
                                        {summaryData?.diplomados?.map(
                                            (item, index) => (
                                                <Fragment key={index}>
                                                    <Stack
                                                        direction="row"
                                                        alignItems="center"
                                                        justifyContent="space-between"
                                                        spacing={1.25}
                                                    >
                                                        <Typography level="body-lg">
                                                            {item.shortname}
                                                        </Typography>
                                                        <Typography
                                                            fontSize="xxx-large"
                                                            color="warning"
                                                            fontWeight="bold"
                                                        >
                                                            {formatNumber(
                                                                item.registrados
                                                            )}
                                                        </Typography>
                                                    </Stack>
                                                    <Divider
                                                        sx={{ my: 0.25 }}
                                                    />
                                                </Fragment>
                                            )
                                        )}
                                        {summaryData?.cursos?.map(
                                            (item, index) => (
                                                <Fragment key={index}>
                                                    <Stack
                                                        direction="row"
                                                        alignItems="center"
                                                        justifyContent="space-between"
                                                        spacing={1.25}
                                                    >
                                                        <Typography level="body-lg">
                                                            {item.shortname}
                                                        </Typography>
                                                        <Typography
                                                            fontSize="xxx-large"
                                                            color="warning"
                                                            fontWeight="bold"
                                                        >
                                                            {formatNumber(
                                                                item.registrados
                                                            )}
                                                        </Typography>
                                                    </Stack>
                                                    <Divider
                                                        sx={{ my: 0.25 }}
                                                    />
                                                </Fragment>
                                            )
                                        )}
                                        <Stack
                                            direction="row"
                                            alignItems="center"
                                            justifyContent="space-between"
                                            spacing={1.25}
                                        >
                                            <Typography
                                                fontSize="xxx-large"
                                                color="primary"
                                                fontWeight="bold"
                                            >
                                                Total
                                            </Typography>
                                            <Typography
                                                fontSize="xxx-large"
                                                color="primary"
                                                fontWeight="bold"
                                            >
                                                {formatNumber(data.total)}
                                            </Typography>
                                        </Stack>
                                    </Stack>
                                    <Divider sx={{ mt: 0.25, mb: 1 }} />
                                    <Stack
                                        direction="row"
                                        justifyContent="space-evenly"
                                        sx={{
                                            width: "100%",
                                        }}
                                    >
                                        {data?.total_web ? (
                                            <Stack
                                                justifyContent="center"
                                                alignItems="center"
                                                spacing={0.5}
                                                sx={{
                                                    "& *": {
                                                        color: "info.main",
                                                    },
                                                }}
                                            >
                                                <LanguageIcon
                                                    sx={{
                                                        fontSize: "xxx-large",
                                                    }}
                                                />
                                                <Typography
                                                    component="span"
                                                    level="body-lg"
                                                    textAlign="center"
                                                >
                                                    Via Web
                                                    <br />
                                                    <Typography fontSize="xx-large">
                                                        {formatNumber(
                                                            data?.total_web
                                                        )}
                                                    </Typography>
                                                </Typography>
                                            </Stack>
                                        ) : null}

                                        {data?.total_whatsapp ? (
                                            <Stack
                                                justifyContent="center"
                                                alignItems="center"
                                                spacing={0.5}
                                                sx={{
                                                    "& *": {
                                                        color: "#25d366",
                                                    },
                                                }}
                                            >
                                                <WhatsAppIcon
                                                    sx={{
                                                        fontSize: "xxx-large",
                                                    }}
                                                />
                                                <Typography
                                                    component="span"
                                                    level="body-lg"
                                                    textAlign="center"
                                                >
                                                    Via WhatsApp
                                                    <br />
                                                    <Typography fontSize="xx-large">
                                                        {formatNumber(
                                                            data?.total_whatsapp
                                                        )}
                                                    </Typography>
                                                </Typography>
                                            </Stack>
                                        ) : null}
                                    </Stack>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid size={8}>
                            <InscripcionesPorPeriodo
                                courses={curso}
                                filters={filters}
                            />
                        </Grid>
                        <Grid size={{ md: 12 }}>
                            <Card variant="outlined" sx={{ height: "100%" }}>
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
                            <Card variant="outlined" sx={{ height: "100%" }}>
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
                                                >
                                                    <Typography level="body-md">
                                                        {item.label}
                                                    </Typography>
                                                    <Typography level="h2">
                                                        {formatNumber(
                                                            item.value
                                                        )}
                                                    </Typography>
                                                </Stack>
                                            </Grid>
                                        ))}
                                    </Grid>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Card variant="outlined" sx={{ height: "100%" }}>
                                <CardContent>
                                    <Typography level="title-lg">
                                        Personas por rangos de edad
                                    </Typography>
                                    <CustomPie data={data?.edad} />
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Card variant="outlined" sx={{ height: "100%" }}>
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
                            <Card variant="outlined" sx={{ height: "100%" }}>
                                <CardContent>
                                    <Typography level="title-lg">
                                        Personas por zona
                                    </Typography>
                                    <CustomPie data={data?.zona} />
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid size={12}>
                            <Card variant="outlined" sx={{ height: "100%" }}>
                                <CardContent>
                                    <Typography level="title-lg">
                                        Personas por departamento
                                    </Typography>

                                    <BarChart
                                        dataset={data?.departamento || []}
                                        xAxis={[
                                            {
                                                scaleType: "band",
                                                dataKey: "label",
                                            },
                                        ]}
                                        series={[
                                            {
                                                dataKey: "value",
                                            },
                                        ]}
                                        height={300}
                                    />
                                </CardContent>
                            </Card>
                        </Grid>
                    </Fragment>
                ) : (
                    <Grid size={12}>
                        <Typography level="body-md">
                            No hay estadísticas disponibles
                        </Typography>
                    </Grid>
                )}
            </Grid>
        </Layout>
    );
}
