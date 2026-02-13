import fetcher from "@/components/fetcher";
import usePermissionContext from "@/components/Home/permissionContext/usePermission";
import { getURL } from "@/components/utils";
import usePermission from "@/hooks/usePermission";
import CloseIcon from "@mui/icons-material/Close";
import InfoIcon from "@mui/icons-material/Info";
import RestoreIcon from "@mui/icons-material/Restore";
import WarningIcon from "@mui/icons-material/Warning";
import Alert from "@mui/joy/Alert";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Chip from "@mui/joy/Chip";
import DialogActions from "@mui/joy/DialogActions";
import DialogContent from "@mui/joy/DialogContent";
import DialogTitle from "@mui/joy/DialogTitle";
import Divider from "@mui/joy/Divider";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import Skeleton from "@mui/joy/Skeleton";
import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useRouter as useNavigate } from "next/navigation";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import { useCallback, useState, useTransition } from "react";
import useSWRImmutable from "swr/immutable";
import { useSWRConfig } from "swr";
import { useCiclo } from "@/contexts/CicloContext";
import dayjs from "dayjs";
import PersonasEliminadas from ".";

function DetailField({ label, value }) {
    if (!value) return null;
    return (
        <Box>
            <Typography level="body-xs" fontWeight="lg" textColor="text.tertiary">
                {label}
            </Typography>
            <Typography level="body-sm">{value}</Typography>
        </Box>
    );
}

function DetailSection({ title, children }) {
    return (
        <Box sx={{ mb: 2 }}>
            <Typography level="title-sm" sx={{ mb: 1 }}>
                {title}
            </Typography>
            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                    gap: 1.5,
                }}
            >
                {children}
            </Box>
        </Box>
    );
}

function View({ data }) {
    const [isPending, startTransition] = useTransition();
    const [confirmRestore, setConfirmRestore] = useState(false);
    const { isAdmin } = usePermissionContext();
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();
    const { mutate } = useSWRConfig();
    const { selectedCicloId } = useCiclo();

    const sm = useMediaQuery((theme) => theme.breakpoints.down("md"));

    const onClose = useCallback(() => {
        navigate.push("/personas-eliminadas", undefined, { shallow: true });
    }, [navigate]);

    const handleRestore = useCallback(() => {
        startTransition(async () => {
            try {
                const response = await fetch(
                    getURL(`/api/usuarios/eliminados/${data.id}`),
                    { method: "POST" },
                );
                const result = await response.json();

                if (response.ok) {
                    if (result.warnings?.length) {
                        const warningDetails = result.warnings.join("\n• ");
                        enqueueSnackbar(
                            `${result.message}\n\n• ${warningDetails}`,
                            {
                                variant: "warning",
                                style: { whiteSpace: "pre-line" },
                            },
                        );
                    } else {
                        enqueueSnackbar(
                            result.message || "Persona restaurada exitosamente",
                            { variant: "success" },
                        );
                    }
                    mutate(
                        getURL(`/api/usuarios/eliminados?ciclo_id=${selectedCicloId}`),
                    );
                    navigate.push("/personas-eliminadas");
                } else {
                    enqueueSnackbar(
                        result?.error || result?.message || "Error al restaurar persona",
                        { variant: "error" },
                    );
                }
            } catch (error) {
                enqueueSnackbar(`Error al restaurar: ${error.toString()}`, {
                    variant: "error",
                });
            } finally {
                setConfirmRestore(false);
            }
        });
    }, [data.id, enqueueSnackbar, mutate, navigate, selectedCicloId]);

    const desistimiento = data.desistimiento;

    return (
        <>
            <Modal open onClose={onClose} sx={{ zIndex: 1001 }}>
                <ModalDialog
                    layout={sm ? "fullscreen" : "center"}
                    slotProps={{
                        root: {
                            sx: sm ? {} : { width: "65%", maxWidth: 800 },
                        },
                    }}
                >
                    <DialogTitle
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Typography level="title-lg">
                                {data.nombres} {data.apellidos}
                            </Typography>
                            <Chip size="sm" variant="soft" color="danger">
                                Eliminado
                            </Chip>
                        </Stack>
                    </DialogTitle>
                    <DialogContent>
                        {/* Alerta de desistimiento */}
                        {desistimiento && (
                            <Alert
                                color="danger"
                                variant="soft"
                                startDecorator={<WarningIcon />}
                                sx={{ mb: 2 }}
                            >
                                <div>
                                    <Typography level="title-sm">
                                        Motivo de baja: {desistimiento.causa}
                                    </Typography>
                                    {desistimiento.observaciones && (
                                        <Typography level="body-sm">
                                            {desistimiento.observaciones}
                                        </Typography>
                                    )}
                                    <Typography level="body-xs" sx={{ mt: 0.5 }}>
                                        Por: {desistimiento.created_by || "Sin información"} —{" "}
                                        {desistimiento.created_at
                                            ? dayjs(desistimiento.created_at).format(
                                                "DD/MM/YYYY HH:mm",
                                            )
                                            : ""}
                                    </Typography>
                                    {desistimiento.soporte && (
                                        <Typography level="body-xs" sx={{ mt: 0.5 }}>
                                            <a
                                                href={getURL(`/api/media/${desistimiento.soporte}`)}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                Ver archivo soporte
                                            </a>
                                        </Typography>
                                    )}
                                </div>
                            </Alert>
                        )}

                        {!desistimiento && (
                            <Alert
                                color="neutral"
                                variant="soft"
                                startDecorator={<InfoIcon />}
                                sx={{ mb: 2 }}
                            >
                                No se registró motivo de eliminación para esta persona.
                            </Alert>
                        )}

                        <Divider sx={{ my: 1 }} />

                        {/* Datos personales */}
                        <DetailSection title="Datos personales">
                            <DetailField
                                label="Documento"
                                value={
                                    data.tipo_doc && data.num_doc
                                        ? `${data.tipo_doc} ${data.num_doc}`
                                        : null
                                }
                            />
                            <DetailField
                                label="Fecha de nacimiento"
                                value={
                                    data.fecha_nac
                                        ? dayjs(data.fecha_nac).format("DD/MM/YYYY")
                                        : null
                                }
                            />
                            <DetailField label="Género" value={data.genero} />
                            <DetailField label="Etnia" value={data.etnia} />
                            <DetailField label="Tipo de entidad" value={data.tipo_cliente} />
                            <DetailField
                                label="Nivel educativo"
                                value={data.nivel_educativo}
                            />
                        </DetailSection>

                        {/* Contacto */}
                        <DetailSection title="Contacto">
                            <DetailField
                                label="Correo electrónico"
                                value={data.correo_electronico}
                            />
                            <DetailField label="Teléfono" value={data.telefono1} />
                        </DetailSection>

                        {/* Ubicación */}
                        <DetailSection title="Ubicación">
                            <DetailField label="Ciudad" value={data.ciudad} />
                            <DetailField label="Departamento" value={data.departamento} />
                            <DetailField
                                label="País expedición documento"
                                value={data.pais_exp}
                            />
                            <DetailField
                                label="Ciudad de nacimiento"
                                value={data.ciudad_nac}
                            />
                            <DetailField label="Zona" value={data.zona} />
                            <DetailField label="Conectividad" value={data.conectividad} />
                        </DetailSection>

                        {/* Fechas */}
                        <DetailSection title="Fechas">
                            <DetailField
                                label="Fecha de registro"
                                value={
                                    data.created_at
                                        ? dayjs(data.created_at).format("DD/MM/YYYY HH:mm")
                                        : null
                                }
                            />
                            <DetailField
                                label="Fecha de eliminación"
                                value={
                                    data.deleted_at
                                        ? dayjs(data.deleted_at).format("DD/MM/YYYY HH:mm")
                                        : null
                                }
                            />
                        </DetailSection>

                        <Divider sx={{ my: 1 }} />

                        {/* Registros de cursos */}
                        {data.registros?.length > 0 && (
                            <Box sx={{ mb: 2 }}>
                                <Typography level="title-sm" sx={{ mb: 1 }}>
                                    Cursos registrados
                                </Typography>
                                <Stack spacing={1}>
                                    {data.registros.map((reg, i) => (
                                        <Box
                                            key={i}
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 1,
                                                flexWrap: "wrap",
                                            }}
                                        >
                                            <Chip
                                                size="sm"
                                                variant="soft"
                                                color={reg.is_deleted ? "danger" : "success"}
                                            >
                                                {reg.curso}
                                            </Chip>
                                            {reg.ciclo && (
                                                <Typography level="body-xs" color="neutral">
                                                    {reg.ciclo}
                                                </Typography>
                                            )}
                                            {reg.plataforma && (
                                                <Typography level="body-xs" color="neutral">
                                                    vía {reg.plataforma}
                                                </Typography>
                                            )}
                                            {reg.fecha_registro && (
                                                <Typography level="body-xs" color="neutral">
                                                    {dayjs(reg.fecha_registro).format("DD/MM/YYYY")}
                                                </Typography>
                                            )}
                                        </Box>
                                    ))}
                                </Stack>
                            </Box>
                        )}
                    </DialogContent>
                    <DialogActions sx={{ justifyContent: "space-between" }}>
                        {isAdmin && (
                            <Button
                                startDecorator={<RestoreIcon />}
                                onClick={() => setConfirmRestore(true)}
                                color="success"
                                variant="solid"
                                size="lg"
                                disabled={isPending}
                                loading={isPending}
                            >
                                Restaurar persona
                            </Button>
                        )}
                        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                            <Button
                                onClick={onClose}
                                variant="plain"
                                startDecorator={<CloseIcon />}
                                size="lg"
                                disabled={isPending}
                            >
                                Cerrar
                            </Button>
                        </Box>
                    </DialogActions>
                </ModalDialog>
            </Modal>

            {/* Modal de confirmación para restaurar */}
            <Modal
                open={confirmRestore}
                onClose={() => setConfirmRestore(false)}
                sx={{ zIndex: 1002 }}
            >
                <ModalDialog variant="outlined" role="alertdialog">
                    <DialogTitle>
                        <WarningIcon />
                        Confirmar restauración
                    </DialogTitle>
                    <DialogContent>
                        {/* ¿Está seguro de restaurar a<strong>{" "}{data.nombres} {data.apellidos}{" "}</strong>? La persona y sus registros asociados serán reactivados. */}
                        <Typography>
                            ¿Está seguro de restaurar a <strong>{data.nombres} {data.apellidos}</strong>? La persona y sus registros asociados serán reactivados.
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            variant="solid"
                            color="success"
                            onClick={handleRestore}
                            loading={isPending}
                            disabled={isPending}
                        >
                            Restaurar
                        </Button>
                        <Button
                            variant="plain"
                            color="neutral"
                            onClick={() => setConfirmRestore(false)}
                            disabled={isPending}
                        >
                            Cancelar
                        </Button>
                    </DialogActions>
                </ModalDialog>
            </Modal>
        </>
    );
}

function ViewSkeleton() {
    const navigate = useNavigate();
    const sm = useMediaQuery((theme) => theme.breakpoints.down("md"));

    const onClose = () => {
        navigate.push("/personas-eliminadas", undefined, { shallow: true });
    };

    return (
        <ModalDialog
            layout={sm ? "fullscreen" : "center"}
            slotProps={{
                root: {
                    sx: sm ? {} : { width: "65%", maxWidth: 800 },
                },
            }}
        >
            <DialogTitle>
                <Skeleton variant="text" width={250} />
            </DialogTitle>
            <DialogContent>
                <Skeleton
                    variant="rectangular"
                    height={80}
                    sx={{ borderRadius: "sm", mb: 2 }}
                />
                <Stack spacing={2}>
                    <Skeleton
                        variant="rectangular"
                        height={120}
                        sx={{ borderRadius: "sm" }}
                    />
                    <Skeleton
                        variant="rectangular"
                        height={80}
                        sx={{ borderRadius: "sm" }}
                    />
                    <Skeleton
                        variant="rectangular"
                        height={80}
                        sx={{ borderRadius: "sm" }}
                    />
                </Stack>
            </DialogContent>
            <DialogActions sx={{ justifyContent: "space-between" }}>
                <Skeleton
                    variant="rectangular"
                    width={180}
                    height={40}
                    sx={{ borderRadius: "sm" }}
                />
                <Button
                    onClick={onClose}
                    variant="plain"
                    startDecorator={<CloseIcon />}
                    size="lg"
                >
                    Cerrar
                </Button>
            </DialogActions>
        </ModalDialog>
    );
}

export default function Wrapper() {
    const router = useRouter();
    const { id } = router.query;

    const { data, isValidating, isLoading } = useSWRImmutable(
        id ? getURL(`/api/usuarios/eliminados/${id}`) : null,
        fetcher,
        { revalidateOnMount: true },
    );

    usePermission("usuario.delete_persona");

    const dataReady = !isValidating && !isLoading && data;

    return (
        <PersonasEliminadas>
            <Modal open onClose={() => { }} sx={{ zIndex: 1001 }}>
                {dataReady ? <View data={data} /> : <ViewSkeleton />}
            </Modal>
        </PersonasEliminadas>
    );
}
