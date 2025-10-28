"use client";

import fetcher from "@/components/fetcher";
import Layout from "@/components/Home/Layout";
import OrderList from "@/components/Home/OrderList";
import OrderTable from "@/components/Home/OrderTable";
import ExportUsers from "@/components/Registros/ExportUsers";
import UserSummary from "@/components/Registros/UserSummary";
import { getURL } from "@/components/utils";
import { useCiclo } from "@/contexts/CicloContext";
import usePermission from "@/hooks/usePermission";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import Box from "@mui/joy/Box";
import Breadcrumbs from "@mui/joy/Breadcrumbs";
import CircularProgress from "@mui/joy/CircularProgress";
import Link from "@mui/joy/Link";
import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";
import { useMediaQuery } from "@mui/material";
import Head from "next/head";
import { useRouter } from "next/navigation";
import useSWR from "swr";

export default function Registros({ children }) {
    const smallViewport = useMediaQuery((theme) =>
        theme.breakpoints.down("sm")
    );

    const router = useRouter();
    const { selectedCicloId } = useCiclo();

    const { data, isLoading } = useSWR(
        getURL(`/api/usuarios/inscritos?ciclo_id=${selectedCicloId}`),
        fetcher
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
                <Stack
                    flex={1}
                    sx={{
                        height: "100%",
                    }}
                >
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
            ) : smallViewport ? (
                <OrderList data={data} onView={onView} />
            ) : (
                <OrderTable data={data} onView={onView} />
            )}
            {children}
        </Layout>
    );
}
