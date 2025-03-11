"use client";

import Box from "@mui/joy/Box";
import Breadcrumbs from "@mui/joy/Breadcrumbs";
import Link from "@mui/joy/Link";
import Typography from "@mui/joy/Typography";

import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
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
import { getURL } from "@/components/utils";

import { useRouter } from "next/navigation";

import ExportUsers from "@/components/Registros/ExportUsers";
import UserSummary from "@/components/Registros/UserSummary";
import usePermission from "@/hooks/usePermission";

export default function Registros({ children }) {
    const router = useRouter();

    const { data, isLoading } = useSWR(
        getURL("/api/usuarios/inscritos"),
        fetcher,
    );

    const onView = (id) => {
        router.push(`/registros/${id}`, undefined, { shallow: true });
    };

    usePermission("usuario.view_persona");

    return (
        <Layout>
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
                <Stack flex={1}>
                    <UserSummary />
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
