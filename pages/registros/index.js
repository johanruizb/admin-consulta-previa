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

import { CircularProgress, Stack } from "@mui/joy";
import { Fragment } from "react";

import useSWR from "swr";
import fetcher from "@/components/fetcher";
import DevWrapper from "@/components/Wrapper/DevWrapper";
import { useRouter } from "next/navigation";
import { getURL } from "@/components/utils";

export default function Registros({ children }) {
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
                <Typography level="h2" component="h1">
                    Personas registradas
                </Typography>
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
                    <OrderList />
                </Fragment>
            )}
            {children}
        </Layout>
    );
}
