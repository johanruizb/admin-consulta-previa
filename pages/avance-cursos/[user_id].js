import fetcher from "@/components/fetcher";
import FormularioVerificacion, {
    DOCUMENTOS,
} from "@/components/Form/constants";
import usePermissionContext from "@/components/Home/permissionContext/usePermission";
import Navigate from "@/components/Navigate";
import { CourseProgressList, HistoryList } from "@/components/Registros/DetailComponents";
import { getURL } from "@/components/utils";
import usePermission from "@/hooks/usePermission";
import CloseIcon from "@mui/icons-material/Close";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import CircularProgress from "@mui/joy/CircularProgress";
import DialogActions from "@mui/joy/DialogActions";
import DialogContent from "@mui/joy/DialogContent";
import DialogTitle from "@mui/joy/DialogTitle";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import Stack from "@mui/joy/Stack";
import Backdrop from "@mui/material/Backdrop";
import Grid from "@mui/material/Grid";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useRouter } from "next/router";
import { Fragment, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import useSWRImmutable from "swr/immutable";
import { useIsClient } from "@uidotdev/usehooks";
import Avances from ".";

export default function Wrapper() {
    const { isLoading: permissionIsLoading, hasPermission } =
        usePermissionContext();

    const mounted = useIsClient();
    const router = useRouter();
    const { user_id } = router.query;

    const {
        data: values,
        isValidating,
        isLoading,
    } = useSWRImmutable(getURL("/api/usuarios/inscritos/" + user_id), fetcher, {
        revalidateOnMount: true,
        refreshInterval: false,
    });

    const ready =
        mounted && !permissionIsLoading && !isValidating && !isLoading;

    usePermission("usuario.view_persona");

    return ready ? (
        hasPermission("usuario.change_persona") ? (
            <View defaultValues={values} />
        ) : (
            <Navigate to="/registros" replace />
        )
    ) : (
        <Stack
            open
            component={Backdrop}
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

function View({ defaultValues }) {
    const router = useRouter();
    const sm = useMediaQuery((theme) => theme.breakpoints.down("md"));

    const onClose = () => {
        router.push(`/avance-cursos`, undefined, { shallow: true });
    };

    const methods = useForm({ defaultValues });

    return (
        <Avances>
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
                            {defaultValues &&
                                ` ${defaultValues.nombres} ${
                                    defaultValues.apellidos
                                } ${
                                    DOCUMENTOS[defaultValues.tipo_doc].split(
                                        " ",
                                    )[0]
                                } ${defaultValues.num_doc}${
                                    defaultValues.grupos
                                        ? " — " + defaultValues.grupos
                                        : ""
                                }`}
                        </DialogTitle>
                        <DialogContent>
                            <Stack spacing={2}>
                                <FormProvider {...methods}>
                                    <Grid container spacing={1.25}>
                                        {FormularioVerificacion.map(
                                            (slotProps, index) => {
                                                const {
                                                    Component,
                                                    size = {
                                                        xs: 12,
                                                        md: 6,
                                                    },
                                                    ...inputProps
                                                } = slotProps;

                                                const { name } =
                                                    inputProps?.controller ??
                                                    {};

                                                return Component ? (
                                                    [
                                                        "genero_otro",
                                                        "otra_conectividad",
                                                    ].includes(name) ||
                                                    name === undefined ? (
                                                        <Component
                                                            key={index}
                                                            inputProps={{
                                                                ...inputProps,
                                                                field: {
                                                                    ...inputProps.field,
                                                                    readOnly: true,
                                                                },
                                                            }}
                                                        />
                                                    ) : (
                                                        <Grid
                                                            key={index}
                                                            size={size}
                                                        >
                                                            <Component
                                                                inputProps={{
                                                                    ...inputProps,
                                                                    field: {
                                                                        ...inputProps.field,
                                                                        readOnly: true,
                                                                    },
                                                                }}
                                                            />
                                                        </Grid>
                                                    )
                                                ) : null;
                                            },
                                        )}
                                    </Grid>
                                </FormProvider>
                            </Stack>

                            <HistoryList historial={defaultValues.historial} />

                            <CourseProgressList
                                modulos={defaultValues.modulos}
                            />
                        </DialogContent>
                        <DialogActions
                            sx={{
                                justifyContent: "space-between",
                            }}
                        >
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
                </Modal>
            </Fragment>
        </Avances>
    );
}
