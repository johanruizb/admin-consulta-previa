"use client";

import Button from "@mui/joy/Button";
import ButtonGroup from "@mui/joy/ButtonGroup";
import IconButton from "@mui/joy/IconButton";
import Menu from "@mui/joy/Menu";
import MenuItem from "@mui/joy/MenuItem";

import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import FileDownloadIcon from "@mui/icons-material/FileDownload";

import { Fragment, useEffect, useRef, useState } from "react";
import { getURL } from "../utils";

import useAlert from "@/hooks/useAlert";
import { useLocalStorage, useSessionStorage } from "@uidotdev/usehooks";
import dayjs from "dayjs";
import usePermissionContext from "../Home/permissionContext/usePermission";

const options = [
    {
        label: "Exportar todos los inscritos",
    },
    {
        value: 1,
        label: "Exportar "Curso de grupos étnicos"",
    },
    {
        value: 2,
        label: "Exportar "Curso de capacidades institucionales"",
    },
];

function ExportUsers() {
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
    const [open, setOpen] = useState(false);
    const actionRef = useRef(null);
    const anchorRef = useRef(null);
    const [selectedIndex, setSelectedIndex] = useLocalStorage(
        "ExportUsers__selectedIndex",
        0
    );

    const onClick = () => {
        setLoading(true);
        fetch(
            getURL(
                "/api/usuarios/exportar/inscritos" +
                    (options[selectedIndex].value
                        ? "/" + options[selectedIndex].value
                        : "")
            ),
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        )
            .then(async (response) => {
                if (!response.ok) {
                    onOpen(
                        `No se pudo exportar el archivo. (${String(
                            response?.statusText ?? response
                        )})`,
                        "danger"
                    );
                } else {
                    const blob = await response.blob();
                    const reader = new FileReader();
                    reader.onload = () => {
                        const link = document.createElement("a");
                        link.href = reader.result;
                        link.download = `Personas inscritas_${dayjs().format(
                            "YYYY-MM-DD HH-mm-ss"
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
                        error?.statusText ?? error ?? "UNKNOWN_ERROR"
                    )})`,
                    "danger"
                );
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const handleMenuItemClick = (event, index) => {
        setSelectedIndex(index);
        setOpen(false);
    };

    return (
        <Fragment>
            {permissionIsLoading ? null : hasPermission(
                  "usuario.change_persona"
              ) ? (
                <Fragment>
                    <ButtonGroup
                        ref={anchorRef}
                        variant="solid"
                        color="primary"
                        aria-label="split button"
                    >
                        <Button
                            startDecorator={<FileDownloadIcon />}
                            disabled={loading}
                            loading={loading}
                            onClick={onClick}
                        >
                            {options[selectedIndex].label}
                        </Button>
                        <IconButton
                            aria-controls={
                                open ? "split-button-menu" : undefined
                            }
                            aria-expanded={open ? "true" : undefined}
                            aria-label="select merge strategy"
                            aria-haspopup="menu"
                            onMouseDown={() => {
                                actionRef.current = () => setOpen(!open);
                            }}
                            onKeyDown={() => {
                                actionRef.current = () => setOpen(!open);
                            }}
                            onClick={() => {
                                actionRef.current?.();
                            }}
                            disabled={loading}
                            // loading={loading}
                        >
                            <ArrowDropDownIcon />
                        </IconButton>
                    </ButtonGroup>
                    <Menu
                        open={open}
                        onClose={() => setOpen(false)}
                        anchorEl={anchorRef.current}
                    >
                        {options.map((option, index) => (
                            <MenuItem
                                key={index}
                                selected={index === selectedIndex}
                                onClick={(event) =>
                                    handleMenuItemClick(event, index)
                                }
                            >
                                {option.label}
                            </MenuItem>
                        ))}
                    </Menu>
                </Fragment>
            ) : null}
        </Fragment>
    );
}

export default ExportUsers;
