import fetcher from "@/components/fetcher";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Checkbox from "@mui/joy/Checkbox";
import Chip from "@mui/joy/Chip";
import CircularProgress from "@mui/joy/CircularProgress";
import DialogActions from "@mui/joy/DialogActions";
import DialogContent from "@mui/joy/DialogContent";
import DialogTitle from "@mui/joy/DialogTitle";
import Divider from "@mui/joy/Divider";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import IconButton from "@mui/joy/IconButton";
import Input from "@mui/joy/Input";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import Option from "@mui/joy/Option";
import Select from "@mui/joy/Select";
import Stack from "@mui/joy/Stack";
import Switch from "@mui/joy/Switch";
import Typography from "@mui/joy/Typography";
import { useSnackbar } from "notistack";
import { memo, useCallback, useEffect, useState } from "react";
import { useSWRConfig } from "swr";
import useSWR from "swr";

const TIPOS = [
    { value: "todas", label: "Todas las actividades" },
    { value: "cantidad_minima", label: "Cantidad mínima" },
    { value: "actividades_especificas", label: "Actividades específicas" },
    { value: "ninguna", label: "Ninguna actividad" },
];

function ModuloConfig({ config, onChange }) {
    const handleField = useCallback(
        (field, value) => onChange({ ...config, [field]: value }),
        [config, onChange],
    );

    return (
        <Box
            sx={{
                p: 2,
                borderRadius: "sm",
                border: "1px solid",
                borderColor: config.activo ? "divider" : "neutral.outlinedBorder",
                opacity: config.activo ? 1 : 0.6,
                transition: "opacity 0.2s",
            }}
        >
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
                <Typography level="title-md" fontWeight="lg">
                    {config.modulo_name}
                </Typography>
                <Switch
                    size="sm"
                    checked={config.activo}
                    onChange={(e) => handleField("activo", e.target.checked)}
                    slotProps={{
                        input: { "aria-label": `Activar ${config.modulo_name}` },
                    }}
                />
            </Stack>

            {config.activo && (
                <Stack spacing={1.5}>
                    <FormControl size="sm">
                        <FormLabel>Tipo de completitud</FormLabel>
                        <Select
                            size="sm"
                            value={config.tipo}
                            onChange={(_, v) => {
                                const updates = { tipo: v };
                                if (v !== "cantidad_minima") updates.cantidad_minima = null;
                                if (v !== "actividades_especificas") updates.actividades_requeridas = [];
                                onChange({ ...config, ...updates });
                            }}
                        >
                            {TIPOS.map((t) => (
                                <Option key={t.value} value={t.value}>
                                    {t.label}
                                </Option>
                            ))}
                        </Select>
                    </FormControl>

                    {config.tipo === "cantidad_minima" && (
                        <FormControl size="sm">
                            <FormLabel>Cantidad mínima de actividades</FormLabel>
                            <Input
                                size="sm"
                                type="number"
                                slotProps={{ input: { min: 1 } }}
                                value={config.cantidad_minima ?? ""}
                                onChange={(e) =>
                                    handleField(
                                        "cantidad_minima",
                                        e.target.value ? parseInt(e.target.value, 10) : null,
                                    )
                                }
                            />
                        </FormControl>
                    )}

                    {config.tipo === "actividades_especificas" && (
                        <FormControl size="sm">
                            <FormLabel>Actividades requeridas</FormLabel>
                            <Stack spacing={0.5}>
                                {config.actividades_disponibles?.map((act) => {
                                    const selectedIds = (config.actividades_requeridas || []).map(
                                        (a) => (typeof a === "object" ? a.id : a),
                                    );
                                    return (
                                        <Checkbox
                                            key={act.id}
                                            size="sm"
                                            label={act.name}
                                            checked={selectedIds.includes(act.id)}
                                            onChange={(e) => {
                                                const newIds = e.target.checked
                                                    ? [...selectedIds, act.id]
                                                    : selectedIds.filter((id) => id !== act.id);
                                                handleField("actividades_requeridas", newIds);
                                            }}
                                        />
                                    );
                                })}
                                {(!config.actividades_disponibles ||
                                    config.actividades_disponibles.length === 0) && (
                                    <Typography level="body-xs" color="neutral">
                                        Sin actividades disponibles
                                    </Typography>
                                )}
                            </Stack>
                        </FormControl>
                    )}
                </Stack>
            )}
        </Box>
    );
}

function ConfiguracionCompletitudModal({ open, onClose, cursoId, onSaved }) {
    const { enqueueSnackbar } = useSnackbar();
    const { mutate: globalMutate } = useSWRConfig();
    const [configs, setConfigs] = useState(null);
    const [saving, setSaving] = useState(false);

    const { data, isLoading } = useSWR(
        open && cursoId
            ? `/api/moodle/curso/${cursoId}/configuracion-completitud`
            : null,
        fetcher,
    );

    useEffect(() => {
        if (data) {
            setConfigs(
                data.map((item) => ({
                    ...item,
                    actividades_requeridas: (item.actividades_requeridas || []).map(
                        (a) => (typeof a === "object" ? a.id : a),
                    ),
                })),
            );
        }
    }, [data]);

    const handleChange = useCallback((index, newConfig) => {
        setConfigs((prev) => {
            const copy = [...prev];
            copy[index] = newConfig;
            return copy;
        });
    }, []);

    const handleSave = useCallback(async () => {
        if (!configs) return;

        // Validación local
        for (const c of configs) {
            if (!c.activo) continue;
            if (c.tipo === "cantidad_minima" && (!c.cantidad_minima || c.cantidad_minima < 1)) {
                enqueueSnackbar(
                    `"${c.modulo_name}": la cantidad mínima debe ser al menos 1.`,
                    { variant: "error" },
                );
                return;
            }
            if (
                c.tipo === "actividades_especificas" &&
                (!c.actividades_requeridas || c.actividades_requeridas.length === 0)
            ) {
                enqueueSnackbar(
                    `"${c.modulo_name}": debe seleccionar al menos una actividad.`,
                    { variant: "error" },
                );
                return;
            }
        }

        setSaving(true);
        try {
            const payload = configs.map((c) => ({
                modulo_id: c.modulo_id,
                tipo: c.tipo,
                cantidad_minima: c.tipo === "cantidad_minima" ? c.cantidad_minima : null,
                actividades_requeridas:
                    c.tipo === "actividades_especificas" ? c.actividades_requeridas : [],
                activo: c.activo,
            }));

            const res = await fetch(
                `/api/moodle/curso/${cursoId}/configuracion-completitud`,
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

            enqueueSnackbar("Configuración guardada", { variant: "success" });
            globalMutate((key) => typeof key === "string" && key.includes("estadisticas-avances"));
            onSaved?.();
            onClose();
        } catch (err) {
            enqueueSnackbar(err.message || "Error al guardar configuración", {
                variant: "error",
            });
        } finally {
            setSaving(false);
        }
    }, [configs, cursoId, enqueueSnackbar, globalMutate, onClose, onSaved]);

    return (
        <Modal open={open} onClose={onClose}>
            <ModalDialog
                sx={{
                    maxWidth: 600,
                    width: "100%",
                    maxHeight: "90vh",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                <DialogTitle>
                    <Stack direction="row" alignItems="center" gap={1}>
                        <SettingsRoundedIcon />
                        Configuración de completitud
                    </Stack>
                </DialogTitle>

                <DialogContent sx={{ overflow: "auto" }}>
                    {isLoading && (
                        <Stack alignItems="center" py={4}>
                            <CircularProgress />
                        </Stack>
                    )}

                    {!isLoading && configs && (
                        <Stack spacing={1.5} sx={{ py: 1 }}>
                            <Typography level="body-sm" color="neutral">
                                Define qué significa "completar" cada módulo para el
                                cálculo de cumplimiento de meta.
                            </Typography>
                            {configs.map((config, index) => (
                                <ModuloConfig
                                    key={config.modulo_id}
                                    config={config}
                                    onChange={(newConfig) => handleChange(index, newConfig)}
                                />
                            ))}
                            {configs.length === 0 && (
                                <Typography level="body-md" textAlign="center" color="neutral">
                                    No hay módulos configurables
                                </Typography>
                            )}
                        </Stack>
                    )}
                </DialogContent>

                <Divider />

                <DialogActions>
                    <Button
                        variant="solid"
                        color="primary"
                        loading={saving}
                        disabled={!configs || isLoading}
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

export function ConfiguracionCompletitudButton({ cursoId }) {
    const [open, setOpen] = useState(false);

    return (
        <>
            <IconButton
                size="sm"
                variant="outlined"
                color="neutral"
                onClick={() => setOpen(true)}
                title="Configurar completitud de módulos"
            >
                <SettingsRoundedIcon fontSize="small" />
            </IconButton>
            {open && (
                <ConfiguracionCompletitudModal
                    open={open}
                    onClose={() => setOpen(false)}
                    cursoId={cursoId}
                />
            )}
        </>
    );
}

export default memo(ConfiguracionCompletitudModal);
