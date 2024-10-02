"use client";

import Box from "@mui/joy/Box";
import Breadcrumbs from "@mui/joy/Breadcrumbs";
import Button from "@mui/joy/Button";
import Link from "@mui/joy/Link";
import Typography from "@mui/joy/Typography";

import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";

import Layout from "@/components/Home/Layout";
import OrderList from "@/components/Home/OrderList";
import OrderTable from "@/components/Home/OrderTable";
import Head from "next/head";

import CircularProgress from "@mui/joy/CircularProgress";
import Stack from "@mui/joy/Stack";
import { Fragment } from "react";

import useSWR from "swr";

import fetcher from "@/components/fetcher";
import { formatNumber, getURL } from "@/components/utils";
import DevWrapper from "@/components/Wrapper/DevWrapper";

import Alert from "@/components/Alert";
import { Card, CardContent, Skeleton } from "@mui/joy";
import { useRouter } from "next/navigation";

import CountUp from "react-countup";

export default function Registros({ children }) {
    const { data: inscritos, isLoading: inscritosIsLoading } = useSWR(
        getURL("api/usuarios/estadisticas"),
        fetcher
    );
    const router = useRouter();

    const { data, isLoading } = useSWR(
        getURL("/api/usuarios/inscritos"),
        fetcher
    );

    const onView = (id) => {
        router.push(`/registros/${id}`, undefined, { shallow: true });
    };

    return (
        <Layout>
            <Alert />
            <Head>
                <title>Personas registradas - Consulta previa</title>
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
                        Registros
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
                <Stack spacing={1.25}>
                    <Typography level="h2" component="h1">
                        Registros
                    </Typography>
                    <Stack direction="row" spacing={1.25 / 2}>
                        <Card variant="outlined">
                            <CardContent>
                                <Typography level="title-lg">
                                    Personas registradas
                                </Typography>
                                <Stack
                                    flex={1}
                                    justifyContent="center"
                                    alignItems="center"
                                >
                                    <Typography level="h2">
                                        {inscritosIsLoading ? (
                                            <CircularProgress size="sm" />
                                        ) : inscritos?.total ? (
                                            <CountUp
                                                end={inscritos?.total}
                                                duration={1.25}
                                                separator="."
                                            />
                                        ) : (
                                            0
                                        )}
                                    </Typography>
                                </Stack>
                            </CardContent>
                        </Card>
                        <Card variant="outlined">
                            <CardContent>
                                <Typography level="title-lg">
                                    Personas validadas (
                                    <Skeleton
                                        loading={isLoading}
                                        variant="inline"
                                        width="24px"
                                        height="24px"
                                    >
                                        {inscritos?.percentage}
                                    </Skeleton>
                                    %)
                                </Typography>
                                <Stack
                                    flex={1}
                                    spacing={0}
                                    justifyContent="center"
                                >
                                    <Stack
                                        direction="row"
                                        // alignItems="center"
                                        alignItems="baseline"
                                        justifyContent="center"
                                        spacing={1.25}
                                    >
                                        <Typography level="h2">
                                            {inscritosIsLoading ? (
                                                <CircularProgress size="sm" />
                                            ) : (
                                                formatNumber(inscritos?.total)
                                            )}
                                        </Typography>
                                    </Stack>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Stack>
                </Stack>
                <DevWrapper>
                    <Button
                        color="primary"
                        startDecorator={<DownloadRoundedIcon />}
                        size="sm"
                        loading={isLoading}
                    >
                        Descargar XLSX
                    </Button>
                </DevWrapper>
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
            ) : (
                <Fragment>
                    <OrderTable data={data} onView={onView} />
                    <OrderList data={data} onView={onView} />
                </Fragment>
            )}
            {children}
        </Layout>
    );
}
