import fetcher from "@/components/fetcher";
import { getURL } from "@/components/utils";
import useAlert from "@/hooks/useAlert";
import usePermission from "@/hooks/usePermission";
import CloseIcon from "@mui/icons-material/Close";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
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

import pako from "pako";

async function compressGzip(file) {
    // 1. Leer el archivo como ArrayBuffer
    const arrayBuffer = await file.arrayBuffer(); // Fetch API/Blob API :contentReference[oaicite:3]{index=3}
    // 2. Comprimir con pako.gzip (nivel máximo)
    const compressed = pako.gzip(new Uint8Array(arrayBuffer), { level: 9 }); // API pako.gzip :contentReference[oaicite:4]{index=4}
    // 3. Crear un Blob con el tipo adecuado
    return new Blob([compressed], { type: "application/gzip" });
}

function DialogoCarga({ open, setOpen }) {
    const { onOpen } = useAlert();

    const { data: procesando, mutate: mutateProcesando } = useSWR(
        getURL("/api/moodle/reporte/procesando"),
    );

    const [loading, setLoading] = useState(false);

    const methods = useForm();
    const { handleSubmit, reset } = methods;

    const onSubmit = async (data) => {
        setLoading(true);
        // const formData = new FormData();
        // formData.append("csv", data.csv);

        const compressedBlob = await compressGzip(data.csv);
        const formData = new FormData();
        // Es importante pasar nombre de fichero para que el servidor lo reconozca
        formData.append("csv", compressedBlob, "reporte.csv.gz"); // MDN FormData.append :contentReference[oaicite:5]{index=5}

        // Calcular el tamaño del archivo comprimido
        const fileSize = compressedBlob.size;
        const fileSizeInMB = (fileSize / (1024 * 1024)).toFixed(2); // Convertir a MB

        fetch(getURL("/api/moodle/reporte"), {
            method: "POST",
            // headers: { "Content-Encoding": "gzip", "Content-Type": "text/csv" },
            headers: { "Content-Encoding": "gzip" }, // Indica al servidor que el cuerpo está gzippeado
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
                        "danger",
                    );
                }
            })
            .catch((error) => {
                onOpen(
                    `Se ha producido un error (${error.toString()})`,
                    "danger",
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
                    exportación de avances de moodle usando el plugin
                    &quot;Consultas ad hoc de la base de datos&quot;.
                    <br />
                    <br />
                    <Typography>
                        Puede descargar el archivo mas actualizado desde el
                        siguiente{" "}
                        <Link
                            component="a"
                            href="https://campus.consultaprevia.net/report/customsql/view.php?id=2"
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
                            "DD/MM/YYYY HH:mm:ss",
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
    const [options, setOptions] = useState({});

    const { data, isLoading, isValidating, error } = useSWR(
        getURL("/api/moodle/reporte/procesando"),
        fetcher,
        options,
    );

    const { mutate } = useSWRConfig();

    const [open, setOpen] = useLocalStorage("open_UploadAvances", false);

    const previousData = usePrevious(data);
    const { onOpen } = useAlert();

    useEffect(() => {
        if (data?.task_in_progress) {
            setOptions({ refreshInterval: 1000, revalidateOnMount: true });
        } else if (previousData?.task_in_progress) {
            onOpen(
                data?.last_task_message,
                data?.last_task_status ? "success" : "danger",
            );
            mutate((key) => Array.isArray(key));
            setOptions({});
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
