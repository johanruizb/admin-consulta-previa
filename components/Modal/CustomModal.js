import Button from "@mui/joy/Button";
import DialogContent from "@mui/joy/DialogContent";
import DialogTitle from "@mui/joy/DialogTitle";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import Stack from "@mui/joy/Stack";
import { useMediaQuery } from "@mui/material";

import { useRouter } from "next/navigation";

import { Fragment } from "react";
import { FormProvider, useForm } from "react-hook-form";
import FormularioVerificacion from "../Form/constants";

export default function CustomModal() {
    const sm = useMediaQuery((theme) => theme.breakpoints.down("md"));
    const router = useRouter();

    const onClose = () => {
        router.back();
    };

    const methods = useForm();
    const { handleSubmit } = methods;

    const onSubmit = (data) => {
        console.log("data", data);
    };

    return (
        <Fragment>
            <Modal
                open
                onClose={onClose}
                sx={{
                    zIndex: 10001,
                }}
            >
                <ModalDialog layout={sm ? "fullscreen" : "center"}>
                    <DialogTitle>Verificar inscripción</DialogTitle>
                    <DialogContent>
                        Si hay algún error, edita los campos necesarios. Cuando
                        la información sea correcta presiona el botón "Validar"
                        para confirmar la inscripción.
                    </DialogContent>
                    <form
                        onSubmit={(event) => {
                            event.preventDefault();
                            setOpen(false);
                        }}
                    >
                        <Stack spacing={2}>
                            <FormProvider {...methods}>
                                {FormularioVerificacion.map(
                                    (slotProps, index) => {
                                        const { Component, ...others } =
                                            slotProps;
                                        return (
                                            <Component
                                                key={index}
                                                inputProps={others}
                                            />
                                        );
                                    }
                                )}
                            </FormProvider>
                            <Button onClick={handleSubmit(onSubmit)}>
                                Submit
                            </Button>
                        </Stack>
                    </form>
                </ModalDialog>
            </Modal>
        </Fragment>
    );
}
