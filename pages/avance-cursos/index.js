import Box from "@mui/joy/Box";
import Breadcrumbs from "@mui/joy/Breadcrumbs";
import CircularProgress from "@mui/joy/CircularProgress";
import Link from "@mui/joy/Link";
import Typography from "@mui/joy/Typography";

import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";

import Stack from "@mui/material/Stack";

import Layout from "@/components/Home/Layout";

import Head from "next/head";

import dayjs from "dayjs";
import "dayjs/locale/es";

import { debounce } from "lodash";

import { useCallback, useEffect, useRef, useState } from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";

import useSWR from "swr";

import FiltrarCursos from "@/components/Cursos/FiltrarCursos";
import { filter } from "@/components/Cursos/functions";
import TablaAvances from "@/components/Pages/Avances/TablaAvances";
import UploadAvances from "@/components/Pages/Avances/UploadAvances";
import { getURL } from "@/components/utils";
import useClient from "@/hooks/useClient";
import { jsonFilter } from "@/utils/json";
import { Button } from "@mui/joy";
import getTimeout from "@/utils/timeout";
import usePermissionContext from "@/components/Home/permissionContext/usePermission";
import usePermission from "@/hooks/usePermission";

dayjs.locale("es");

// preload(getURL("/api/moodle/reporte/2"), fetcher);
// preload(getURL("/api/moodle/reporte/7"), fetcher);
// preload(getURL("/api/moodle/reporte/11"), fetcher);
// preload(getURL("/api/moodle/reporte/12"), fetcher);

export default function Page() {
    const methods = useForm();
    const { control, reset } = methods;

    const values = useWatch({ control });

    const modulo_id = useWatch({ control, name: "module", defaultValue: 2 });

    const { data, isLoading } = useSWR(
        getURL("/api/moodle/reporte/" + modulo_id)
    );

    const { isLoading: permissionIsLoading, hasPermission } =
        usePermissionContext();

    const [mounted, setMounted] = useState(false);
    const [filtering, setFiltering] = useState(true);
    const [rows, setRows] = useState({
        chunked: [],
        pages: 0,
    });

    useEffect(() => {
        setMounted(true);
    }, []);

    const timeout = useRef();

    const debounceFilter = useCallback(
        debounce((d, f) => {
            const startTime = dayjs();
            filter(d, f, setRows);

            if (!timeout.current)
                timeout.current = setTimeout(() => {
                    setFiltering(false);
                    timeout.current = null;
                }, getTimeout(startTime, 750));
        }, 300),
        []
    );

    useEffect(() => {
        if (mounted && data) {
            setFiltering(true);
            const filtered = jsonFilter(values, ["module"]);
            debounceFilter(data.resultados ?? [], filtered);
        }
    }, [values, mounted, data]);

    useEffect(() => {
        setFiltering(true);
    }, [modulo_id]);

    useClient(() => {
        setMounted(true);
        reset({ module: 2, modulo_completado: true });
    });

    usePermission("moodle.view_actividadescompletadas");

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
                <title>Avance de cursos - Consulta previa</title>
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
                {hasPermission("moodle.add_actividadescompletadas") && (
                    <UploadAvances />
                )}
            </Box>
            <FormProvider {...methods}>
                <FiltrarCursos />
                {isLoading ? (
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
                        data={rows}
                        actividades={data.actividades}
                        // isValidating={isValidating}
                        isFiltering={filtering}
                    />
                )}
            </FormProvider>
        </Layout>
    );
}
