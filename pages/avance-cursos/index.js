import Box from "@mui/joy/Box";
import Breadcrumbs from "@mui/joy/Breadcrumbs";
import Button from "@mui/joy/Button";
import CircularProgress from "@mui/joy/CircularProgress";
import IconButton from "@mui/joy/IconButton";
import Link from "@mui/joy/Link";
import Tooltip from "@mui/joy/Tooltip";
import Typography from "@mui/joy/Typography";

import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import ReplayIcon from "@mui/icons-material/Replay";

import Stack from "@mui/material/Stack";

import Head from "next/head";
import { useRouter } from "next/navigation";

import dayjs from "dayjs";
import "dayjs/locale/es";

import { useRenderCount } from "@uidotdev/usehooks";
import { useEffect, useState } from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";

import useSWR from "swr";

import FiltrarCursos from "@/components/Cursos/FiltrarCursos";
import Layout from "@/components/Home/Layout";
import usePermissionContext from "@/components/Home/permissionContext/usePermission";
import ExportAvances from "@/components/Pages/Avances/ExportarAvances";
import TablaAvances from "@/components/Pages/Avances/TablaAvances";
import UploadAvances from "@/components/Pages/Avances/UploadAvances";
import { getURL } from "@/components/utils";
import DevWrapper from "@/components/Wrapper/DevWrapper";
import useClient from "@/hooks/useClient";
import usePermission from "@/hooks/usePermission";

dayjs.locale("es");

// preload(getURL("/api/moodle/reporte/2"), fetcher);
// preload(getURL("/api/moodle/reporte/7"), fetcher);
// preload(getURL("/api/moodle/reporte/11"), fetcher);
// preload(getURL("/api/moodle/reporte/12"), fetcher);

export default function Avances({ children }) {
    const router = useRouter();
    const count = useRenderCount();
    const methods = useForm({
        defaultValues: {
            activity__module__course_id: 1,
            grupo_usuario: "all",
            activity__module_id: "all",
            user__ciudad_nac__state_id__country_id: "all",
            user__ciudad__state_id: "all",
            user__genero_id: "all",
            user__etnia: "all",
            user__tipo_cliente: "all",
            user__zona: "all",
            user__conectividad: "all",
            modulo_completado: "all",
        },
    });

    const { control, setValue } = methods;

    const values = useWatch({ control });
    // const {}

    const { data, isLoading, isValidating, mutate } = useSWR(
        [
            getURL("/api/moodle/reporte/resumen"),
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...values,
                }),
            },
        ],

        async (args) => {
            const res = await fetch(args[0], args[1]);
            return res.ok
                ? res.json()
                : Promise.reject({
                      status: res.status,
                      statusText: res.statusText,
                  });
        }
    );

    const [filter, setFilter] = useState();

    const { isLoading: permissionIsLoading, hasPermission } =
        usePermissionContext();

    const [mounted, setMounted] = useState(false);

    useClient(() => {
        setMounted(true);
    });

    usePermission("moodle.view_actividadescompletadas");

    const onView = (id) => {
        router.push(`/avance-cursos/${id}`, undefined, { shallow: true });
    };

    const [personas_sin_actividad, modulo_completado] = useWatch({
        control,
        name: ["personas_sin_actividad", "modulo_completado"],
    });

    useEffect(() => {
        if (
            personas_sin_actividad &&
            (modulo_completado !== "all" || modulo_completado === true)
        )
            setValue("modulo_completado", "all");
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [personas_sin_actividad, modulo_completado]);

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
                        onClick={() => {
                            mutate(undefined, {
                                validate: false,
                            });
                        }}
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
                    <Stack spacing={1}>
                        {hasPermission("moodle.add_actividadescompletadas") && (
                            <UploadAvances />
                        )}
                        <ExportAvances />
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
                    <TablaAvances
                        data={data}
                        filter={filter}
                        hasPermission={hasPermission}
                        onView={onView}
                    />
                )}
            </FormProvider>
        </Layout>
    );
}
