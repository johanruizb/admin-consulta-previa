import fetcher from "@/components/fetcher";
import { getURL } from "@/components/utils";
import { useCiclo } from "@/contexts/CicloContext";
import VerifiedRoundedIcon from "@mui/icons-material/VerifiedRounded";
import { Tooltip } from "@mui/joy";
import Button from "@mui/joy/Button";
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
import Typography from "@mui/joy/Typography";
import { useSnackbar } from "notistack";
import { memo, useCallback, useEffect, useState } from "react";
import useSWR, { useSWRConfig } from "swr";

function UmbralCertificadoModal({ open, onClose, initialCursoId }) {
    const { enqueueSnackbar } = useSnackbar();
    const { mutate: globalMutate } = useSWRConfig();
    const { selectedCicloId } = useCiclo();
    const [cursoId, setCursoId] = useState(initialCursoId || null);
    const [umbral, setUmbral] = useState("");
    const [saving, setSaving] = useState(false);

    const { data: cursos, isLoading: cursosLoading } = useSWR(
        open && selectedCicloId
            ? getURL(`api/usuarios/cursos/disponibles?ciclo_id=${selectedCicloId}`)
            : null,
        fetcher,
    );

    useEffect(() => {
        if (initialCursoId) setCursoId(initialCursoId);
    }, [initialCursoId]);

    useEffect(() => {
        setUmbral("");
    }, [cursoId]);

    const { data, isLoading } = useSWR(
        open && cursoId
            ? `/api/moodle/curso/${cursoId}/umbral-certificado`
            : null,
        fetcher,
    );

    useEffect(() => {
        if (data?.umbral_certificado != null) {
            setUmbral(data.umbral_certificado);
        }
    }, [data]);

    const handleSave = useCallback(async () => {
        const value = parseFloat(umbral);
        if (isNaN(value) || value < 0 || value > 100) {
            enqueueSnackbar("El valor debe estar entre 0 y 100", { variant: "error" });
            return;
        }

        setSaving(true);
        try {
            const res = await fetch(
                `/api/moodle/curso/${cursoId}/umbral-certificado`,
                {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ umbral_certificado: value }),
                },
            );

            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                throw new Error(err.error || "Error al guardar");
            }

            enqueueSnackbar("Umbral actualizado", { variant: "success" });
            globalMutate((key) => typeof key === "string" && key.includes("estadisticas"));
            onClose();
        } catch (err) {
            enqueueSnackbar(err.message || "Error al guardar umbral", {
                variant: "error",
            });
        } finally {
            setSaving(false);
        }
    }, [umbral, cursoId, enqueueSnackbar, globalMutate, onClose]);

    return (
        <Modal open={open} onClose={onClose}>
            <ModalDialog sx={{ maxWidth: 400, width: "100%" }}>
                <DialogTitle>
                    <Stack direction="row" alignItems="center" gap={1}>
                        <VerifiedRoundedIcon />
                        Umbral de certificación
                    </Stack>
                </DialogTitle>

                <DialogContent>
                    <FormControl size="sm" sx={{ mb: 1.5 }}>
                        <FormLabel>Curso</FormLabel>
                        <Select
                            size="sm"
                            placeholder="Selecciona un curso"
                            value={cursoId}
                            onChange={(_, v) => setCursoId(v)}
                            disabled={cursosLoading}
                        >
                            {cursos?.map((curso) => (
                                <Option key={curso.id} value={curso.id}>
                                    {curso.shortname}
                                </Option>
                            ))}
                        </Select>
                    </FormControl>

                    {!cursoId && (
                        <Typography level="body-sm" color="neutral" textAlign="center" sx={{ py: 4 }}>
                            Selecciona un curso para ver el umbral
                        </Typography>
                    )}

                    {cursoId && isLoading && (
                        <Stack alignItems="center" py={4}>
                            <CircularProgress />
                        </Stack>
                    )}

                    {cursoId && !isLoading && (
                        <Stack spacing={1.5} sx={{ py: 1 }}>
                            <Typography level="body-sm" color="neutral">
                                Porcentaje mínimo de avance requerido para considerar a una persona como certificada.
                            </Typography>
                            <FormControl>
                                <FormLabel>Porcentaje de umbral</FormLabel>
                                <Input
                                    type="number"
                                    value={umbral}
                                    onChange={(e) => setUmbral(e.target.value)}
                                    endDecorator={<Typography level="body-xs">%</Typography>}
                                    slotProps={{
                                        input: {
                                            min: 0,
                                            max: 100,
                                            step: 0.01,
                                            "aria-label": "Porcentaje de umbral",
                                        },
                                    }}
                                />
                            </FormControl>
                        </Stack>
                    )}
                </DialogContent>

                <Divider />

                <DialogActions>
                    <Button
                        variant="solid"
                        color="primary"
                        loading={saving}
                        disabled={isLoading || !cursoId}
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

export function UmbralCertificadoButton({ cursoId }) {
    const [open, setOpen] = useState(false);

    return (
        <>
            <Tooltip title="Configurar umbral de certificación" placement="top" arrow>
                <IconButton
                    size="sm"
                    variant="outlined"
                    color="neutral"
                    onClick={() => setOpen(true)}
                    title="Umbral de certificación"
                    aria-label="Umbral de certificación"
                >
                    <VerifiedRoundedIcon fontSize="small" />
                </IconButton>
            </Tooltip>
            {open && (
                <UmbralCertificadoModal
                    open={open}
                    onClose={() => setOpen(false)}
                    initialCursoId={cursoId}
                />
            )}
        </>
    );
}

export default memo(UmbralCertificadoModal);
