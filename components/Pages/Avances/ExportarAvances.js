"use client";
import Button from "@mui/joy/Button";

import FileDownloadIcon from "@mui/icons-material/FileDownload";

import { Fragment, useEffect, useState, useCallback } from "react";

import usePermissionContext from "@/components/Home/permissionContext/usePermission";
import { getURL } from "@/components/utils";
import dayjs from "dayjs";
import { useSnackbar } from "notistack";
import { useFormContext } from "react-hook-form";

function ExportAvances({ filterValues }) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return mounted ? <Export filterValues={filterValues} /> : null;
}

function Export({ filterValues }) {
    const { enqueueSnackbar } = useSnackbar();
    const { isLoading: permissionIsLoading, hasPermission } =
        usePermissionContext();

    const [loading, setLoading] = useState(false);

    const formContext = useFormContext();
    const handleSubmit = formContext?.handleSubmit;

    const exportData = useCallback(
        (values) => {
            setLoading(true);
            fetch(getURL("/api/moodle/reporte/exportar"), {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(values),
            })
                .then(async (response) => {
                    if (!response.ok) {
                        enqueueSnackbar(
                            `No se pudo exportar el archivo. (${String(
                                response?.statusText ?? response,
                            )})`,
                            { variant: "error" },
                        );
                    } else {
                        const blob = await response.blob();
                        const reader = new FileReader();
                        reader.onload = () => {
                            const link = document.createElement("a");
                            link.href = reader.result;
                            link.download = `Avance cursos_${dayjs().format(
                                "YYYY-MM-DD HH-mm-ss",
                            )}.xlsx`;
                            link.click();
                        };
                        reader.readAsDataURL(blob);
                        enqueueSnackbar("Archivo exportado correctamente.", { variant: "success" });
                    }
                })
                .catch((error) => {
                    enqueueSnackbar(
                        `No se pudo exportar el archivo. (${String(
                            error?.statusText ?? error ?? "UNKNOWN_ERROR",
                        )})`,
                        { variant: "error" },
                    );
                })
                .finally(() => {
                    setLoading(false);
                });
        },
        [enqueueSnackbar],
    );

    const onClick = useCallback(() => {
        if (filterValues) {
            exportData(filterValues);
        } else if (handleSubmit) {
            handleSubmit(exportData)();
        }
    }, [filterValues, handleSubmit, exportData]);

    return (
        <Fragment>
            {permissionIsLoading ? null : hasPermission(
                  "usuario.change_persona",
              ) ? (
                <Fragment>
                    <Button
                        startDecorator={<FileDownloadIcon />}
                        disabled={loading}
                        loading={loading}
                        onClick={onClick}
                    >
                        Exportar avances
                    </Button>
                </Fragment>
            ) : null}
        </Fragment>
    );
}

export default ExportAvances;
