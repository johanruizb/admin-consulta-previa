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

import useSWRImmutable from "swr/immutable";

import fetcher from "@/components/fetcher";
import FormularioVerificacion from "@/components/Form/constants";
import { getURL } from "@/components/utils";

import { useSessionStorage } from "@uidotdev/usehooks";

import Registros from ".";

export default function Wrapper() {
    const [mounted, setMounted] = useState(false);
    const router = useRouter();
    const { id } = router.query;

    const { data: values } = useSWRImmutable(
        getURL("/api/usuarios/inscritos/" + id),
        fetcher
    );

    useEffect(() => {
        setMounted(true);
    }, []);

    return values && mounted ? (
        <View defaultValues={values} />
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
        setLoading(true);
        delete data.foto_doc1;
        delete data.foto_doc2;

        fetch(getURL("/api/usuarios/inscritos/" + id), {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                ...data,
                info_validada: true,
            }),
        })
            .then(async (response) => {
                openAlert(await response.json(), "solid", "success");
                router.back();
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
                                                        ...inputProps
                                                    } = slotProps;

                                                    const { name } =
                                                        inputProps?.controller ??
                                                        {};

                                                    return Component ? (
                                                        name ===
                                                            "genero_otro" ||
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
                                                                size={{
                                                                    xs: 12,
                                                                    md: 6,
                                                                }}
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
