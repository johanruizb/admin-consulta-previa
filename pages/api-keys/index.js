"use client";

import fetcher from "@/components/fetcher";
import Layout from "@/components/Home/Layout";
import { getURL } from "@/components/utils";
import usePermission from "@/hooks/usePermission";
import AddIcon from "@mui/icons-material/Add";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DeleteIcon from "@mui/icons-material/Delete";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import Alert from "@mui/joy/Alert";
import Box from "@mui/joy/Box";
import Breadcrumbs from "@mui/joy/Breadcrumbs";
import Button from "@mui/joy/Button";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import Chip from "@mui/joy/Chip";
import CircularProgress from "@mui/joy/CircularProgress";
import DialogContent from "@mui/joy/DialogContent";
import DialogTitle from "@mui/joy/DialogTitle";
import Divider from "@mui/joy/Divider";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import IconButton from "@mui/joy/IconButton";
import Input from "@mui/joy/Input";
import Link from "@mui/joy/Link";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";
import Head from "next/head";
import { useSnackbar } from "notistack";
import { Fragment, useState } from "react";
import useSWR from "swr";

export default function APIKeys() {
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedApiKey, setSelectedApiKey] = useState(null);
    const [newApiKey, setNewApiKey] = useState({ name: "" });
    const [createdKeyData, setCreatedKeyData] = useState(null);
    const [showKey, setShowKey] = useState(false);

    const { enqueueSnackbar } = useSnackbar();

    // Verificar que el usuario es superusuario
    usePermission("is_superuser");

    const {
        data: apiKeys,
        isLoading,
        mutate,
    } = useSWR(getURL("/api/usuarios/api-keys"), fetcher);

    const handleCreateApiKey = async () => {
        try {
            const response = await fetch(
                getURL("/api/usuarios/api-keys/create"),
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(newApiKey),
                    credentials: "include",
                }
            );

            const result = await response.json();

            if (result.success) {
                setCreatedKeyData(result.data);
                setNewApiKey({ name: "" });
                setCreateModalOpen(false);
                mutate();
                enqueueSnackbar("API Key creada exitosamente", {
                    variant: "success",
                });
            } else {
                enqueueSnackbar(result.error || "Error al crear la API Key", {
                    variant: "error",
                });
            }
        } catch (error) {
            enqueueSnackbar("Error de conexión al crear la API Key", {
                variant: "error",
            });
        }
    };

    const handleDeleteApiKey = async () => {
        if (!selectedApiKey) return;

        try {
            const response = await fetch(
                getURL(`/api/usuarios/api-keys/${selectedApiKey.id}`),
                {
                    method: "DELETE",
                    credentials: "include",
                }
            );

            const result = await response.json();

            if (result.success) {
                setDeleteModalOpen(false);
                setSelectedApiKey(null);
                mutate();
                enqueueSnackbar(
                    result.message || "API Key eliminada exitosamente",
                    { variant: "success" }
                );
            } else {
                enqueueSnackbar(
                    result.error || "Error al eliminar la API Key",
                    { variant: "error" }
                );
            }
        } catch (error) {
            enqueueSnackbar("Error de conexión al eliminar la API Key", {
                variant: "error",
            });
        }
    };

    const handleToggleApiKey = async (apiKey) => {
        try {
            const response = await fetch(
                getURL(`/api/usuarios/api-keys/${apiKey.id}/toggle`),
                {
                    method: "PATCH",
                    credentials: "include",
                }
            );

            const result = await response.json();

            if (result.success) {
                mutate();
                enqueueSnackbar(
                    result.message || "Estado actualizado exitosamente",
                    { variant: "success" }
                );
            } else {
                enqueueSnackbar(result.error || "Error al cambiar el estado", {
                    variant: "error",
                });
            }
        } catch (error) {
            enqueueSnackbar("Error de conexión al cambiar el estado", {
                variant: "error",
            });
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        enqueueSnackbar("Copiado al portapapeles", { variant: "success" });
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("es-ES", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <Layout>
            <Head>
                <title>Gestión de API Keys - Consulta previa</title>
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
                        API Keys
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
                    Gestión de API Keys
                </Typography>
                <Button
                    startDecorator={<AddIcon />}
                    onClick={() => setCreateModalOpen(true)}
                >
                    Crear API Key
                </Button>
            </Box>

            {isLoading ? (
                <Stack
                    justifyContent="center"
                    alignContent="center"
                    alignItems="center"
                    width="100%"
                    height="200px"
                >
                    <CircularProgress />
                </Stack>
            ) : (
                <Fragment>
                    {createdKeyData && (
                        <Alert
                            variant="soft"
                            color="success"
                            sx={{ mb: 2 }}
                            endDecorator={
                                <Button
                                    size="sm"
                                    variant="soft"
                                    onClick={() => setCreatedKeyData(null)}
                                >
                                    Cerrar
                                </Button>
                            }
                        >
                            <Box>
                                <Typography level="title-sm" sx={{ mb: 1 }}>
                                    API Key creada exitosamente
                                </Typography>
                                <Typography level="body-sm">
                                    Guarda esta clave de forma segura. No podrás
                                    verla nuevamente.
                                </Typography>
                                <Box
                                    sx={{
                                        mt: 1,
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 1,
                                    }}
                                >
                                    <Typography
                                        level="body-sm"
                                        sx={{
                                            fontFamily: "monospace",
                                            bgcolor: "background.level1",
                                            p: 0.5,
                                            borderRadius: 1,
                                            wordBreak: "break-all",
                                        }}
                                    >
                                        {createdKeyData.key}
                                    </Typography>
                                    <IconButton
                                        size="sm"
                                        onClick={() =>
                                            copyToClipboard(createdKeyData.key)
                                        }
                                    >
                                        <ContentCopyIcon />
                                    </IconButton>
                                </Box>
                            </Box>
                        </Alert>
                    )}

                    <Stack spacing={2}>
                        {apiKeys?.data?.length === 0 ? (
                            <Card>
                                <CardContent
                                    sx={{ textAlign: "center", py: 4 }}
                                >
                                    <Typography level="body-lg" color="neutral">
                                        No hay API Keys configuradas
                                    </Typography>
                                    <Typography level="body-sm" color="neutral">
                                        Crea una nueva API Key para comenzar
                                    </Typography>
                                </CardContent>
                            </Card>
                        ) : (
                            apiKeys?.data?.map((apiKey) => (
                                <Card key={apiKey.id} variant="outlined">
                                    <CardContent>
                                        <Box
                                            sx={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "flex-start",
                                                mb: 1,
                                            }}
                                        >
                                            <Box>
                                                <Typography
                                                    level="title-md"
                                                    sx={{ mb: 0.5 }}
                                                >
                                                    {apiKey.name || "Sin nombre"}
                                                </Typography>
                                                <Typography
                                                    level="body-sm"
                                                    color="neutral"
                                                >
                                                    Prefijo: {apiKey.prefix}
                                                </Typography>
                                                <Typography
                                                    level="body-sm"
                                                    color="neutral"
                                                >
                                                    Fecha:{" "}
                                                    {formatDate(apiKey.created)}
                                                </Typography>
                                            </Box>
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    gap: 1,
                                                    alignItems: "center",
                                                }}
                                            >
                                                <Chip
                                                    color={
                                                        !apiKey.revoked
                                                            ? "success"
                                                            : "neutral"
                                                    }
                                                    size="sm"
                                                >
                                                    {!apiKey.revoked
                                                        ? "Activa"
                                                        : "Revocada"}
                                                </Chip>
                                                <IconButton
                                                    size="sm"
                                                    color={
                                                        !apiKey.revoked
                                                            ? "warning"
                                                            : "success"
                                                    }
                                                    onClick={() =>
                                                        handleToggleApiKey(
                                                            apiKey
                                                        )
                                                    }
                                                >
                                                    {!apiKey.revoked ? (
                                                        <ToggleOnIcon />
                                                    ) : (
                                                        <ToggleOffIcon />
                                                    )}
                                                </IconButton>
                                                <IconButton
                                                    size="sm"
                                                    color="danger"
                                                    onClick={() => {
                                                        setSelectedApiKey(
                                                            apiKey
                                                        );
                                                        setDeleteModalOpen(
                                                            true
                                                        );
                                                    }}
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Box>
                                        </Box>
                                        <Box
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 1,
                                            }}
                                        >
                                            <Typography
                                                level="body-sm"
                                                sx={{
                                                    fontFamily: "monospace",
                                                }}
                                                color="neutral"
                                            >
                                                {apiKey.prefix}••••••••••••••••••
                                            </Typography>
                                        </Box>
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </Stack>
                </Fragment>
            )}

            {/* Modal para crear API Key */}
            <Modal
                open={createModalOpen}
                onClose={() => setCreateModalOpen(false)}
            >
                <ModalDialog>
                    <DialogTitle>Crear nueva API Key</DialogTitle>
                    <DialogContent>
                        <Stack spacing={2}>
                            <FormControl>
                                <FormLabel>Nombre</FormLabel>
                                <Input
                                    placeholder="Nombre descriptivo para la API Key"
                                    value={newApiKey.name}
                                    onChange={(e) =>
                                        setNewApiKey({
                                            ...newApiKey,
                                            name: e.target.value,
                                        })
                                    }
                                />
                            </FormControl>
                        </Stack>
                    </DialogContent>
                    <Box
                        sx={{
                            display: "flex",
                            gap: 1,
                            justifyContent: "flex-end",
                            pt: 2,
                        }}
                    >
                        <Button
                            variant="plain"
                            color="neutral"
                            onClick={() => setCreateModalOpen(false)}
                        >
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleCreateApiKey}
                            disabled={!newApiKey.name.trim()}
                        >
                            Crear
                        </Button>
                    </Box>
                </ModalDialog>
            </Modal>

            {/* Modal para confirmar eliminación */}
            <Modal
                open={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
            >
                <ModalDialog variant="outlined" role="alertdialog">
                    <DialogTitle>Confirmar eliminación</DialogTitle>
                    <Divider />
                    <DialogContent>
                        <Typography level="body-md">
                            ¿Estás seguro de que quieres eliminar la API Key
                            &ldquo;{selectedApiKey?.name}&rdquo;?
                        </Typography>
                        <Typography level="body-sm" color="warning">
                            Esta acción no se puede deshacer y todas las
                            aplicaciones que usen esta API Key dejarán de
                            funcionar.
                        </Typography>
                    </DialogContent>
                    <Box
                        sx={{
                            display: "flex",
                            gap: 1,
                            justifyContent: "flex-end",
                            pt: 2,
                        }}
                    >
                        <Button
                            variant="plain"
                            color="neutral"
                            onClick={() => setDeleteModalOpen(false)}
                        >
                            Cancelar
                        </Button>
                        <Button color="danger" onClick={handleDeleteApiKey}>
                            Eliminar
                        </Button>
                    </Box>
                </ModalDialog>
            </Modal>
        </Layout>
    );
}
