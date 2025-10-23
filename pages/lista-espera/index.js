"use client";

import fetcher from "@/components/fetcher";
import Layout from "@/components/Home/Layout";
import OrderList from "@/components/Home/OrderList";
import EsperaSummary from "@/components/Pages/Espera/Summary";
import ExportEspera from "@/components/Pages/Espera/ExportEspera";
import { getURL } from "@/components/utils";
import { useCiclo } from "@/contexts/CicloContext";
import CicloSelector from "@/components/Ciclos/CicloSelector";
import usePermission from "@/hooks/usePermission";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import Box from "@mui/joy/Box";
import Breadcrumbs from "@mui/joy/Breadcrumbs";
import CircularProgress from "@mui/joy/CircularProgress";
import Link from "@mui/joy/Link";
import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";
import Head from "next/head";
import { useRouter } from "next/navigation";
import { Fragment } from "react";
import useSWR from "swr";
import TablaEspera from "../../components/Pages/Espera/TablaEspera";

export default function Registros({ children }) {
    const router = useRouter();
    const { selectedCicloId } = useCiclo();

    // Nota: La lista de espera es global, no filtrada por ciclo
    // pero mantenemos la integración del contexto para consistencia UI
    const { data, isLoading } = useSWR(
        selectedCicloId
            ? getURL(`/api/usuarios/espera?ciclo_id=${selectedCicloId}`)
            : null,
        fetcher,
    );

    const onView = (id) => {
        router.push(`/registros/${id}`, undefined, { shallow: true });
    };

    usePermission("usuario.view_persona");

    return (
        <Layout>
            <Head>
                <title>Personas en espera - Consulta previa</title>
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
                        Lista de espera
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
                        Lista de espera
                    </Typography>
                    <ExportEspera />
                </Stack>
                <Stack flex={1}>
                    <EsperaSummary />
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
                    <TablaEspera data={data} onView={onView} />
                    <OrderList data={data} onView={onView} />
                </Fragment>
            )}
            {children}
        </Layout>
    );
}
