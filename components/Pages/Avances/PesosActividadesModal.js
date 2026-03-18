import fetcher from "@/components/fetcher";
import BalanceRoundedIcon from "@mui/icons-material/BalanceRounded";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Chip from "@mui/joy/Chip";
import CircularProgress from "@mui/joy/CircularProgress";
import DialogActions from "@mui/joy/DialogActions";
import DialogContent from "@mui/joy/DialogContent";
import DialogTitle from "@mui/joy/DialogTitle";
import Divider from "@mui/joy/Divider";
import IconButton from "@mui/joy/IconButton";
import Input from "@mui/joy/Input";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";
import { useSnackbar } from "notistack";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { useSWRConfig } from "swr";
import useSWR from "swr";

function ActividadPeso({ actividad, onChange }) {
    return (
        <Stack direction="row" alignItems="center" spacing={1.5}>
            <Typography level="body-sm" sx={{ flex: 1, minWidth: 0 }} noWrap title={actividad.name}>
                {actividad.name}
            </Typography>
            <Input
                size="sm"
                type="number"
                placeholder="Auto"
                slotProps={{ input: { min: 0, step: 0.01 } }}
                value={actividad.peso ?? ""}
                onChange={(e) => {
                    const val = e.target.value;
                    onChange(val === "" ? null : parseFloat(val));
                }}
                sx={{ width: 90 }}
                endDecorator={<Typography level="body-xs">%</Typography>}
            />
        </Stack>
    );
}

function PesosActividadesModal({ open, onClose, cursoId }) {
    const { enqueueSnackbar } = useSnackbar();
    const { mutate: globalMutate } = useSWRConfig();
    const [modulos, setModulos] = useState(null);
    const [saving, setSaving] = useState(false);

    const { data, isLoading } = useSWR(
        open && cursoId
            ? `/api/moodle/curso/${cursoId}/pesos-actividades`
            : null,
        fetcher,
    );

    useEffect(() => {
        if (data) {
            setModulos(data.map((m) => ({
                ...m,
                actividades: m.actividades.map((a) => ({ ...a })),
            })));
        }
    }, [data]);

    const totalPeso = useMemo(() => {
        if (!modulos) return 0;
        return modulos.reduce(
            (sum, m) => sum + m.actividades.reduce((s, a) => s + (a.peso ?? 0), 0),
            0,
        );
    }, [modulos]);

    const totalActividades = useMemo(() => {
        if (!modulos) return 0;
        return modulos.reduce((sum, m) => sum + m.actividades.length, 0);
    }, [modulos]);

    const tieneAlgunPeso = useMemo(() => {
        if (!modulos) return false;
        return modulos.some((m) => m.actividades.some((a) => a.peso !== null));
    }, [modulos]);

    const handleChange = useCallback((moduloIdx, actIdx, peso) => {
        setModulos((prev) => {
            const copy = prev.map((m) => ({
                ...m,
                actividades: m.actividades.map((a) => ({ ...a })),
            }));
            copy[moduloIdx].actividades[actIdx].peso = peso;
            return copy;
        });
    }, []);

    const handleDistribuirEquitativamente = useCallback(() => {
        if (!modulos) return;
        const pesoEquitativo = Math.round((100 / totalActividades) * 100) / 100;
        setModulos((prev) =>
            prev.map((m) => ({
                ...m,
                actividades: m.actividades.map((a) => ({ ...a, peso: pesoEquitativo })),
            })),
        );
    }, [modulos, totalActividades]);

    const handleLimpiarPesos = useCallback(() => {
        setModulos((prev) =>
            prev.map((m) => ({
                ...m,
                actividades: m.actividades.map((a) => ({ ...a, peso: null })),
            })),
        );
    }, []);

    const handleSave = useCallback(async () => {
        if (!modulos) return;

        setSaving(true);
        try {
            const payload = modulos.flatMap((m) =>
                m.actividades.map((a) => ({ id: a.id, peso: a.peso })),
            );

            const res = await fetch(
                `/api/moodle/curso/${cursoId}/pesos-actividades`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                },
            );

            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                throw new Error(err.message || "Error al guardar");
            }

            enqueueSnackbar("Pesos actualizados", { variant: "success" });
            globalMutate((key) => typeof key === "string" && key.includes("estadisticas-avances"));
            onClose();
        } catch (err) {
            enqueueSnackbar(err.message || "Error al guardar pesos", {
                variant: "error",
            });
        } finally {
            setSaving(false);
        }
    }, [modulos, cursoId, enqueueSnackbar, globalMutate, onClose]);

    const pesoColor = totalPeso === 0 ? "neutral" : Math.abs(totalPeso - 100) < 0.1 ? "success" : "warning";
    const totalMayorA100 = totalPeso > 100.0001;

    return (
        <Modal open={open} onClose={onClose}>
            <ModalDialog
                sx={{
                    maxWidth: 550,
                    width: "100%",
                    maxHeight: "90vh",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                <DialogTitle>
                    <Stack direction="row" alignItems="center" gap={1}>
                        <BalanceRoundedIcon />
                        Pesos de actividades
                    </Stack>
                </DialogTitle>

                <DialogContent sx={{ overflow: "auto" }}>
                    {isLoading && (
                        <Stack alignItems="center" py={4}>
                            <CircularProgress />
                        </Stack>
                    )}

                    {!isLoading && modulos && (
                        <Stack spacing={2} sx={{ py: 1 }}>
                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                                <Typography level="body-sm" color="neutral">
                                    Define el peso porcentual de cada actividad.
                                    Si se dejan vacíos, se distribuyen equitativamente.
                                </Typography>
                                {tieneAlgunPeso && (
                                    <Chip size="sm" variant="soft" color={pesoColor}>
                                        Total: {totalPeso.toFixed(2)}%
                                    </Chip>
                                )}
                            </Stack>

                            {totalMayorA100 && (
                                <Typography level="body-xs" color="warning">
                                    El total supera 100%. Se permite guardar y el avance global se truncará a 100%.
                                </Typography>
                            )}

                            <Stack direction="row" spacing={1}>
                                <Button
                                    size="sm"
                                    variant="outlined"
                                    color="neutral"
                                    onClick={handleDistribuirEquitativamente}
                                >
                                    Distribuir equitativamente
                                </Button>
                                <Button
                                    size="sm"
                                    variant="outlined"
                                    color="neutral"
                                    onClick={handleLimpiarPesos}
                                >
                                    Limpiar pesos
                                </Button>
                            </Stack>

                            {modulos.map((modulo, mIdx) => (
                                <Box
                                    key={modulo.id}
                                    sx={{
                                        p: 2,
                                        borderRadius: "sm",
                                        border: "1px solid",
                                        borderColor: "divider",
                                    }}
                                >
                                    <Typography level="title-md" fontWeight="lg" sx={{ mb: 1.5 }}>
                                        {modulo.name}
                                    </Typography>
                                    <Stack spacing={1}>
                                        {modulo.actividades.map((act, aIdx) => (
                                            <ActividadPeso
                                                key={act.id}
                                                actividad={act}
                                                onChange={(peso) => handleChange(mIdx, aIdx, peso)}
                                            />
                                        ))}
                                        {modulo.actividades.length === 0 && (
                                            <Typography level="body-xs" color="neutral">
                                                Sin actividades
                                            </Typography>
                                        )}
                                    </Stack>
                                </Box>
                            ))}
                        </Stack>
                    )}
                </DialogContent>

                <Divider />

                <DialogActions>
                    <Button
                        variant="solid"
                        color="primary"
                        loading={saving}
                        disabled={!modulos || isLoading}
                        onClick={handleSave}
                    >
                        Guardar
                    </Button>
                    <Button variant="plain" color="neutral" onClick={onClose}>
                        Cancelar
                    </Button>
                </DialogActions>
            </ModalDialog>
        </Modal>
    );
}

export function PesosActividadesButton({ cursoId }) {
    const [open, setOpen] = useState(false);

    return (
        <>
            <IconButton
                size="sm"
                variant="outlined"
                color="neutral"
                onClick={() => setOpen(true)}
                title="Configurar pesos de actividades"
                aria-label="Configurar pesos de actividades"
            >
                <BalanceRoundedIcon fontSize="small" />
            </IconButton>
            {open && (
                <PesosActividadesModal
                    open={open}
                    onClose={() => setOpen(false)}
                    cursoId={cursoId}
                />
            )}
        </>
    );
}

export default memo(PesosActividadesModal);
