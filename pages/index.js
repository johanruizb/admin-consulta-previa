import Box from "@mui/joy/Box";
import Breadcrumbs from "@mui/joy/Breadcrumbs";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import Checkbox from "@mui/joy/Checkbox";
import CircularProgress from "@mui/joy/CircularProgress";
import Link from "@mui/joy/Link";
import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";
import Typography from "@mui/joy/Typography";

import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import Close from "@mui/icons-material/Close";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";

import Grid from "@mui/material/Grid2";
import Stack from "@mui/material/Stack";

import { BarChart } from "@mui/x-charts/BarChart";

import Layout from "@/components/Home/Layout";

import Head from "next/head";

import dayjs from "dayjs";
import "dayjs/locale/es";

import { useState } from "react";

import fetcher from "@/components/fetcher";
import CustomPie from "@/components/Panel/CustomPie";
import { formatNumber, getURL } from "@/components/utils";

import useClient from "@/hooks/useClient";
import useSWR from "swr";

dayjs.locale("es");

const fetcherWithCurso = ({ url, args: { options } }) => {
    return fetcher(url, options);
};

export default function Page() {
    const [curso, setCurso] = useState([1, 2, 3, 4]);

    const { data, isLoading } = useSWR(
        {
            url: getURL("api/usuarios/estadisticas"),
            args: {
                options: {
                    method: "POST",
                    body: JSON.stringify(curso),
                },
            },
        },
        {
            fetcher: fetcherWithCurso,
        },
    );

    const { data: cursos, isLoading: cursosIsLoading } = useSWR(
        getURL("api/usuarios/cursos/disponibles"),
        fetcher,
    );

    const [mounted, setMounted] = useState(false);

    useClient(() => setMounted(true));

    const handleCursoChange = (event) => {
        const newValue = parseInt(event.target.value);

        if (curso.includes(newValue)) {
            setCurso((prev) => prev.filter((item) => item !== newValue));
        } else {
            setCurso((prev) => [...prev, newValue]);
        }
    };

    if (!mounted) return null;

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
                <Typography level="h2" component="h1">
                    Estadísticas
                </Typography>

                <Box
                    sx={{
                        flex: { xs: 1, md: 0.5 },
                        maxWidth: { md: "calc(60% - 152.23px)" },
                        width: "100%",
                    }}
                >
                    <Typography
                        id="sandwich-group"
                        level="body-sm"
                        sx={{ fontWeight: "lg", mb: 1 }}
                    >
                        Estadísticas por curso
                    </Typography>
                    {cursosIsLoading ? (
                        <CircularProgress />
                    ) : (
                        <div role="group" aria-labelledby="sandwich-group">
                            <List size="sm">
                                {cursos?.map((item, index) => {
                                    const checked = curso.includes(item.id);

                                    return (
                                        <ListItem key={index}>
                                            <Checkbox
                                                value={item.id}
                                                label={item.shortname}
                                                checked={checked}
                                                onChange={handleCursoChange}
                                                color={
                                                    checked
                                                        ? "primary"
                                                        : "warning"
                                                }
                                                variant="solid"
                                                uncheckedIcon={<Close />}
                                                sx={{
                                                    my: 0.25,
                                                }}
                                            />
                                        </ListItem>
                                    );
                                })}
                            </List>
                        </div>
                    )}
                </Box>
            </Box>
            {isLoading ? (
                <Stack
                    justifyContent="center"
                    alignContent="center"
                    alignItems="center"
                    width="100%"
                    height="100%"
                >
                    <CircularProgress />
                </Stack>
            ) : data.has_statistics ? (
                <Grid
                    container
                    spacing={1.25 / 2}
                    sx={{
                        pb: "10px",
                    }}
                >
                    <Grid size={{ xs: 12, md: 4 }}>
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
                                {/* <Typography level="title-lg">
                                    Personas validadas
                                    ({data?.percentage} %)
                                </Typography> */}
                                <Stack
                                    // flex={0.5}
                                    justifyContent="center"
                                >
                                    {/* <Stack
                                        direction="row"
                                        alignItems="center"
                                        justifyContent="space-between"
                                        spacing={1.25}
                                    >
                                        <Typography level="body-md">
                                            Personas registradas
                                        </Typography>
                                        <Typography level="h2">
                                            {formatNumber(data.total)}
                                        </Typography>
                                    </Stack> */}
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
                                {/* <Stack
                                    flex={0.5}
                                    // flex={1}
                                    // spacing={0}
                                    justifyContent="center"
                                >
                                    <Stack
                                        direction="row"
                                        // alignItems="center"
                                        alignItems="baseline"
                                        // justifyContent="center"
                                        justifyContent={{
                                            md: "center",
                                            xs: "space-evenly",
                                        }}
                                        spacing={1.25}
                                    >
                                        <Typography level="h2">
                                            {formatNumber(data.validated)}
                                        </Typography>
                                        <Typography level="body-md">
                                            de
                                        </Typography>
                                        <Typography level="h2">
                                            {formatNumber(data.total)}
                                        </Typography>
                                    </Stack>
                                </Stack> */}
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid size={{ xs: 12, md: 8 }}>
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
                                    Personas interesadas en continuar con el
                                    curso de 120 horas
                                </Typography>
                                <CustomPie data={data?.continuar_curso} />
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
                                    height={400}
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
