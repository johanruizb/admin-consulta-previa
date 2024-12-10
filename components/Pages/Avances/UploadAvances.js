import CloseIcon from "@mui/icons-material/Close";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";

import { convertToFormData, getURL } from "@/components/utils";
import useAlert from "@/hooks/useAlert";
import usePermission from "@/hooks/usePermission";
import Button from "@mui/joy/Button";
import DialogActions from "@mui/joy/DialogActions";
import DialogContent from "@mui/joy/DialogContent";
import DialogTitle from "@mui/joy/DialogTitle";
import Link from "@mui/joy/Link";
import ModalDialog from "@mui/joy/ModalDialog";
import Typography from "@mui/joy/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Modal from "@mui/material/Modal";
import { useLocalStorage, usePrevious } from "@uidotdev/usehooks";
import dayjs from "dayjs";
import { Fragment, useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import useSWR, { useSWRConfig } from "swr";
import CSVField from "./CSVField";

function DialogoCarga({ open, setOpen }) {
    const { onOpen } = useAlert();

    const { data: procesando, mutate: mutateProcesando } = useSWR(
        getURL("/api/moodle/reporte/procesando")
    );

    const [loading, setLoading] = useState(false);

    const methods = useForm();
    const { handleSubmit, reset } = methods;

    const onSubmit = (data) => {
        setLoading(true);

        const formData = convertToFormData(data);

        fetch(getURL("/api/moodle/reporte"), {
            method: "POST",
            body: formData,
        })
            .then(async (response) => {
                const result = await response.json();
                if (response.ok) {
                    onOpen(result.message, "success");
                    onClose();
                } else {
                    onOpen(
                        result?.message ??
                            `Se ha producido un error (${response.statusText})`,
                        "danger"
                    );
                }
            })
            .catch((error) => {
                onOpen(
                    `Se ha producido un error (${error.toString()})`,
                    "danger"
                );
            })
            .finally(() => {
                setLoading(false);
                mutateProcesando();
            });
    };

    const onClose = () => {
        reset();
        setOpen(false);
    };

    return (
        <Modal open={open} onClose={onClose}>
            <ModalDialog>
                <DialogTitle>Cargar avances en formato CSV</DialogTitle>
                <DialogContent>
                    Por favor, seleccione un archivo CSV con los avances a
                    cargar. Unicamente se aceptan archivos que provengan de la
                    exportación de avances de moodle usando el plugin "Consultas
                    ad hoc de la base de datos".
                    <br />
                    <br />
                    <Typography>
                        Puede descargar el archivo mas actualizado desde el
                        siguiente{" "}
                        <Link
                            component="a"
                            href="https://campus.consultaprevia.co/report/customsql/view.php?id=2"
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{
                                width: "fit-content",
                            }}
                        >
                            enlace
                            <OpenInNewIcon />
                        </Link>
                    </Typography>
                </DialogContent>
                <FormProvider {...methods}>
                    <CSVField />
                </FormProvider>
                {procesando?.last_task && (
                    <Typography>
                        Ultima actualización:{" "}
                        {dayjs(procesando.last_task).format(
                            "DD/MM/YYYY HH:mm:ss"
                        )}{" "}
                        ({procesando.last_task_status ? "Exitoso" : "Fallido"})
                    </Typography>
                )}
                <DialogActions
                    sx={{
                        justifyContent: "space-between",
                    }}
                >
                    <Button
                        onClick={handleSubmit(onSubmit)}
                        variant="solid"
                        endDecorator={<CloudUploadIcon />}
                        size="lg"
                        loading={loading}
                    >
                        Cargar
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
    );
}

export default function UploadAvances() {
    const { data, isLoading, isValidating, error } = useSWR(
        getURL("/api/moodle/reporte/procesando"),
        { refreshInterval: 2500 }
    );

    const { mutate } = useSWRConfig();

    const [open, setOpen] = useLocalStorage("open_UploadAvances", false);

    const previousData = usePrevious(data);
    const { onOpen } = useAlert();

    useEffect(() => {
        if (previousData?.task_in_progress) {
            onOpen(
                data?.last_task_message,
                data?.last_task_status ? "success" : "danger"
            );
            mutate((key) => {
                console.log(key);
                return Array.isArray(key);
            });
        }
    }, [data, previousData]);

    usePermission("moodle.add_actividadescompletadas");

    return (
        <Fragment>
            <Button
                color="primary"
                startDecorator={<CloudUploadIcon />}
                onClick={() => setOpen(true)}
                endDecorator={
                    isLoading | isValidating | data?.task_in_progress ? (
                        <CircularProgress size={20} />
                    ) : error ? (
                        <ReportProblemIcon color="error" />
                    ) : (
                        <CircularProgress
                            size={20}
                            sx={{
                                visibility: "hidden",
                            }}
                        />
                    )
                }
                disabled={data?.task_in_progress}
            >
                {data?.task_in_progress
                    ? `Procesando datos...`
                    : "Cargar avances en formato CSV"}
            </Button>
            <DialogoCarga open={open} setOpen={setOpen} />
        </Fragment>
    );
}
