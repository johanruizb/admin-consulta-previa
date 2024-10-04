"use client";

import Button from "@mui/joy/Button";

import FileDownloadIcon from "@mui/icons-material/FileDownload";

import { Fragment, useEffect, useState } from "react";
import { getURL } from "../utils";

import dayjs from "dayjs";
import usePermissionContext from "../Home/permissionContext/usePermission";
import { useSessionStorage } from "@uidotdev/usehooks";

function ExportUsers() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return mounted ? <Export /> : null;
}

function Export() {
    const [, saveAlert] = useSessionStorage("CustomAlert", {
        open: false,
        variant: "solid",
        color: "success",
        content: "",
    });
    const { isLoading: permissionIsLoading, hasPermission } =
        usePermissionContext();

    const [loading, setLoading] = useState(false);

    const onClick = () => {
        setLoading(true);
        fetch(getURL("/api/usuarios/exportar/inscritos"), {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then(async (response) => {
                if (!response.ok) {
                    saveAlert({
                        open: true,
                        variant: "solid",
                        color: "error",
                        content: `No se pudo exportar el archivo. (${String(
                            response?.statusText ?? response
                        )})`,
                    });
                } else {
                    const blob = await response.blob();
                    const reader = new FileReader();
                    reader.onload = () => {
                        const link = document.createElement("a");
                        link.href = reader.result;
                        link.download = `inscritos-${dayjs().format(
                            "YYYY-MM-DD HH-mm-ss"
                        )}.xlsx`;
                        link.click();
                    };
                    reader.readAsDataURL(blob);
                    saveAlert({
                        open: true,
                        variant: "solid",
                        color: "success",
                        content: "Archivo exportado correctamente.",
                    });
                }
            })
            .catch((error) => {
                console.error(
                    "There has been a problem with your fetch operation:",
                    error
                );
                saveAlert({
                    open: true,
                    variant: "solid",
                    color: "error",
                    content: `No se pudo exportar el archivo. (${String(
                        error?.statusText ?? error
                    )})`,
                });
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <Fragment>
            {permissionIsLoading ? null : hasPermission(
                  "usuario.change_persona"
              ) ? (
                <Button
                    startDecorator={<FileDownloadIcon />}
                    onClick={onClick}
                    disabled={loading}
                    loading={loading}
                >
                    Exportar XLSX
                </Button>
            ) : null}
        </Fragment>
    );
}

export default ExportUsers;
