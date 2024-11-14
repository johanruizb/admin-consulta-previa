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
import usePermissionContext from "@/components/Home/permissionContext/usePermission";
import TablaAvances from "@/components/Pages/Avances/TablaAvances";
import UploadAvances from "@/components/Pages/Avances/UploadAvances";
import { getURL } from "@/components/utils";
import useClient from "@/hooks/useClient";
import usePermission from "@/hooks/usePermission";
import { jsonFilter } from "@/utils/json";
import getTimeout from "@/utils/timeout";
import Button from "@mui/joy/Button";
import { useRenderCount } from "@uidotdev/usehooks";
import fetcher from "@/components/fetcher";
import DevWrapper from "@/components/Wrapper/DevWrapper";

dayjs.locale("es");

// preload(getURL("/api/moodle/reporte/2"), fetcher);
// preload(getURL("/api/moodle/reporte/7"), fetcher);
// preload(getURL("/api/moodle/reporte/11"), fetcher);
// preload(getURL("/api/moodle/reporte/12"), fetcher);

export default function Page() {
    const count = useRenderCount();
    const methods = useForm({
        defaultValues: {
            user__ciudad_nac__state_id__country_id: "all",
            user__ciudad__state_id: "all",
            activity__module_id: 2,
            modulo_completado: "all",
        },
    });

    const { control, reset } = methods;

    const values = useWatch({ control });

    const modulo_id = useWatch({ control, name: "module", defaultValue: 2 });

    const { data, isLoading } = useSWR(
        [
            getURL("/api/moodle/reporte/" + modulo_id),
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...values,
                    modulo_completado: undefined,
                }),
            },
        ],

        async (args) => {
            // console.log("args", args[0], args[1]);
            const res = await fetch(args[0], args[1]);
            return res.ok
                ? res.json()
                : Promise.reject({
                      status: res.status,
                      statusText: res.statusText,
                  });
        }
    );

    const { hasPermission } = usePermissionContext();

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
            debounceFilter(data?.resultados ?? [], filtered);
        } else if (data === undefined) {
            setFiltering(true);
        }
    }, [values, data]);

    useEffect(() => {
        setFiltering(true);
    }, [modulo_id]);

    useClient(() => {
        setMounted(true);
        // reset({ activity__module_id: 2, modulo_completado: "all" });
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

    // console.log("data", data);

    return (
        <Layout>
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
                        actividades={data?.actividades ?? []}
                        // isValidating={isValidating}
                        isFiltering={filtering}
                    />
                )}
            </FormProvider>
        </Layout>
    );
}
