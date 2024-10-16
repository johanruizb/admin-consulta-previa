import Button from "@mui/joy/Button";
import CircularProgress from "@mui/joy/CircularProgress";
import DialogActions from "@mui/joy/DialogActions";
import DialogContent from "@mui/joy/DialogContent";
import DialogTitle from "@mui/joy/DialogTitle";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import Stack from "@mui/joy/Stack";

import Backdrop from "@mui/material/Backdrop";
import Grid from "@mui/material/Grid2";
import useMediaQuery from "@mui/material/useMediaQuery";

import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";

import { useRouter } from "next/router";

import { Fragment, useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

import fetcher from "@/components/fetcher";
import FormularioVerificacion from "@/components/Form/constants";
import { convertToFormData, getURL } from "@/components/utils";

import { useSessionStorage } from "@uidotdev/usehooks";

import useSWRImmutable from "swr/immutable";

import usePermissionContext from "@/components/Home/permissionContext/usePermission";
import Navigate from "@/components/Navigate";
import Box from "@mui/joy/Box";
import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";
import ListItemContent from "@mui/joy/ListItemContent";
import ListItemDecorator from "@mui/joy/ListItemDecorator";
import Typography from "@mui/joy/Typography";
import dayjs from "dayjs";
import Registros from ".";

import { getIconHistory } from "@/components/Registros/functions";

export default function Wrapper() {
    const { isLoading: permissionIsLoading, hasPermission } =
        usePermissionContext();

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

    const ready =
        mounted && !permissionIsLoading && !isValidating && !isLoading;

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
    const [, saveConfig] = useSessionStorage("CustomAlert", {
        open: false,
        variant: "solid",
        color: "success",
        content: "",
    });

    const [loading, setLoading] = useState(false);

    const router = useRouter();
    const { id } = router.query;
    const sm = useMediaQuery((theme) => theme.breakpoints.down("md"));

    const onClose = () => {
        router.back();
    };

    const openAlert = (content, variant = "solid", color = "success") => {
        saveConfig({ open: true, variant, color, content });
    };

    const methods = useForm({ defaultValues });
    const { handleSubmit } = methods;

    const onSubmit = (data) => {
        delete data.historial;
        const formData = convertToFormData(data);

        setLoading(true);

        fetch(getURL("/api/usuarios/inscritos/" + id), {
            // headers: {
            //     "Content-Type": "multipart/form-data; boundary=----",
            // },
            method: "POST",
            body: formData,
        })
            .then(async (response) => {
                if (response.ok) {
                    openAlert(await response.json(), "solid", "success");
                    router.back();
                } else {
                    response
                        .json()
                        .then((data) => {
                            openAlert(
                                data?.message ??
                                    `Se ha producido un error (${response.statusText})`,
                                "solid",
                                "error"
                            );
                        })
                        .catch(() => {
                            openAlert(
                                `Se ha producido un error (${response.statusText})`,
                                "solid",
                                "error"
                            );
                        });
                }
            })
            .catch((error) => {
                openAlert(
                    `Se ha producido un error (${error.toString()})`,
                    "solid",
                    "error"
                );
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const validado = defaultValues.info_validada;

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
                            {validado
                                ? "Editar información"
                                : "Verificar inscripción"}
                        </DialogTitle>
                        <DialogContent>
                            {validado
                                ? `La persona ya ha sido validada. Si hay algún error, edita los campos necesarios y presiona el botón "Guardar".`
                                : `Si hay algún error, edita los campos necesarios. Cuando la información sea correcta presiona el botón "Validar".`}
                            <form
                                onSubmit={(event) => {
                                    event.preventDefault();
                                    setOpen(false);
                                }}
                            >
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
                                                                inputProps={
                                                                    inputProps
                                                                }
                                                            />
                                                        ) : (
                                                            <Grid
                                                                key={index}
                                                                size={size}
                                                            >
                                                                <Component
                                                                    inputProps={
                                                                        inputProps
                                                                    }
                                                                />
                                                            </Grid>
                                                        )
                                                    ) : null;
                                                }
                                            )}
                                        </Grid>
                                    </FormProvider>
                                </Stack>
                            </form>
                            <Box
                                sx={{
                                    mt: "10px",
                                }}
                            >
                                <DialogTitle>Historial de cambios</DialogTitle>
                                <List
                                    size="lg"
                                    variant="outlined"
                                    sx={{ borderRadius: "sm", mt: "10px" }}
                                >
                                    {defaultValues.historial.map(
                                        (item, index) => (
                                            <ListItem key={index}>
                                                <ListItemDecorator>
                                                    {getIconHistory(
                                                        item.history_type
                                                    )}
                                                </ListItemDecorator>
                                                <ListItemContent>
                                                    <Typography level="title-sm">
                                                        {item.history_type}{" "}
                                                        {item.has_user
                                                            ? `por ${
                                                                  item.history_user_fullname
                                                                      ? item.history_user_fullname +
                                                                        " (" +
                                                                        item.history_user_username +
                                                                        ")"
                                                                      : item.history_user_username
                                                              } — ${
                                                                  item.history_user_role
                                                              }`
                                                            : ""}
                                                    </Typography>
                                                    <Typography
                                                        level="body-sm"
                                                        noWrap
                                                    >
                                                        {dayjs(
                                                            item.history_date
                                                        ).format(
                                                            "DD/MM/YYYY HH:mm:ss A"
                                                        )}
                                                    </Typography>
                                                </ListItemContent>
                                            </ListItem>
                                        )
                                    )}
                                </List>
                            </Box>
                        </DialogContent>
                        <DialogActions
                            sx={{
                                justifyContent: "space-between",
                            }}
                        >
                            <Button
                                onClick={handleSubmit(onSubmit)}
                                variant="solid"
                                endDecorator={<SaveIcon />}
                                size="lg"
                                color={validado ? "primary" : "success"}
                                loading={loading}
                            >
                                {validado ? "Guardar" : "Validar"}
                            </Button>
                            <Button
                                onClick={onClose}
                                variant="plain"
                                startDecorator={<CloseIcon />}
                                size="lg"
                                disabled={loading}
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
