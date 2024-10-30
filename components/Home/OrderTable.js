/* eslint-disable jsx-a11y/anchor-is-valid */
import Box from "@mui/joy/Box";
import Chip from "@mui/joy/Chip";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import { iconButtonClasses } from "@mui/joy/IconButton";
import Input from "@mui/joy/Input";
import Option from "@mui/joy/Option";
import Select from "@mui/joy/Select";
import Sheet from "@mui/joy/Sheet";
import Table from "@mui/joy/Table";
import Typography from "@mui/joy/Typography";

import BlockIcon from "@mui/icons-material/Block";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import SearchIcon from "@mui/icons-material/Search";
import Pagination from "@mui/material/Pagination";

import Fuse from "fuse.js";

import dayjs from "dayjs";

import { chunk, debounce } from "lodash";

import { Fragment, useCallback, useEffect, useMemo, useState } from "react";

import CircularProgress from "@mui/joy/CircularProgress";
import Stack from "@mui/joy/Stack";
import { v4 as uuidv4 } from "uuid";
import usePermissionContext from "./permissionContext/usePermission";

import { cloneDeep } from "lodash";

export default function OrderTable({ data, onView }) {
    const { isLoading: permissionIsLoading, hasPermission } =
        usePermissionContext();

    const [page, setPage] = useState(1);
    const [filter, setFilter] = useState({});

    const [rows, setRows] = useState();

    const filterData = (d, filter) => {
        let result = cloneDeep(d);

        result = d.filter((row) => {
            const curso_inscrito = filter.curso_inscrito
                ? String(row.curso_inscrito) === String(filter.curso_inscrito)
                : true;
            const info_validada = filter.info_validada
                ? String(row.info_validada) === String(filter.info_validada)
                : true;

            return curso_inscrito && info_validada;
        });

        if (filter.search !== undefined) {
            const fuse = new Fuse(result, {
                keys: [
                    "num_doc",
                    "nombres",
                    "apellidos",
                    "telefono1",
                    "estado_name",
                ],
                // useExtendedSearch: true,
                threshold: 0.3,
            });
            // result = fuse.search("=" + filter.search).map((item) => item.item);
            result = fuse.search(filter.search).map((item) => item.item);
        }

        const chunkedList = chunk(result, 50);

        setRows((prev) => ({
            ...prev,
            filtered: result,
            chunked: chunkedList,
            pages: chunkedList.length,
        }));
    };

    const debounceFilter = useCallback(
        debounce((d, f) => filterData(d, f), 300),
        []
    );

    useEffect(() => {
        debounceFilter(data, filter);
    }, [data, filter]);

    const ready = useMemo(
        () => !permissionIsLoading && rows,
        [permissionIsLoading, rows]
    );

    // const ready = false;

    return (
        <Fragment>
            <Box
                className="SearchAndFilters-tabletUp"
                sx={{
                    // py: 2,
                    // pb: 1.25,
                    borderRadius: "sm",
                    display: { xs: "none", sm: "flex" },
                    flexWrap: "wrap",
                    gap: 1.5,
                    "& > *": {
                        minWidth: { xs: "120px", md: "160px" },
                    },
                }}
            >
                <FormControl sx={{ flex: 1 }} size="sm">
                    <FormLabel>Buscar</FormLabel>
                    <Input
                        size="sm"
                        placeholder="Buscar en la tabla"
                        onChange={(e) => {
                            const value = e.target.value;
                            setFilter((prev) => ({
                                ...prev,
                                search: value || undefined,
                            }));
                        }}
                        startDecorator={<SearchIcon />}
                    />
                </FormControl>
                <FormControl size="sm">
                    <FormLabel>Estado</FormLabel>
                    <Select
                        size="sm"
                        placeholder="Filtrar por estado"
                        slotProps={{ button: { sx: { whiteSpace: "nowrap" } } }}
                        onChange={(e, newValue) => {
                            setFilter((prev) => ({
                                ...prev,
                                info_validada:
                                    newValue !== "" ? newValue : undefined,
                            }));
                        }}
                        value={filter.info_validada ?? ""}
                    >
                        <Option value={""}>Todos</Option>
                        <Option value={"true"}>Validado</Option>
                        <Option value={"false"}>No validado</Option>
                    </Select>
                </FormControl>
                <FormControl size="sm">
                    <FormLabel>Curso inscrito</FormLabel>
                    <Select
                        size="sm"
                        placeholder="Filtrar por curso inscrito"
                        slotProps={{ button: { sx: { whiteSpace: "nowrap" } } }}
                        onChange={(e, newValue) => {
                            setFilter((prev) => ({
                                ...prev,
                                curso_inscrito:
                                    newValue !== "" ? newValue : undefined,
                            }));
                        }}
                        value={filter.curso_inscrito ?? ""}
                    >
                        <Option value={""}>Todos</Option>
                        <Option value={1}>
                            Curso virtual de autoformación en Consulta Previa -
                            Grupos étnicos (20 horas)
                        </Option>
                        <Option value={2}>
                            Curso virtual de autoformación en consulta previa
                            para fortalecimiento de capacidades institucionales
                            (20 horas)
                        </Option>
                    </Select>
                </FormControl>
            </Box>
            {ready ? (
                <Fragment>
                    <Sheet
                        className="OrderTableContainer"
                        variant="outlined"
                        sx={{
                            display: { xs: "none", sm: "initial" },
                            width: "100%",
                            borderRadius: "sm",
                            flexShrink: 1,
                            overflow: "auto",
                            minHeight: 0,
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
                                            width: 140,
                                            padding: "12px 6px",
                                        }}
                                    >
                                        Fecha de registro
                                    </th>
                                    <th
                                        style={{
                                            width: 120,
                                            padding: "12px 6px",
                                        }}
                                    >
                                        Tipo de documento
                                    </th>
                                    <th
                                        style={{
                                            width: 120,
                                            padding: "12px 6px",
                                        }}
                                    >
                                        Número de documento
                                    </th>
                                    <th
                                        style={{
                                            width: 180,
                                            padding: "12px 6px",
                                        }}
                                    >
                                        Nombre completo
                                    </th>
                                    <th
                                        style={{
                                            width: 100,
                                            padding: "12px 6px",
                                        }}
                                    >
                                        Teléfono
                                    </th>
                                    <th
                                        style={{
                                            width: 160,
                                            padding: "12px 6px",
                                        }}
                                    >
                                        Departamento de residencia
                                    </th>
                                    <th
                                        style={{
                                            width: 100,
                                            padding: "12px 6px",
                                        }}
                                    >
                                        Estado
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {rows?.chunked?.[page - 1]?.map((row) => (
                                    <tr
                                        key={uuidv4()}
                                        // onClick={() => onView(row.id)}
                                        className="pointer-row"
                                        {...(hasPermission(
                                            "usuario.change_persona"
                                        )
                                            ? {
                                                  onClick: () => onView(row.id),
                                              }
                                            : {})}
                                    >
                                        <td>
                                            <Typography level="body-sm">
                                                {dayjs(row.created_at).format(
                                                    "DD/MM/YYYY HH:mm:ss A"
                                                )}
                                            </Typography>
                                        </td>
                                        <td>
                                            <Typography level="body-sm">
                                                {row.tipo_doc_name}
                                            </Typography>
                                        </td>
                                        <td>
                                            <Typography level="body-sm">
                                                {row.num_doc}
                                            </Typography>
                                        </td>
                                        <td>
                                            <Typography level="body-sm">
                                                {row.nombres} {row.apellidos}
                                            </Typography>
                                        </td>
                                        <td>
                                            <Typography level="body-sm">
                                                {row.telefono1}
                                            </Typography>
                                        </td>
                                        <td>
                                            <Typography level="body-sm">
                                                {row.estado_name}
                                            </Typography>
                                        </td>
                                        <td>
                                            <Chip
                                                variant="soft"
                                                size="sm"
                                                startDecorator={
                                                    {
                                                        true: (
                                                            <CheckRoundedIcon fontSize="small" />
                                                        ),
                                                        false: (
                                                            <BlockIcon fontSize="small" />
                                                        ),
                                                    }[row.info_validada]
                                                }
                                                color={
                                                    {
                                                        true: "success",
                                                        false: "danger",
                                                    }[row.info_validada]
                                                }
                                            >
                                                {row.info_validada
                                                    ? "Validado"
                                                    : "Sin validar"}
                                            </Chip>
                                        </td>
                                    </tr>
                                ))}
                                {rows.pages === 0 && (
                                    <tr>
                                        <td colSpan={7}>
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
            ) : (
                <Stack
                    justifyContent="center"
                    alignContent="center"
                    alignItems="center"
                    width="100%"
                    height="100%"
                    sx={{
                        display: {
                            xs: "none",
                            md: "flex",
                        },
                    }}
                >
                    <CircularProgress />
                </Stack>
            )}
        </Fragment>
    );
}
