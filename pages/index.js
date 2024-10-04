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

dayjs.locale("es");

const COLORS = [
    "#1f77b4",
    "#ff7f0e",
    "#2ca02c",
    "#d62728",
    "#9467bd",
    "#8c564b",
    "#e377c2",
    "#7f7f7f",
    "#bcbd22",
    "#17becf",
    "#a6cee3",
    "#1f78b4",
    "#b2df8a",
    "#33a02c",
    "#fb9a99",
    "#e31a1c",
    "#fdbf6f",
    "#ff7f00",
    "#cab2d6",
    "#6a3d9a",
    "#ffff99",
    "#b15928",
];

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
                            <PieChart
                                series={[
                                    {
                                        data: data?.rol ?? [],
                                        startAngle: -180,
                                        endAngle: 0,
                                        arcLabel: (item) => `${item.value}`,
                                    },
                                ]}
                                height={250}
                                // width="100%"
                                sx={{
                                    [`& .${pieArcLabelClasses.root}`]: {
                                        fontWeight: "bold",
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
                            <Stack
                                flexDirection="row"
                                flexWrap="wrap"
                                flex={1}
                                sx={{
                                    "& > *:first-of-type": {
                                        "& > *:first-of-type": {
                                            width: "200px !important",
                                            flexGrow: "unset !important",
                                            "& > *:first-of-type": {
                                                "& > *:first-of-type": {
                                                    transform:
                                                        "translateX(50px)",
                                                },
                                            },
                                        },
                                    },
                                }}
                            >
                                <Box
                                    sx={{
                                        width: { xs: "100%", md: "40%" },
                                        // height: "100%",
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                    }}
                                >
                                    <PieChart
                                        colors={COLORS}
                                        series={[
                                            {
                                                data: data?.edad ?? [],
                                                arcLabel: (item) =>
                                                    `${item.value}`,
                                                // arcLabelMinAngle: 35,
                                                // arcLabelRadius: "60%",
                                                paddingAngle: 5,
                                                innerRadius: 60,
                                                outerRadius: 80,
                                            },
                                        ]}
                                        height={200}
                                        width={250}
                                        sx={{
                                            [`& .${pieArcLabelClasses.root}`]: {
                                                fontWeight: "bold",
                                            },
                                        }}
                                        slotProps={{
                                            legend: {
                                                hidden: true,
                                            },
                                        }}
                                    />
                                </Box>
                                <Box
                                    sx={{
                                        width: { xs: "100%", md: "60%" },
                                    }}
                                >
                                    <Grid
                                        container
                                        flexDirection="row"
                                        flex={1}
                                    >
                                        {data?.edad?.map((item, index) => (
                                            <Grid size={6} key={index}>
                                                <Stack
                                                    direction="row"
                                                    alignItems="center"
                                                    // justifyContent="space-between"
                                                    spacing={1.25}
                                                    flex={1}
                                                >
                                                    <Box
                                                        component="span"
                                                        sx={{
                                                            width: 20,
                                                            height: 20,
                                                            // borderRadius: 10,
                                                            backgroundColor:
                                                                COLORS[index],
                                                        }}
                                                    />
                                                    <Typography
                                                        level="body"
                                                        noWrap
                                                    >
                                                        {item.label} (
                                                        {formatNumber(
                                                            item.value
                                                        )}
                                                        )
                                                    </Typography>
                                                </Stack>
                                            </Grid>
                                        ))}
                                    </Grid>
                                </Box>
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
                                Personas por genero
                            </Typography>
                            <PieChart
                                series={[
                                    {
                                        data: data?.genero ?? [],
                                        // innerRadius: 50,
                                        // outerRadius: 80,
                                        // paddingAngle: 5,
                                        // cornerRadius: 5,
                                        // startAngle: -45,
                                        // endAngle: 225,
                                        arcLabel: (item) => `${item.value}`,
                                        arcLabelMinAngle: 35,
                                        arcLabelRadius: "60%",
                                    },
                                ]}
                                height={250}
                                sx={{
                                    [`& .${pieArcLabelClasses.root}`]: {
                                        fontWeight: "bold",
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
                            <PieChart
                                series={[
                                    {
                                        data: data?.zona ?? [],
                                        // innerRadius: 50,
                                        // outerRadius: 80,
                                        // paddingAngle: 5,
                                        // cornerRadius: 5,
                                        // startAngle: -45,
                                        // endAngle: 225,
                                        arcLabel: (item) => `${item.value}`,
                                        arcLabelMinAngle: 35,
                                        arcLabelRadius: "60%",
                                    },
                                ]}
                                height={250}
                                sx={{
                                    [`& .${pieArcLabelClasses.root}`]: {
                                        fontWeight: "bold",
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
                                Personas interesadas en continuar con el curso
                                de 120 horas
                            </Typography>
                            <PieChart
                                series={[
                                    {
                                        data: data?.continuar_curso ?? [],
                                        // innerRadius: 50,
                                        // outerRadius: 80,
                                        // paddingAngle: 5,
                                        // cornerRadius: 5,
                                        // startAngle: -45,
                                        // endAngle: 225,
                                        arcLabel: (item) => `${item.value}`,
                                        arcLabelMinAngle: 35,
                                        arcLabelRadius: "60%",
                                    },
                                ]}
                                height={250}
                                sx={{
                                    [`& .${pieArcLabelClasses.root}`]: {
                                        fontWeight: "bold",
                                    },
                                }}
                            />
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Layout>
    );
}
