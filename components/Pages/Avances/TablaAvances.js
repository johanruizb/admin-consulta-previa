import Box from "@mui/joy/Box";
import { iconButtonClasses } from "@mui/joy/IconButton";
import Sheet from "@mui/joy/Sheet";
import Table from "@mui/joy/Table";
import Typography from "@mui/joy/Typography";

import Pagination from "@mui/material/Pagination";

import Checkbox from "@mui/joy/Checkbox";
import Tooltip from "@mui/joy/Tooltip";
import dayjs from "dayjs";
import { chunk, range } from "lodash";
import { Fragment, useEffect, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";

export default function TablaAvances({
    data,
    // actividades: propsActividades,
    // label,
    isValidating,
}) {
    const {
        actividades,
        label_completado: label,
        resultados: rows,
    } = data ?? {};
    const [page, setPage] = useState(1);

    const { control } = useFormContext();

    const values = useWatch({
        control,
    });

    const { modulo_completado: mc_filtro } = values;

    useEffect(() => {
        return () => {
            setPage(1);
        };
    }, [data]);

    return (
        <Fragment>
            <Fragment>
                <Sheet
                    className="OrderTableContainer"
                    variant="outlined"
                    sx={{
                        display: { xs: "none", sm: "initial" },
                        width: "100%",
                        borderRadius: "sm",
                        flexShrink: 1,
                        height: "calc(100vh - 200px)",
                        // height: "700px",
                        overflow: "auto",
                        // minHeight: 0,
                    }}
                >
                    <Table
                        aria-labelledby="tableTitle"
                        stickyHeader
                        hoverRow
                        sx={{
                            "--TableCell-headBackground":
                                "var(--joy-palette-background-level1)",
                            "--Table-headerUnderlineThickness": "1px",
                            "--TableRow-hoverBackground":
                                "var(--joy-palette-background-level1)",
                            "--TableCell-paddingY": "4px",
                            "--TableCell-paddingX": "8px",
                        }}
                    >
                        <thead>
                            <tr>
                                <th
                                    style={{
                                        width: 10,
                                        padding: "12px 6px",
                                    }}
                                >
                                    Número de documento
                                </th>
                                <th
                                    style={{
                                        width: 30,
                                        padding: "12px 6px",
                                    }}
                                >
                                    Nombre completo
                                </th>
                                {actividades?.map((actividad) => (
                                    <Tooltip
                                        key={actividad.id}
                                        title={actividad.name}
                                        placement="left"
                                        arrow
                                    >
                                        <th
                                            style={{
                                                width: 60 / actividades.length,
                                                padding: "12px 6px",
                                            }}
                                        >
                                            <Typography
                                                // className="verticalTableHeader"
                                                level="body-xs"
                                                noWrap
                                                textAlign="center"
                                            >
                                                {actividad.name}
                                            </Typography>
                                        </th>
                                    </Tooltip>
                                ))}
                                <Tooltip
                                    title="Módulo completado"
                                    placement="left"
                                    arrow
                                >
                                    <th
                                        style={{
                                            width: 10,
                                            padding: "12px 6px",
                                        }}
                                    >
                                        <Typography
                                            // className="verticalTableHeader"
                                            level="body-xs"
                                            noWrap
                                            textAlign="center"
                                        >
                                            {label ?? "Módulo completado"}
                                        </Typography>
                                    </th>
                                </Tooltip>
                            </tr>
                        </thead>
                        <tbody>
                            {rows?.chunked?.[page - 1]?.map((row) => (
                                <Box
                                    component="tr"
                                    key={row.id}
                                    className="pointer-row"
                                    sx={{
                                        bgcolor:
                                            row.id === "resumen"
                                                ? "rgba(11, 107, 203, 0.25) !important"
                                                : row.modulo_completado &&
                                                  mc_filtro === "all"
                                                ? "rgba(31, 122, 31, 0.2) !important"
                                                : "transparent",
                                    }}
                                >
                                    {row.id === "resumen" ? (
                                        <Fragment>
                                            <td colSpan={2}>
                                                <Typography
                                                    level="body-sm"
                                                    textAlign="center"
                                                    fontWeight="bold"
                                                >
                                                    {row.usuario}
                                                </Typography>
                                            </td>
                                            {row.actividades.map(
                                                (actividad, index) => {
                                                    return (
                                                        <Tooltip
                                                            key={index}
                                                            title={`Usuarios que lo han completado: ${actividad}`}
                                                            placement="top"
                                                            arrow
                                                        >
                                                            <td>
                                                                <Typography
                                                                    level="body-sm"
                                                                    textAlign="center"
                                                                    fontWeight="bold"
                                                                >
                                                                    {actividad}
                                                                </Typography>
                                                            </td>
                                                        </Tooltip>
                                                    );
                                                }
                                            )}
                                            <Tooltip
                                                title={`Usuarios que han completado el módulo: ${row.modulo_completado_t}`}
                                                placement="top"
                                                arrow
                                            >
                                                <td>
                                                    <Typography
                                                        level="body-sm"
                                                        textAlign="center"
                                                        fontWeight="bold"
                                                    >
                                                        {
                                                            row.modulo_completado_t
                                                        }
                                                    </Typography>
                                                </td>
                                            </Tooltip>
                                        </Fragment>
                                    ) : (
                                        <Fragment>
                                            <td>
                                                <Typography level="body-sm">
                                                    {row.documento}
                                                </Typography>
                                            </td>
                                            <td>
                                                <Typography level="body-sm">
                                                    {row.usuario}
                                                </Typography>
                                            </td>
                                            {row.actividades.map(
                                                (actividad) => {
                                                    // Generated by Copilot
                                                    const { estado, id } =
                                                        actividad;

                                                    const estadoNumero =
                                                        Number(estado);

                                                    const completado =
                                                        estadoNumero >= 1;

                                                    return (
                                                        <Tooltip
                                                            key={id}
                                                            // title={getMessage(
                                                            //     estadoNumero
                                                            // )}
                                                            title={
                                                                actividad.fecha
                                                                    ? completado
                                                                        ? `${dayjs(
                                                                              actividad.fecha
                                                                          ).format(
                                                                              "DD [de] MMMM [de] YYYY, [a las] HH:mm:ss a"
                                                                          )}`
                                                                        : "Actividad no completada"
                                                                    : completado
                                                                    ? "Módulo completado"
                                                                    : "Módulo no completado"
                                                            }
                                                            placement="top"
                                                            arrow
                                                        >
                                                            <td>
                                                                <Box
                                                                    component="span"
                                                                    sx={{
                                                                        display:
                                                                            "flex",
                                                                        justifyContent:
                                                                            "center",
                                                                    }}
                                                                >
                                                                    <Checkbox
                                                                        readOnly
                                                                        checked={
                                                                            completado
                                                                        }
                                                                        // color={
                                                                        //     estadoNumero ===
                                                                        //     3
                                                                        //         ? "danger"
                                                                        //         : estadoNumero ===
                                                                        //           2
                                                                        //         ? "success"
                                                                        //         : "primary"
                                                                        // }
                                                                        // color="primary"
                                                                    />
                                                                </Box>
                                                            </td>
                                                        </Tooltip>
                                                    );
                                                }
                                            )}
                                            {range(
                                                0,
                                                actividades.length -
                                                    row.actividades.length
                                            ).map((item) => (
                                                <td key={item}>
                                                    <Box
                                                        component="span"
                                                        sx={{
                                                            display: "flex",
                                                            justifyContent:
                                                                "center",
                                                        }}
                                                    >
                                                        <Checkbox readOnly />
                                                    </Box>
                                                </td>
                                            ))}
                                            <Tooltip
                                                title={
                                                    row.modulo_completado
                                                        ? "El módulo fue completado por el usuario"
                                                        : "El módulo aun no ha sido completado por el usuario"
                                                }
                                                placement="top"
                                                arrow
                                            >
                                                <td>
                                                    <Box
                                                        component="span"
                                                        sx={{
                                                            display: "flex",
                                                            justifyContent:
                                                                "center",
                                                        }}
                                                    >
                                                        <Checkbox
                                                            readOnly
                                                            checked={
                                                                row.modulo_completado
                                                            }
                                                            color={
                                                                row.modulo_completado
                                                                    ? "success"
                                                                    : "neutral"
                                                            }
                                                        />
                                                    </Box>
                                                </td>
                                            </Tooltip>
                                        </Fragment>
                                    )}
                                </Box>
                            ))}
                            {rows?.pages === 0 && (
                                <tr>
                                    <td colSpan={actividades.length + 3}>
                                        <Typography textAlign="center">
                                            No hay registros.
                                        </Typography>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </Sheet>
                <Box
                    className="Pagination-laptopUp"
                    sx={{
                        pt: 2,
                        gap: 1,
                        [`& .${iconButtonClasses.root}`]: {
                            borderRadius: "50%",
                        },
                        display: {
                            xs: "none",
                            md: "flex",
                        },
                        ".MuiPagination-root": {
                            width: "100% !important",
                        },
                    }}
                >
                    <Pagination
                        size="medium"
                        page={page}
                        count={rows.pages || 1}
                        variant="outlined"
                        onChange={(_, page) => setPage(page)}
                        sx={{
                            ".MuiPagination-ul": {
                                width: "100%",
                                justifyContent: "center",
                            },
                        }}
                    />
                </Box>
            </Fragment>
        </Fragment>
    );
}
