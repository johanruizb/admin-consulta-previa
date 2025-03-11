"use client";
import Button from "@mui/joy/Button";

import FileDownloadIcon from "@mui/icons-material/FileDownload";

import { Fragment, useEffect, useState } from "react";

import usePermissionContext from "@/components/Home/permissionContext/usePermission";
import { getURL } from "@/components/utils";
import useAlert from "@/hooks/useAlert";
import dayjs from "dayjs";
import { useFormContext, useWatch } from "react-hook-form";

function ExportAvances() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return mounted ? <Export /> : null;
}

function Export() {
    const { onOpen } = useAlert();
    const { isLoading: permissionIsLoading, hasPermission } =
        usePermissionContext();

    const [loading, setLoading] = useState(false);

    const { handleSubmit } = useFormContext();

    const onClick = (values) => {
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
                    onOpen(
                        `No se pudo exportar el archivo. (${String(
                            response?.statusText ?? response,
                        )})`,
                        "danger",
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
                    onOpen("Archivo exportado correctamente.", "success");
                }
            })
            .catch((error) => {
                onOpen(
                    `No se pudo exportar el archivo. (${String(
                        error?.statusText ?? error ?? "UNKNOWN_ERROR",
                    )})`,
                    "danger",
                );
            })
            .finally(() => {
                setLoading(false);
            });
    };

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
                        onClick={handleSubmit(onClick)}
                    >
                        Exportar avances
                    </Button>
                </Fragment>
            ) : null}
        </Fragment>
    );
}

export default ExportAvances;
