import Box from "@mui/joy/Box";
import Breadcrumbs from "@mui/joy/Breadcrumbs";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import CircularProgress from "@mui/joy/CircularProgress";
import Link from "@mui/joy/Link";
import Skeleton from "@mui/joy/Skeleton";
import Typography from "@mui/joy/Typography";

import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";

import Grid from "@mui/material/Grid2";
import Stack from "@mui/material/Stack";

import { PieChart, pieArcLabelClasses } from "@mui/x-charts/PieChart";

import Layout from "@/components/Home/Layout";

import Head from "next/head";

import dayjs from "dayjs";
import "dayjs/locale/es";

import { useEffect, useState } from "react";

import fetcher from "@/components/fetcher";
import { formatNumber, getURL } from "@/components/utils";

import useSWR from "swr";
import CustomPie from "@/components/Panel/CustomPie";

dayjs.locale("es");

export default function Page() {
    const { data, isLoading } = useSWR(
        getURL("api/usuarios/estadisticas"),
        fetcher
    );
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <Stack
                justifyContent="center"
                alignContent="center"
                alignItems="center"
                width="100%"
                height="100%"
            >
                <CircularProgress />
            </Stack>
        );
    }

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
            </Box>
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
                            <Stack flex={1} justifyContent="center">
                                <Stack
                                    direction="row"
                                    alignItems="center"
                                    justifyContent="space-between"
                                    spacing={1.25}
                                >
                                    <Typography level="body-md">Hoy</Typography>
                                    <Typography level="h2">
                                        {isLoading ? (
                                            <CircularProgress size="sm" />
                                        ) : (
                                            formatNumber(data.today)
                                        )}
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
                                        {isLoading ? (
                                            <CircularProgress size="sm" />
                                        ) : (
                                            formatNumber(data.total)
                                        )}
                                    </Typography>
                                </Stack>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>
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
                                Personas validadas (
                                <Skeleton
                                    loading={isLoading}
                                    variant="inline"
                                    width="24px"
                                    height="24px"
                                >
                                    {data?.percentage}
                                </Skeleton>
                                %)
                            </Typography>
                            <Stack flex={1} spacing={0} justifyContent="center">
                                <Stack
                                    direction="row"
                                    // alignItems="center"
                                    alignItems="baseline"
                                    justifyContent="center"
                                    spacing={1.25}
                                >
                                    <Typography level="h2">
                                        {isLoading ? (
                                            <CircularProgress size="sm" />
                                        ) : (
                                            formatNumber(data.validated)
                                        )}
                                    </Typography>
                                    <Typography level="body-md">de</Typography>
                                    <Typography level="h2">
                                        {isLoading ? (
                                            <CircularProgress size="sm" />
                                        ) : (
                                            formatNumber(data.total)
                                        )}
                                    </Typography>
                                </Stack>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>
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
                                Personas por etnia
                            </Typography>
                            {data?.etnia?.map((item, index) => (
                                <Stack
                                    key={index}
                                    direction="row"
                                    alignItems="center"
                                    justifyContent="space-between"
                                    spacing={1.25}
                                    flex={1}
                                >
                                    <Typography level="body-md">
                                        {item.label}
                                    </Typography>
                                    <Typography level="h2">
                                        {formatNumber(item.value)}
                                    </Typography>
                                </Stack>
                            ))}
                        </CardContent>
                    </Card>
                </Grid>
                <Grid
                    size={{ md: 12 }}
                    sx={{
                        display: { xs: "none", md: "block" },
                    }}
                >
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
                                Personas por genero
                            </Typography>
                            <CustomPie data={data?.genero} />
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
                                Personas interesadas en continuar con el curso
                                de 120 horas
                            </Typography>
                            <CustomPie data={data?.continuar_curso} />
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Layout>
    );
}
