import Box from "@mui/joy/Box";
import { iconButtonClasses } from "@mui/joy/IconButton";
import Sheet from "@mui/joy/Sheet";
import Table from "@mui/joy/Table";
import Typography from "@mui/joy/Typography";

import Pagination from "@mui/material/Pagination";

import Button from "@mui/joy/Button";
import Checkbox from "@mui/joy/Checkbox";
import CircularProgress from "@mui/joy/CircularProgress";
import Stack from "@mui/joy/Stack";
import Tooltip from "@mui/joy/Tooltip";
import { range } from "lodash";
import { Fragment, useState } from "react";
import DevWrapper from "@/components/Wrapper/DevWrapper";

function getMessage(estado) {
    // (0, "No completado"),
    // (1, "Completado"),
    // (2, "Completado, mostrar aprobado"),
    // (3, "Completado, mostrar reprobado"),

    switch (estado) {
        case 1:
            return "Completado";
        case 2:
            return "Completado y aprobado";
        case 3:
            return "Completado y reprobado";
        default:
            return "No completado";
    }
}

export default function TablaAvances({ data, actividades, isFiltering }) {
    const [page, setPage] = useState(1);

    return (
        <Fragment>
            <DevWrapper>
                <Box
                    sx={{
                        position: "fixed",
                        top: 16,
                        right: 16,
                        zIndex: 1000,
                    }}
                >
                    <Typography
                        variant="h1"
                        component="h1"
                        sx={{ fontSize: 24, fontWeight: 500 }}
                    >
                        Total pagina:{" "}
                        {data?.chunked?.[page - 1]?.length ?? "..."}
                        <br />
                        Total registros:{" "}
                        {(data?.chunked?.length - 1) * 50 +
                            data?.chunked?.[data?.chunked?.length - 1]?.length -
                            1 ?? "..."}
                    </Typography>
                </Box>
            </DevWrapper>
            {isFiltering ? (
                <Stack
                    justifyContent="center"
                    alignContent="center"
                    alignItems="center"
                    sx={{
                        height: "700px",
                    }}
                >
                    <Button
                        variant="plain"
                        startDecorator={<CircularProgress />}
                        sx={(theme) => ({
                            p: 1,
                            color: "black !important",
                            [theme.getColorSchemeSelector("dark")]: {
                                color: "white !important",
                            },
                        })}
                        size="lg"
                        disabled
                    >
                        Filtrando información...
                    </Button>
                </Stack>
            ) : (
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
                                            width: 80,
                                            padding: "12px 6px",
                                        }}
                                    >
                                        Número de documento
                                    </th>
                                    <th
                                        style={{
                                            width: 120,
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
                                                    width: 25,
                                                    padding: "12px 6px",
                                                }}
                                            >
                                                <Typography
                                                    // className="verticalTableHeader"
                                                    level="body-xs"
                                                    noWrap
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
                                                width: 25,
                                                padding: "12px 6px",
                                            }}
                                        >
                                            <Typography
                                                // className="verticalTableHeader"
                                                level="body-xs"
                                                noWrap
                                            >
                                                Módulo completado
                                            </Typography>
                                        </th>
                                    </Tooltip>
                                </tr>
                            </thead>
                            <tbody>
                                {data?.chunked?.[page - 1]?.map((row) => (
                                    <Box
                                        component="tr"
                                        key={row.id}
                                        // onClick={() => onView(row.id)}
                                        className="pointer-row"
                                        // {...(hasPermission("usuario.change_persona")
                                        //     ? {
                                        //           onClick: () => onView(row.id),
                                        //       }
                                        //     : {})}

                                        {...(row.id === "resumen" && {
                                            sx: {
                                                // border: 1,
                                                bgcolor:
                                                    "rgba(31, 122, 31,.3) !important",
                                            },
                                        })}
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
                                                                title={`Usuarios que han completado la actividad: ${actividad}`}
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
                                                                            actividad
                                                                        }
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

                                                        return (
                                                            <Tooltip
                                                                key={id}
                                                                // title={getMessage(
                                                                //     estadoNumero
                                                                // )}
                                                                title="Completado"
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
                                                                                estadoNumero >=
                                                                                1
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
                                                            <Checkbox
                                                                readOnly
                                                            />
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
                                {data?.pages === 0 && (
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
                            count={data.pages || 1}
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
            )}
        </Fragment>
    );
}
