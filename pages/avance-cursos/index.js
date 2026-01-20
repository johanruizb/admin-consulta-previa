import FiltrarCursos from "@/components/Cursos/FiltrarCursos";
import Layout from "@/components/Home/Layout";
import usePermissionContext from "@/components/Home/permissionContext/usePermission";
import ExportAvances from "@/components/Pages/Avances/ExportarAvances";
import UploadAvances from "@/components/Pages/Avances/UploadAvances";
import TablaAvancesV2 from "@/components/Pages/TablaAvancesV2";
import DevWrapper from "@/components/Wrapper/DevWrapper";
import useClient from "@/hooks/useClient";
import usePermission from "@/hooks/usePermission";
import { useAvancesForm } from "@/hooks/useAvancesForm";
import { useAvancesData } from "@/hooks/useAvancesData";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import ReplayIcon from "@mui/icons-material/Replay";
import Box from "@mui/joy/Box";
import Breadcrumbs from "@mui/joy/Breadcrumbs";
import Button from "@mui/joy/Button";
import CircularProgress from "@mui/joy/CircularProgress";
import IconButton from "@mui/joy/IconButton";
import Link from "@mui/joy/Link";
import Tooltip from "@mui/joy/Tooltip";
import Typography from "@mui/joy/Typography";
import Stack from "@mui/material/Stack";
import { useRenderCount } from "@uidotdev/usehooks";
import Head from "next/head";
import { useRouter } from "next/navigation";
import { useState, useCallback } from "react";
import { FormProvider } from "react-hook-form";

export default function Avances({ children }) {
    const router = useRouter();
    const count = useRenderCount();

    // Hook personalizado para el manejo del formulario
    const { methods, formValues } = useAvancesForm();

    // Hook personalizado para la gestión de datos
    const { data, isLoading, isValidating, refreshData } =
        useAvancesData(formValues);

    const [filter, setFilter] = useState();
    const [mounted, setMounted] = useState(false);

    const { isLoading: permissionIsLoading, hasPermission } =
        usePermissionContext();

    useClient(() => {
        setMounted(true);
    });

    usePermission("moodle.view_actividadescompletadas");

    // Función para navegar a detalles (memoizada para optimización)
    const handleView = useCallback(
        (id) => {
            router.push(`/avance-cursos/${id}`, undefined, { shallow: true });
        },
        [router],
    );

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

    console.log(JSON.stringify(formValues, null, 2));

    return (
        <Layout>
            {children}
            <Head>
                <title>Avance de cursos - Consulta previa</title>
            </Head>
            <DevWrapper>
                <Box
                    sx={{
                        position: "fixed",
                        bottom: 2,
                        left: 2,
                    }}
                >
                    <Typography
                        variant="h1"
                        component="h1"
                        sx={{ fontSize: 24, fontWeight: 500 }}
                    >
                        {count}
                    </Typography>
                </Box>
            </DevWrapper>
            <Tooltip
                title={
                    isLoading
                        ? "Cargando información..."
                        : isValidating
                          ? "Validando información..."
                          : // : filtering
                            // ? "Filtrando información..."
                            "Recargar información"
                }
                arrow
            >
                <Box
                    sx={{
                        position: "fixed",
                        bottom: 16,
                        right: 16,
                        zIndex: 1000,
                    }}
                >
                    <IconButton
                        variant="solid"
                        color="primary"
                        sx={{
                            width: 56,
                            height: 56,
                            borderRadius: "50%",
                        }}
                        onClick={refreshData}
                        loading={isLoading || isValidating}
                        size="lg"
                    >
                        <ReplayIcon fontSize="large" />
                    </IconButton>
                </Box>
            </Tooltip>
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
                        Avance de cursos
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
                    Avance de cursos
                </Typography>
                <FormProvider {...methods}>
                    <Stack
                        spacing={1}
                        direction={{ xs: "column", sm: "row" }}
                        alignItems="center"
                    >
                        <Stack spacing={1} direction="row">
                            <ExportAvances />
                        </Stack>
                    </Stack>
                </FormProvider>
            </Box>
            <FormProvider {...methods}>
                <FiltrarCursos
                    data={data}
                    filter={filter}
                    setFilter={setFilter}
                />
                {isLoading || permissionIsLoading ? (
                    <Stack
                        justifyContent="center"
                        alignContent="center"
                        alignItems="center"
                        width="100%"
                        height="100%"
                    >
                        <Button
                            variant="plain"
                            startDecorator={<CircularProgress />}
                            sx={(theme) => ({
                                p: 1,
                                color: "black !important",
                                [theme.getColorSchemeSelector("dark")]: {
                                    color: "white !important",
                                },
                            })}
                            size="lg"
                            disabled
                        >
                            Cargando información...
                        </Button>
                    </Stack>
                ) : (
                    <TablaAvancesV2
                        data={data}
                        filter={filter}
                        hasPermission={hasPermission}
                        onView={handleView}
                    />
                )}
            </FormProvider>
        </Layout>
    );
}
