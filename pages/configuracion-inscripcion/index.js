"use client";

import fetcher from "@/components/fetcher";
import Layout from "@/components/Home/Layout";
import { getURL } from "@/components/utils";
import usePermission from "@/hooks/usePermission";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import PauseCircleRoundedIcon from "@mui/icons-material/PauseCircleRounded";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import Box from "@mui/joy/Box";
import Breadcrumbs from "@mui/joy/Breadcrumbs";
import Button from "@mui/joy/Button";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import Chip from "@mui/joy/Chip";
import CircularProgress from "@mui/joy/CircularProgress";
import FormControl from "@mui/joy/FormControl";
import FormHelperText from "@mui/joy/FormHelperText";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import Link from "@mui/joy/Link";
import Option from "@mui/joy/Option";
import Select from "@mui/joy/Select";
import Sheet from "@mui/joy/Sheet";
import Stack from "@mui/joy/Stack";
import Switch from "@mui/joy/Switch";
import Typography from "@mui/joy/Typography";
import Head from "next/head";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { AnimatePresence, motion } from "motion/react";

const ESTADO_CONFIG = {
    abierto: {
        color: "success",
        label: "Abierto",
        icon: <CheckCircleRoundedIcon />,
    },
    lista_espera: {
        color: "warning",
        label: "Lista de espera",
        icon: <PauseCircleRoundedIcon />,
    },
    cerrado: {
        color: "danger",
        label: "Cerrado",
        icon: <CancelRoundedIcon />,
    },
};

const ESTADO_OPTIONS = [
    { value: "abierto", label: "Abierto" },
    { value: "lista_espera", label: "Lista de espera" },
    { value: "cerrado", label: "Cerrado" },
];

const ESTADO_POST_CIERRE_OPTIONS = [
    { value: "lista_espera", label: "Lista de espera" },
    { value: "cerrado", label: "Cerrado" },
];

function toDatetimeLocal(isoStr) {
    if (!isoStr) return "";
    const date = new Date(isoStr);
    const offset = date.getTimezoneOffset();
    const local = new Date(date.getTime() - offset * 60000);
    return local.toISOString().slice(0, 16);
}

function fromDatetimeLocal(localStr) {
    if (!localStr) return null;
    return new Date(localStr).toISOString();
}

const motionProps = {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -8 },
    transition: { duration: 0.2 },
};

export default function ConfiguracionInscripcion() {
    usePermission("inscripcion.view_configuracioninscripcion");

    const { enqueueSnackbar } = useSnackbar();
    const [saving, setSaving] = useState(false);

    const [form, setForm] = useState({
        estado: "cerrado",
        usar_fechas: false,
        fecha_apertura: "",
        fecha_cierre: "",
        estado_post_cierre: "lista_espera",
    });

    const {
        data: config,
        isLoading,
        mutate,
    } = useSWR(
        getURL("/api/inscripcion/configuracion-inscripcion"),
        fetcher,
    );

    useEffect(() => {
        if (config) {
            setForm({
                estado: config.estado ?? "cerrado",
                usar_fechas: config.usar_fechas ?? false,
                fecha_apertura: toDatetimeLocal(config.fecha_apertura),
                fecha_cierre: toDatetimeLocal(config.fecha_cierre),
                estado_post_cierre: config.estado_post_cierre ?? "lista_espera",
            });
        }
    }, [config]);

    const handleSave = async () => {
        setSaving(true);
        try {
            const body = {
                estado: form.estado,
                usar_fechas: form.usar_fechas,
                fecha_apertura: form.usar_fechas
                    ? fromDatetimeLocal(form.fecha_apertura)
                    : null,
                fecha_cierre: form.usar_fechas
                    ? fromDatetimeLocal(form.fecha_cierre)
                    : null,
                estado_post_cierre: form.estado_post_cierre,
            };

            const response = await fetch(
                getURL("/api/inscripcion/configuracion-inscripcion"),
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(body),
                    credentials: "include",
                },
            );

            const result = await response.json();

            if (response.ok) {
                mutate(result, false);
                enqueueSnackbar("Configuración guardada", {
                    variant: "success",
                });
            } else {
                enqueueSnackbar(
                    result.message || "Error al guardar la configuración",
                    { variant: "error" },
                );
            }
        } catch {
            enqueueSnackbar("Error de conexión", { variant: "error" });
        } finally {
            setSaving(false);
        }
    };

    const estadoEfectivo = config?.estado_efectivo ?? "cerrado";
    const estadoInfo = ESTADO_CONFIG[estadoEfectivo] ?? ESTADO_CONFIG.cerrado;

    return (
        <Layout>
            <Head>
                <title>
                    Configuración de inscripción - Consulta previa
                </title>
            </Head>

            <Box sx={{ display: "flex", alignItems: "center" }}>
                <Breadcrumbs
                    size="sm"
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
                        Configuración de inscripción
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
                    Configuración de inscripción
                </Typography>
            </Box>

            {isLoading ? (
                <Stack
                    justifyContent="center"
                    alignItems="center"
                    sx={{ minHeight: 200 }}
                >
                    <CircularProgress />
                </Stack>
            ) : (
                <Stack spacing={2.5}>
                    {/* Estado efectivo */}
                    <Sheet
                        variant="soft"
                        color={estadoInfo.color}
                        sx={{
                            p: 2.5,
                            borderRadius: "lg",
                            display: "flex",
                            alignItems: "center",
                            gap: 2,
                        }}
                    >
                        <Chip
                            variant="solid"
                            color={estadoInfo.color}
                            size="lg"
                            startDecorator={estadoInfo.icon}
                            sx={{ fontSize: "sm", px: 1.5 }}
                        >
                            {estadoInfo.label}
                        </Chip>
                        <Box>
                            <Typography level="title-md">
                                Estado actual del formulario
                            </Typography>
                            <Typography level="body-sm">
                                {form.usar_fechas
                                    ? "Controlado por fechas"
                                    : "Controlado manualmente"}
                            </Typography>
                        </Box>
                    </Sheet>

                    {/* Modo de control */}
                    <Card variant="outlined">
                        <CardContent sx={{ gap: 2.5 }}>
                            <Typography level="title-lg">
                                Modo de control
                            </Typography>

                            <FormControl
                                orientation="horizontal"
                                sx={{
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                }}
                            >
                                <Box>
                                    <FormLabel>
                                        Usar control por fechas
                                    </FormLabel>
                                    <FormHelperText>
                                        {form.usar_fechas
                                            ? "El estado se calcula automáticamente según las fechas configuradas"
                                            : "El estado se controla manualmente con el selector inferior"}
                                    </FormHelperText>
                                </Box>
                                <Switch
                                    checked={form.usar_fechas}
                                    onChange={(e) =>
                                        setForm((prev) => ({
                                            ...prev,
                                            usar_fechas: e.target.checked,
                                        }))
                                    }
                                />
                            </FormControl>
                        </CardContent>
                    </Card>

                    {/* Configuración según modo */}
                    <AnimatePresence mode="wait">
                        {form.usar_fechas ? (
                            <motion.div key="fechas" {...motionProps}>
                                <Card variant="outlined">
                                    <CardContent sx={{ gap: 2.5 }}>
                                        <Typography level="title-lg">
                                            Configuración por fechas
                                        </Typography>

                                        <Stack
                                            direction={{
                                                xs: "column",
                                                sm: "row",
                                            }}
                                            spacing={2}
                                        >
                                            <FormControl sx={{ flex: 1 }}>
                                                <FormLabel>
                                                    Fecha de apertura
                                                </FormLabel>
                                                <Input
                                                    type="datetime-local"
                                                    value={
                                                        form.fecha_apertura
                                                    }
                                                    onChange={(e) =>
                                                        setForm((prev) => ({
                                                            ...prev,
                                                            fecha_apertura:
                                                                e.target.value,
                                                        }))
                                                    }
                                                    slotProps={{
                                                        input: {
                                                            style: {
                                                                colorScheme:
                                                                    "auto",
                                                            },
                                                        },
                                                    }}
                                                />
                                                <FormHelperText>
                                                    Las inscripciones se
                                                    abren automáticamente
                                                    en esta fecha
                                                </FormHelperText>
                                            </FormControl>

                                            <FormControl sx={{ flex: 1 }}>
                                                <FormLabel>
                                                    Fecha de cierre
                                                </FormLabel>
                                                <Input
                                                    type="datetime-local"
                                                    value={form.fecha_cierre}
                                                    onChange={(e) =>
                                                        setForm((prev) => ({
                                                            ...prev,
                                                            fecha_cierre:
                                                                e.target.value,
                                                        }))
                                                    }
                                                    slotProps={{
                                                        input: {
                                                            style: {
                                                                colorScheme:
                                                                    "auto",
                                                            },
                                                        },
                                                    }}
                                                />
                                                <FormHelperText>
                                                    Las inscripciones se
                                                    cierran automáticamente
                                                    en esta fecha
                                                </FormHelperText>
                                            </FormControl>
                                        </Stack>

                                        <FormControl>
                                            <FormLabel>
                                                Estado después del cierre
                                            </FormLabel>
                                            <Select
                                                value={
                                                    form.estado_post_cierre
                                                }
                                                onChange={(_, val) =>
                                                    setForm((prev) => ({
                                                        ...prev,
                                                        estado_post_cierre:
                                                            val,
                                                    }))
                                                }
                                            >
                                                {ESTADO_POST_CIERRE_OPTIONS.map(
                                                    (opt) => (
                                                        <Option
                                                            key={opt.value}
                                                            value={opt.value}
                                                        >
                                                            {opt.label}
                                                        </Option>
                                                    ),
                                                )}
                                            </Select>
                                            <FormHelperText>
                                                Estado al que se transiciona
                                                después de la fecha de cierre
                                            </FormHelperText>
                                        </FormControl>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ) : (
                            <motion.div key="manual" {...motionProps}>
                                <Card variant="outlined">
                                    <CardContent sx={{ gap: 2.5 }}>
                                        <Typography level="title-lg">
                                            Estado manual
                                        </Typography>

                                        <FormControl>
                                            <FormLabel>
                                                Estado del formulario
                                            </FormLabel>
                                            <Select
                                                value={form.estado}
                                                onChange={(_, val) =>
                                                    setForm((prev) => ({
                                                        ...prev,
                                                        estado: val,
                                                    }))
                                                }
                                            >
                                                {ESTADO_OPTIONS.map(
                                                    (opt) => (
                                                        <Option
                                                            key={opt.value}
                                                            value={opt.value}
                                                        >
                                                            {opt.label}
                                                        </Option>
                                                    ),
                                                )}
                                            </Select>
                                            <FormHelperText>
                                                Controla directamente si el
                                                formulario de inscripción está
                                                abierto, en lista de espera o
                                                cerrado
                                            </FormHelperText>
                                        </FormControl>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Guardar */}
                    <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                        <Button
                            startDecorator={<SaveRoundedIcon />}
                            loading={saving}
                            onClick={handleSave}
                        >
                            Guardar
                        </Button>
                    </Box>
                </Stack>
            )}
        </Layout>
    );
}
