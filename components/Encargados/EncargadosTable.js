"use client";

import { memo, useCallback, useState } from "react";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Chip from "@mui/joy/Chip";
import IconButton from "@mui/joy/IconButton";
import Sheet from "@mui/joy/Sheet";
import Skeleton from "@mui/joy/Skeleton";
import Stack from "@mui/joy/Stack";
import Table from "@mui/joy/Table";
import Typography from "@mui/joy/Typography";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import PersonIcon from "@mui/icons-material/Person";
import { useSnackbar } from "notistack";
import EncargadoSelector from "./EncargadoSelector";
import { EncargadoBadgeInline } from "./EncargadoBadge";

/**
 * Tabla de grupos con gestión de encargados.
 * Muestra grupos de un curso con sus encargados asignados.
 */
const EncargadosTable = memo(function EncargadosTable({
    grupos = [],
    encargadosPorGrupo = {},
    isLoading = false,
    isPending = false,
    onAsignar,
    onRemover,
    disabled = false,
}) {
    const { enqueueSnackbar } = useSnackbar();
    const [editingGrupo, setEditingGrupo] = useState(null);
    const [selectedUsuario, setSelectedUsuario] = useState(null);

    const handleAsignar = useCallback(
        async (grupoId) => {
            if (!selectedUsuario) {
                enqueueSnackbar("Selecciona un usuario", {
                    variant: "warning",
                });
                return;
            }

            try {
                await onAsignar({ grupoId, usuarioId: selectedUsuario.id });
                enqueueSnackbar("Encargado asignado exitosamente", {
                    variant: "success",
                });
                setEditingGrupo(null);
                setSelectedUsuario(null);
            } catch (error) {
                enqueueSnackbar(error.message || "Error al asignar encargado", {
                    variant: "error",
                });
            }
        },
        [selectedUsuario, onAsignar, enqueueSnackbar],
    );

    const handleRemover = useCallback(
        async (encargadoId, nombreEncargado) => {
            try {
                await onRemover(encargadoId);
                enqueueSnackbar(`${nombreEncargado} removido del grupo`, {
                    variant: "success",
                });
            } catch (error) {
                enqueueSnackbar(error.message || "Error al remover encargado", {
                    variant: "error",
                });
            }
        },
        [onRemover, enqueueSnackbar],
    );

    const handleCancelEdit = useCallback(() => {
        setEditingGrupo(null);
        setSelectedUsuario(null);
    }, []);

    if (isLoading) {
        return (
            <Stack spacing={1}>
                {[1, 2, 3].map((i) => (
                    <Skeleton key={i} variant="rectangular" height={48} />
                ))}
            </Stack>
        );
    }

    if (!grupos.length) {
        return (
            <Sheet variant="soft" sx={{ p: 2, borderRadius: "sm" }}>
                <Typography level="body-sm" textColor="text.secondary">
                    No hay grupos disponibles en este curso.
                </Typography>
            </Sheet>
        );
    }

    return (
        <Sheet
            variant="outlined"
            sx={{ borderRadius: "sm", overflow: "hidden", m: 2 }}
        >
            <Table
                size="sm"
                hoverRow
                sx={{
                    "--TableCell-paddingY": "8px",
                    "--TableCell-paddingX": "12px",
                }}
            >
                <thead>
                    <tr>
                        <th style={{ width: "35%" }}>Grupo</th>
                        <th style={{ width: "45%" }}>Encargado</th>
                        <th style={{ width: "20%", textAlign: "center" }}>
                            Acciones
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {grupos.map((grupo) => {
                        const encargados = encargadosPorGrupo[grupo.id] || [];
                        const encargadoPrincipal = encargados.find(
                            (e) => e.rol === "principal",
                        );
                        const isEditing = editingGrupo === grupo.id;

                        return (
                            <tr key={grupo.id}>
                                <td>
                                    <Typography level="body-sm" fontWeight="md">
                                        {grupo.name}
                                    </Typography>
                                </td>
                                <td>
                                    {isEditing ? (
                                        <Stack
                                            direction="row"
                                            spacing={1}
                                            alignItems="center"
                                        >
                                            <Box sx={{ flexGrow: 1 }}>
                                                <EncargadoSelector
                                                    value={selectedUsuario}
                                                    onChange={
                                                        setSelectedUsuario
                                                    }
                                                    disabled={isPending}
                                                />
                                            </Box>
                                            <Button
                                                size="sm"
                                                color="success"
                                                onClick={() =>
                                                    handleAsignar(grupo.id)
                                                }
                                                loading={isPending}
                                                disabled={!selectedUsuario}
                                            >
                                                Guardar
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="plain"
                                                color="neutral"
                                                onClick={handleCancelEdit}
                                                disabled={isPending}
                                            >
                                                Cancelar
                                            </Button>
                                        </Stack>
                                    ) : encargadoPrincipal ? (
                                        <Stack
                                            direction="row"
                                            spacing={1}
                                            alignItems="center"
                                        >
                                            <EncargadoBadgeInline
                                                encargado={encargadoPrincipal}
                                            />
                                            {encargados.length > 1 && (
                                                <Chip
                                                    size="sm"
                                                    variant="soft"
                                                    color="neutral"
                                                >
                                                    +{encargados.length - 1} más
                                                </Chip>
                                            )}
                                        </Stack>
                                    ) : (
                                        <Typography
                                            level="body-sm"
                                            textColor="text.tertiary"
                                        >
                                            Sin asignar
                                        </Typography>
                                    )}
                                </td>
                                <td>
                                    <Stack
                                        direction="row"
                                        spacing={0.5}
                                        justifyContent="center"
                                    >
                                        {!isEditing && (
                                            <IconButton
                                                size="sm"
                                                variant="plain"
                                                color="primary"
                                                onClick={() =>
                                                    setEditingGrupo(grupo.id)
                                                }
                                                disabled={disabled || isPending}
                                                title={
                                                    encargadoPrincipal
                                                        ? "Cambiar encargado"
                                                        : "Asignar encargado"
                                                }
                                            >
                                                {encargadoPrincipal ? (
                                                    <PersonIcon />
                                                ) : (
                                                    <AddIcon />
                                                )}
                                            </IconButton>
                                        )}
                                        {encargadoPrincipal && !isEditing && (
                                            <IconButton
                                                size="sm"
                                                variant="plain"
                                                color="danger"
                                                onClick={() =>
                                                    handleRemover(
                                                        encargadoPrincipal.id,
                                                        encargadoPrincipal.usuario_nombre,
                                                    )
                                                }
                                                disabled={disabled || isPending}
                                                title="Remover encargado"
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        )}
                                    </Stack>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </Table>
        </Sheet>
    );
});

export default EncargadosTable;
