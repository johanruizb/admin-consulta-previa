import DialogActions from "@mui/joy/DialogActions";
import Button from "@mui/joy/Button";
import DialogTitle from "@mui/joy/DialogTitle";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import { FormProvider, useForm } from "react-hook-form";

import SaveIcon from "@mui/icons-material/Save";
import useMediaQuery from "@mui/material/useMediaQuery";
import Grid from "@mui/material/Grid2";
import { SettingsForm } from "./constants";

import { useColorScheme as useJoyColorScheme } from "@mui/joy/styles";
import { useColorScheme as useMaterialColorScheme } from "@mui/material/styles";
import useSettingsContext from "./settingsContext/useSettings";

export default function Settings({ open, onClose }) {
    const { setMode: setMaterialMode } = useMaterialColorScheme();
    const { setMode: setJoyMode } = useJoyColorScheme();

    // const [settings, setSettings] = useLocalStorage("settings_app", {});
    const { settings, saveSettings: setSettings } = useSettingsContext();

    const methods = useForm({
        defaultValues: settings,
    });

    const small = useMediaQuery((theme) => theme.breakpoints.down("md"));

    const onSave = (data) => {
        setSettings(data);
        setMaterialMode(data.colorScheme);
        setJoyMode(data.colorScheme);

        onClose();
        // window.location.reload();
    };

    return (
        <Modal open={open} onClose={onClose} keepMounted={false}>
            <ModalDialog
                slotProps={{
                    root: {
                        sx: small
                            ? {}
                            : {
                                  width: "70%",
                              },
                    },
                }}
            >
                <DialogTitle>Ajustes de la app</DialogTitle>
                <FormProvider {...methods}>
                    <Grid container spacing={1.25}>
                        {SettingsForm.map((slotProps, index) => {
                            const {
                                Component,
                                size = {
                                    xs: 12,
                                    md: 6,
                                },
                                ...inputProps
                            } = slotProps;

                            return Component ? (
                                <Grid key={index} size={size}>
                                    <Component inputProps={inputProps} />
                                </Grid>
                            ) : null;
                        })}
                    </Grid>
                </FormProvider>
                <DialogActions>
                    <Button
                        onClick={methods.handleSubmit(onSave)}
                        startDecorator={<SaveIcon />}
                    >
                        Guardar
                    </Button>
                    <Button onClick={onClose} variant="plain">
                        Cerrar
                    </Button>
                </DialogActions>
            </ModalDialog>
        </Modal>
    );
}
