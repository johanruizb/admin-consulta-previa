import fetcher from "@/components/fetcher";
import FormularioVerificacion, {
    DOCUMENTOS,
} from "@/components/Form/constants";
import usePermissionContext from "@/components/Home/permissionContext/usePermission";
import Navigate from "@/components/Navigate";
import {
    CourseProgressList,
    CourseProgressListSkeleton,
    FormSection,
    FormSectionSkeleton,
    HistoryList,
    HistoryListSkeleton,
    InstructionMessage,
    UserTitle,
    UserTitleSkeleton,
} from "@/components/Registros/DetailComponents";
import GruposSelector from "@/components/Registros/GruposSelector";
import { convertToFormData, getURL } from "@/components/utils";
import { useCiclo } from "@/contexts/CicloContext";
import useAlert from "@/hooks/useAlert";
import usePermission from "@/hooks/usePermission";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import CloseIcon from "@mui/icons-material/Close";
import InfoIcon from "@mui/icons-material/Info";
import SaveIcon from "@mui/icons-material/Save";
import Alert from "@mui/joy/Alert";
import Button from "@mui/joy/Button";
import { ButtonGroup } from "@mui/joy";
import DialogActions from "@mui/joy/DialogActions";
import DialogContent from "@mui/joy/DialogContent";
import DialogTitle from "@mui/joy/DialogTitle";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import Skeleton from "@mui/joy/Skeleton";
import Stack from "@mui/joy/Stack";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useRouter as useNavigate } from "next/navigation";
import { useRouter } from "next/router";
import { Fragment, useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import useSWR from "swr";
import useSWRImmutable from "swr/immutable";
import Registros from ".";

export default function Wrapper() {
    const { hasPermission } = usePermissionContext();

    const [mounted, setMounted] = useState(false);
    const router = useRouter();

    const { id } = router.query;

    const {
        data: values,
        isValidating,
        isLoading,
    } = useSWRImmutable(getURL("/api/usuarios/inscritos/" + id), fetcher, {
        revalidateOnMount: true,
        refreshInterval: false,
    });

    useEffect(() => {
        setMounted(true);
    }, []);

    // Solo bloqueamos el render por datos del usuario, no por permisos
    const dataReady = mounted && !isValidating && !isLoading;
    const hasEditPermission = hasPermission("usuario.change_persona");

    usePermission("usuario.view_persona");

    // Si no tiene permiso de edición, redirigir
    if (dataReady && !hasEditPermission) {
        return <Navigate to="/registros" replace />;
    }

    // Mostrar el modal inmediatamente, con skeleton si los datos no están listos
    return (
        <Registros>
            <Fragment>
                <Modal
                    open
                    onClose={() => {}}
                    sx={{
                        zIndex: 1001,
                    }}
                >
                    {dataReady ? (
                        <View defaultValues={values} />
                    ) : (
                        <ViewSkeleton />
                    )}
                </Modal>
            </Fragment>
        </Registros>
    );
}

function View({ defaultValues }) {
    const { onOpen: saveConfig } = useAlert();

    const [loading, setLoading] = useState(false);

    const router = useRouter();
    const { id } = router.query;

    const navigate = useNavigate();

    const sm = useMediaQuery((theme) => theme.breakpoints.down("md"));

    // Cargar historial de forma independiente
    const { data: historial, isLoading: historialLoading } = useSWR(
        id ? getURL(`/api/usuarios/historial/${id}`) : null,
        fetcher,
    );

    // Cargar avances/módulos de forma independiente
    const { data: modulos, isLoading: modulosLoading } = useSWR(
        id ? getURL(`/api/usuarios/avances/${id}`) : null,
        fetcher,
    );

    // Obtener el ciclo seleccionado del contexto
    const { selectedCicloId } = useCiclo();

    // Obtener el ciclo actual desde el backend
    const { data: cicloActualData } = useSWR(
        getURL("/api/usuarios/ciclos/actual"),
        fetcher,
    );

    // Determinar si el ciclo seleccionado es el actual
    const cicloActualId = cicloActualData?.data?.id;
    const isCurrentCycle = !cicloActualId || selectedCicloId === cicloActualId;

    const onClose = () => {
        navigate.push("/registros", undefined, { shallow: true });
    };

    const openAlert = (content, color = "success") => {
        saveConfig(content, color);
    };

    const methods = useForm({ defaultValues });
    const { handleSubmit } = methods;

    const onSubmit = (data, validate = false) => {
        delete data.historial;
        const formData = convertToFormData({ ...data, validate });

        setLoading(true);

        fetch(getURL("/api/usuarios/inscritos/" + id), {
            method: "POST",
            body: formData,
        })
            .then(async (response) => {
                const res = await response.json();

                if (response.ok) {
                    openAlert(res.message);
                    router.back();
                } else {
                    openAlert(
                        res?.message ??
                            `Se ha producido un error (${response.statusText})`,

                        "danger",
                    );
                }
            })
            .catch((error) => {
                openAlert(
                    `Se ha producido un error (${error.toString()})`,

                    "danger",
                );
                // setLoading(false);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const validado = defaultValues?.info_validada;

    return (
        <Registros>
            <Fragment>
                <Modal
                    open
                    onClose={onClose}
                    sx={{
                        zIndex: 1001,
                    }}
                >
                    <ModalDialog
                        layout={sm ? "fullscreen" : "center"}
                        slotProps={{
                            root: {
                                sx: sm
                                    ? {}
                                    : {
                                          width: "70%",
                                      },
                            },
                        }}
                    >
                        <DialogTitle>
                            <UserTitle
                                defaultValues={defaultValues}
                                DOCUMENTOS={DOCUMENTOS}
                            />
                        </DialogTitle>
                        <DialogContent>
                            {isCurrentCycle ? (
                                <InstructionMessage validado={validado} />
                            ) : (
                                <Alert
                                    color="warning"
                                    startDecorator={<InfoIcon />}
                                    sx={{ my: 2 }}
                                >
                                    La información de versiones anteriores solo
                                    se puede ver, mas no modificar. Para editar,
                                    seleccione el ciclo actual.
                                </Alert>
                            )}

                            <Stack spacing={2}>
                                <FormProvider {...methods}>
                                    <FormSection
                                        FormularioVerificacion={
                                            FormularioVerificacion
                                        }
                                        methods={methods}
                                        disabled={!isCurrentCycle}
                                    />
                                    <GruposSelector
                                        disabled={!isCurrentCycle}
                                    />
                                </FormProvider>
                            </Stack>
                            {historialLoading ? (
                                <HistoryListSkeleton />
                            ) : (
                                <HistoryList historial={historial} />
                            )}
                            {modulosLoading ? (
                                <CourseProgressListSkeleton />
                            ) : modulos?.length ? (
                                <CourseProgressList modulos={modulos} />
                            ) : null}
                        </DialogContent>
                        <DialogActions
                            sx={{
                                justifyContent: "space-between",
                            }}
                        >
                            {/* <Button
                                onClick={handleSubmit(onSubmit)}
                                variant="solid"
                                endDecorator={<SaveIcon />}
                                size="lg"
                                color={validado ? "primary" : "success"}
                                loading={loading}
                                disabled={!isCurrentCycle}
                            >
                                {validado ? "Guardar" : "Validar"}
                            </Button> */}
                            {isCurrentCycle && (
                                <ButtonGroup
                                    variant="solid"
                                    spacing="0.5rem"
                                    size="lg"
                                >
                                    {validado ? null : (
                                        <Button
                                            endDecorator={
                                                <AssignmentTurnedInIcon />
                                            }
                                            onClick={handleSubmit((data) =>
                                                onSubmit(data, true),
                                            )}
                                            color="success"
                                            disabled={loading}
                                            loading={loading}
                                        >
                                            Guardar y validar
                                        </Button>
                                    )}
                                    <Button
                                        startDecorator={<SaveIcon />}
                                        onClick={handleSubmit((data) =>
                                            onSubmit(data, false),
                                        )}
                                        color="primary"
                                        disabled={loading}
                                        loading={loading}
                                    >
                                        {validado
                                            ? "Guardar"
                                            : "Guardar sin validar"}
                                    </Button>
                                </ButtonGroup>
                            )}
                            <Button
                                onClick={onClose}
                                variant="plain"
                                startDecorator={<CloseIcon />}
                                size="lg"
                                disabled={loading}
                                // loading={loading}
                            >
                                Cerrar
                            </Button>
                        </DialogActions>
                    </ModalDialog>
                </Modal>
            </Fragment>
        </Registros>
    );
}

/**
 * Componente Skeleton que se muestra mientras se cargan los datos
 */
function ViewSkeleton() {
    const navigate = useNavigate();
    const sm = useMediaQuery((theme) => theme.breakpoints.down("md"));

    const onClose = () => {
        navigate.push("/registros", undefined, { shallow: true });
    };

    return (
        <ModalDialog
            layout={sm ? "fullscreen" : "center"}
            slotProps={{
                root: {
                    sx: sm
                        ? {}
                        : {
                              width: "70%",
                          },
                },
            }}
        >
            <DialogTitle>
                <UserTitleSkeleton />
            </DialogTitle>
            <DialogContent>
                <Stack spacing={1} sx={{ my: 2 }}>
                    <Skeleton
                        variant="rectangular"
                        height={60}
                        sx={{ borderRadius: "sm" }}
                    />
                </Stack>

                <Stack spacing={2}>
                    <FormSectionSkeleton />
                </Stack>

                <HistoryListSkeleton />

                <CourseProgressListSkeleton />
            </DialogContent>
            <DialogActions
                sx={{
                    justifyContent: "space-between",
                }}
            >
                <Skeleton
                    variant="rectangular"
                    width={150}
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
