import { getURL } from "@/components/utils";
import PersonOffIcon from "@mui/icons-material/PersonOff";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import WarningRoundedIcon from "@mui/icons-material/WarningRounded";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Chip from "@mui/joy/Chip";
import DialogActions from "@mui/joy/DialogActions";
import DialogContent from "@mui/joy/DialogContent";
import DialogTitle from "@mui/joy/DialogTitle";
import Divider from "@mui/joy/Divider";
import FormControl from "@mui/joy/FormControl";
import FormHelperText from "@mui/joy/FormHelperText";
import FormLabel from "@mui/joy/FormLabel";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import Option from "@mui/joy/Option";
import Select from "@mui/joy/Select";
import Stack from "@mui/joy/Stack";
import Textarea from "@mui/joy/Textarea";
import Typography from "@mui/joy/Typography";
import { useCallback, useRef, useState, useTransition } from "react";

const CAUSAS = [
    { value: "falta_tiempo", label: "Falta de tiempo" },
    { value: "desinteres", label: "Desinterés" },
    { value: "otro", label: "Otro" },
];

const ALLOWED_EXTENSIONS = [".pdf", ".jpg", ".jpeg", ".png", ".doc", ".docx"];

export default function ModalDarDeBaja({
    open,
    onClose,
    personaId,
    personaNombre,
    onSuccess,
}) {
    const [isPending, startTransition] = useTransition();
    const [causa, setCausa] = useState(null);
    const [causaOtra, setCausaOtra] = useState("");
    const [observaciones, setObservaciones] = useState("");
    const [archivo, setArchivo] = useState(null);
    const [errors, setErrors] = useState({});
    const fileInputRef = useRef(null);

    const resetForm = useCallback(() => {
        setCausa(null);
        setCausaOtra("");
        setObservaciones("");
        setArchivo(null);
        setErrors({});
    }, []);

    const handleClose = useCallback(() => {
        if (isPending) return;
        resetForm();
        onClose();
    }, [isPending, resetForm, onClose]);

    const handleFileChange = useCallback((e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const ext = "." + file.name.split(".").pop().toLowerCase();
        if (!ALLOWED_EXTENSIONS.includes(ext)) {
            setErrors((prev) => ({
                ...prev,
                soporte: `Tipo de archivo no permitido (${ext}). Use PDF, JPG, PNG o Word.`,
            }));
            return;
        }

        setArchivo(file);
        setErrors((prev) => {
            const next = { ...prev };
            delete next.soporte;
            return next;
        });
    }, []);

    const validate = useCallback(() => {
        const newErrors = {};

        if (!causa) {
            newErrors.causa = "Seleccione una causa";
        }

        if (causa === "otro" && !causaOtra.trim()) {
            newErrors.causa_otra = "Especifique la causa";
        }

        if (!archivo) {
            newErrors.soporte = "Adjunte un documento de soporte";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [causa, causaOtra, archivo]);

    const handleSubmit = useCallback(() => {
        if (!validate()) return;

        startTransition(async () => {
            try {
                const formData = new FormData();
                formData.append("causa", causa);
                if (causa === "otro") {
                    formData.append("causa_otra", causaOtra.trim());
                }
                if (observaciones.trim()) {
                    formData.append("observaciones", observaciones.trim());
                }
                if (archivo) {
                    formData.append("soporte", archivo);
                }

                const response = await fetch(
                    getURL(`/api/usuarios/dar-de-baja/${personaId}`),
                    {
                        method: "POST",
                        body: formData,
                    },
                );

                const result = await response.json();

                if (response.ok) {
                    resetForm();
                    onSuccess?.(result);
                } else {
                    setErrors({
                        submit:
                            result?.message ||
                            `Error al dar de baja (${response.statusText})`,
                    });
                }
            } catch (error) {
                setErrors({
                    submit: `Error de conexión: ${error.toString()}`,
                });
            }
        });
    }, [
        causa,
        causaOtra,
        observaciones,
        archivo,
        personaId,
        validate,
        resetForm,
        onSuccess,
    ]);

    return (
        <Modal open={open} onClose={handleClose}>
            <ModalDialog variant="outlined" role="alertdialog" minWidth={420}>
                <DialogTitle>
                    <WarningRoundedIcon color="warning" />
                    Dar de baja
                </DialogTitle>
                <Divider />
                <DialogContent>
                    <Typography level="body-md" sx={{ mb: 2 }}>
                        Está a punto de dar de baja a{" "}
                        <Typography fontWeight="bold">
                            {personaNombre}
                        </Typography>
                        . Esta acción desmatriculará a la persona de todos los
                        cursos y suspenderá su acceso a Moodle.
                    </Typography>

                    <Stack spacing={2}>
                        {/* Causa del desistimiento */}
                        <FormControl error={!!errors.causa} required>
                            <FormLabel>Causa del desistimiento</FormLabel>
                            <Select
                                placeholder="Seleccione una causa…"
                                value={causa}
                                onChange={(_, value) => {
                                    setCausa(value);
                                    setErrors((prev) => {
                                        const next = { ...prev };
                                        delete next.causa;
                                        delete next.causa_otra;
                                        return next;
                                    });
                                }}
                                disabled={isPending}
                            >
                                {CAUSAS.map((c) => (
                                    <Option key={c.value} value={c.value}>
                                        {c.label}
                                    </Option>
                                ))}
                            </Select>
                            {errors.causa && (
                                <FormHelperText>{errors.causa}</FormHelperText>
                            )}
                        </FormControl>

                        {/* Campo condicional: otra causa */}
                        {causa === "otro" && (
                            <FormControl error={!!errors.causa_otra} required>
                                <FormLabel>Especifique la causa</FormLabel>
                                <Textarea
                                    placeholder="Describa la causa del desistimiento…"
                                    value={causaOtra}
                                    onChange={(e) => {
                                        setCausaOtra(e.target.value);
                                        if (errors.causa_otra) {
                                            setErrors((prev) => {
                                                const next = { ...prev };
                                                delete next.causa_otra;
                                                return next;
                                            });
                                        }
                                    }}
                                    minRows={2}
                                    disabled={isPending}
                                />
                                {errors.causa_otra && (
                                    <FormHelperText>
                                        {errors.causa_otra}
                                    </FormHelperText>
                                )}
                            </FormControl>
                        )}

                        {/* Observaciones */}
                        <FormControl>
                            <FormLabel>Observaciones</FormLabel>
                            <Textarea
                                placeholder="Observaciones del caso (opcional)…"
                                value={observaciones}
                                onChange={(e) =>
                                    setObservaciones(e.target.value)
                                }
                                minRows={3}
                                disabled={isPending}
                            />
                        </FormControl>

                        {/* Soporte documental */}
                        <FormControl error={!!errors.soporte} required>
                            <FormLabel>Documento de soporte</FormLabel>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                                onChange={handleFileChange}
                                style={{ display: "none" }}
                                disabled={isPending}
                            />
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                }}
                            >
                                <Button
                                    variant="outlined"
                                    color="neutral"
                                    startDecorator={<UploadFileIcon />}
                                    onClick={() =>
                                        fileInputRef.current?.click()
                                    }
                                    disabled={isPending}
                                    size="sm"
                                >
                                    Seleccionar archivo
                                </Button>
                                {archivo && (
                                    <Chip
                                        variant="soft"
                                        color="primary"
                                        endDecorator={
                                            <Box
                                                component="button"
                                                sx={{
                                                    border: "none",
                                                    background: "none",
                                                    cursor: "pointer",
                                                    p: 0,
                                                    fontSize: "inherit",
                                                }}
                                                onClick={() => {
                                                    setArchivo(null);
                                                    if (fileInputRef.current)
                                                        fileInputRef.current.value =
                                                            "";
                                                }}
                                            >
                                                ✕
                                            </Box>
                                        }
                                    >
                                        {archivo.name}
                                    </Chip>
                                )}
                            </Box>
                            <FormHelperText>
                                {errors.soporte ||
                                    "PDF, JPG, PNG o Word"}
                            </FormHelperText>
                        </FormControl>

                        {/* Error general */}
                        {errors.submit && (
                            <Typography level="body-sm" color="danger">
                                {errors.submit}
                            </Typography>
                        )}
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="solid"
                        color="danger"
                        startDecorator={<PersonOffIcon />}
                        onClick={handleSubmit}
                        loading={isPending}
                        disabled={isPending}
                    >
                        Confirmar baja
                    </Button>
                    <Button
                        variant="plain"
                        color="neutral"
                        onClick={handleClose}
                        disabled={isPending}
                    >
                        Cancelar
                    </Button>
                </DialogActions>
            </ModalDialog>
        </Modal>
    );
}
