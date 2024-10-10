"use client";

import Box from "@mui/joy/Box";
import Breadcrumbs from "@mui/joy/Breadcrumbs";
import Button from "@mui/joy/Button";
import Link from "@mui/joy/Link";
import Typography from "@mui/joy/Typography";

import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";

import Layout from "@/components/Home/Layout";
import OrderList from "@/components/Home/OrderList";
import OrderTable from "@/components/Home/OrderTable";
import Head from "next/head";

import CircularProgress from "@mui/joy/CircularProgress";
import Stack from "@mui/joy/Stack";
import { Fragment, useEffect } from "react";

import useSWR from "swr";

import fetcher from "@/components/fetcher";
import { getURL } from "@/components/utils";

import Alert from "@/components/Alert";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import { useRouter } from "next/navigation";

import usePermissionContext from "@/components/Home/permissionContext/usePermission";
import CountUp from "react-countup";
import ExportUsers from "@/components/Registros/ExportUsers";

export default function Registros({ children }) {
    const { isLoading: permissionIsLoading, hasPermission } =
        usePermissionContext();

    const { data: inscritos, isLoading: inscritosIsLoading } = useSWR(
        getURL("api/usuarios/estadisticas"),
        fetcher,
        { revalidateOnMount: true }
    );
    const router = useRouter();

    const { data, isLoading } = useSWR(
        getURL("/api/usuarios/inscritos"),
        fetcher
    );

    const onView = (id) => {
        router.push(`/registros/${id}`, undefined, { shallow: true });
    };

    useEffect(() => {
        if (!permissionIsLoading && !hasPermission("usuario.view_persona")) {
            router.replace("/");
        }
    }, [permissionIsLoading, hasPermission]);

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
                    // mb: 1,
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
                        Registros
                    </Typography>
                    <ExportUsers />
                </Stack>
                <Stack direction="row" spacing={1.25 / 2}>
                    <Card variant="outlined">
                        <CardContent>
                            <Typography level="title-md">
                                Personas registradas
                            </Typography>
                            <Stack
                                flex={1}
                                justifyContent="center"
                                alignItems="center"
                            >
                                <Typography level="h3">
                                    {inscritosIsLoading ? (
                                        <CircularProgress size="sm" />
                                    ) : (
                                        <CountUp
                                            end={inscritos?.total}
                                            duration={1.25}
                                            separator="."
                                        />
                                    )}
                                </Typography>
                            </Stack>
                        </CardContent>
                    </Card>
                    <Card variant="outlined">
                        <CardContent>
                            <Typography level="title-md">
                                Personas validadas (
                                {inscritos?.percentage ? (
                                    <CountUp
                                        end={inscritos?.percentage}
                                        decimals={2}
                                        duration={0.25}
                                        separator="."
                                    />
                                ) : (
                                    0
                                )}
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
                                    <Typography level="h3">
                                        {inscritosIsLoading ? (
                                            <CircularProgress size="sm" />
                                        ) : (
                                            <CountUp
                                                end={inscritos?.validated}
                                                duration={1.25}
                                                separator="."
                                            />
                                        )}
                                    </Typography>
                                </Stack>
                            </Stack>
                        </CardContent>
                    </Card>
                </Stack>
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
