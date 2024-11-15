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
    const methods = useForm();
    const { handleSubmit, reset } = methods;

    const [loading, setLoading] = useState(false);
    const { onOpen } = useAlert();

    const { mutate } = useSWRConfig();

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
                setTimeout(() => {
                    mutate(
                        getURL("/api/moodle/reporte/procesando"),
                        undefined,
                        {
                            revalidate: true,
                        }
                    );
                }, 250);
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
    const [options, setOptions] = useState({});

    const { data, isLoading, isValidating, error } = useSWR(
        getURL("/api/moodle/reporte/procesando"),
        options
    );

    const { mutate } = useSWRConfig();

    const [open, setOpen] = useLocalStorage("open_UploadAvances", false);
    const [time, setTime] = useState({
        seconds: 0,
    });

    const previousData = usePrevious(data);
    const { onOpen } = useAlert();

    useEffect(() => {
        if (data?.procesando) {
            setOptions({
                refreshInterval: 5000,
            });

            const diff = dayjs().diff(dayjs(data.ultima_tarea), "s");
            setTime({
                seconds: diff,
            });

            const interval = setInterval(() => {
                setTime((prev) => ({
                    seconds: prev.seconds + 1,
                }));
            }, 1000);

            return () => clearInterval(interval);
        } else {
            if (previousData?.procesando) {
                onOpen(
                    data?.ultima_tarea_exitosa
                        ? "Datos procesados correctamente"
                        : "Se ha producido un error al procesar los datos",
                    data?.ultima_tarea_exitosa ? "success" : "danger"
                );
                mutate(
                    // test regex from `${getURL("/api/moodle/reporte/")}\d+`
                    (key) => key?.match?.(/\/api\/moodle\/reporte\/\d+/),
                    undefined,
                    {
                        revalidate: true,
                    }
                );
                // location.reload();
            }
            setTime({
                seconds: 0,
            });
            setOptions({});
        }
    }, [data]);

    usePermission("moodle.add_actividadescompletadas");

    return (
        <Fragment>
            <Button
                color="primary"
                startDecorator={<CloudUploadIcon />}
                onClick={() => setOpen(true)}
                endDecorator={
                    isLoading | isValidating | data?.procesando ? (
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
                disabled={data?.procesando}
            >
                {data?.procesando
                    ? `Procesando datos (${time.seconds}s)`
                    : "Cargar avances en formato CSV"}
            </Button>
            <DialogoCarga open={open} setOpen={setOpen} />
        </Fragment>
    );
}
