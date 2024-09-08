import { Card, CardContent, CircularProgress, Skeleton } from "@mui/joy";
import Box from "@mui/joy/Box";
import Breadcrumbs from "@mui/joy/Breadcrumbs";
import Link from "@mui/joy/Link";
import Typography from "@mui/joy/Typography";

import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";

import { Stack } from "@mui/material";
import Grid from "@mui/material/Grid2";

import Layout from "@/components/Home/Layout";

import Head from "next/head";

import dayjs from "dayjs";
import "dayjs/locale/es";

import { useEffect, useState } from "react";

import { formatNumber } from "@/components/utils";
import fetcher from "@/components/fetcher";

import useSWR from "swr";

dayjs.locale("es");

export default function Panel() {
    const { data, isLoading } = useSWR("api/usuarios/estadisticas", fetcher);
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
                    <Typography
                        color="primary"
                        sx={{ fontWeight: 500, fontSize: 12 }}
                    >
                        Panel
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
                    Panel de estadísticas
                </Typography>
            </Box>
            <Grid container spacing={1.25}>
                <Grid size={{ xs: 12, md: 4 }}>
                    <Card variant="plain">
                        <CardContent>
                            <Typography level="title-lg">
                                Personas registradas
                            </Typography>
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
                        </CardContent>
                    </Card>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                    <Card
                        variant="plain"
                        sx={{
                            width: "100%",
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
            </Grid>
        </Layout>
    );
}
