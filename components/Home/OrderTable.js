import BlockIcon from "@mui/icons-material/Block";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import SearchIcon from "@mui/icons-material/Search";
import Box from "@mui/joy/Box";
import Chip from "@mui/joy/Chip";
import CircularProgress from "@mui/joy/CircularProgress";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import { iconButtonClasses } from "@mui/joy/IconButton";
import Input from "@mui/joy/Input";
import Option from "@mui/joy/Option";
import Select from "@mui/joy/Select";
import Sheet from "@mui/joy/Sheet";
import Stack from "@mui/joy/Stack";
import Table from "@mui/joy/Table";
import Typography from "@mui/joy/Typography";
import Pagination from "@mui/material/Pagination";
import { useSessionStorage } from "@uidotdev/usehooks";
import dayjs from "dayjs";
import { debounce } from "lodash";
import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { filterTable } from "./functions";
import usePermissionContext from "./permissionContext/usePermission";

export default function OrderTable({ data, onView }) {
    const { isLoading: permissionIsLoading, hasPermission } =
        usePermissionContext();

    const [page, setPage] = useSessionStorage("OrderTable__page", 1);
    const [filter, setFilter] = useState({});

    const [rows, setRows] = useState();

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const setFilterDebounced = useCallback(
        debounce((value) => setFilter(value), 250),
        [],
    );

    useEffect(() => {
        filterTable(data, filter, setRows);
    }, [data, filter]);

    const ready = useMemo(
        () => !permissionIsLoading && rows,
        [permissionIsLoading, rows],
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
                            setFilterDebounced((prev) => ({
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
                            setFilterDebounced((prev) => ({
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
                    <FormLabel>Curso - 20 horas</FormLabel>
                    <Select
                        size="sm"
                        placeholder="Filtrar por curso inscrito"
                        slotProps={{ button: { sx: { whiteSpace: "nowrap" } } }}
                        onChange={(e, newValue) => {
                            setFilterDebounced((prev) => ({
                                ...prev,
                                curso_20horas:
                                    newValue !== "" ? newValue : undefined,
                            }));
                        }}
                        value={filter.curso_20horas ?? ""}
                    >
                        <Option value={""}>Todos</Option>
                        <Option value={"Sociedad civil"}>
                            Sociedad civil (20 horas)
                        </Option>
                        <Option value={"Funcionarios"}>
                            Funcionarios (20 horas)
                        </Option>
                    </Select>
                </FormControl>
                <FormControl size="sm">
                    <FormLabel>Diplomado - 120 horas</FormLabel>
                    <Select
                        size="sm"
                        placeholder="Filtrar por curso inscrito"
                        slotProps={{ button: { sx: { whiteSpace: "nowrap" } } }}
                        onChange={(e, newValue) => {
                            setFilterDebounced((prev) => ({
                                ...prev,
                                diplomado_120horas:
                                    newValue !== "" ? newValue : undefined,
                            }));
                        }}
                        value={filter.diplomado_120horas ?? ""}
                    >
                        <Option value={""}>Todos</Option>
                        <Option value={"Sociedad civil"}>
                            Sociedad civil (20 horas)
                        </Option>
                        <Option value={"Funcionarios"}>
                            Funcionarios (20 horas)
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
                                            width: 80,
                                            padding: "12px 6px",
                                        }}
                                    >
                                        Fecha de registro
                                    </th>
                                    <th
                                        style={{
                                            width: 30,
                                            padding: "12px 6px",
                                        }}
                                    >
                                        Tipo de documento
                                    </th>
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
                                            width: 180,
                                            padding: "12px 6px",
                                        }}
                                    >
                                        Nombre completo
                                    </th>
                                    <th
                                        style={{
                                            width: 80,
                                            padding: "12px 6px",
                                        }}
                                    >
                                        Teléfono
                                    </th>
                                    <th
                                        style={{
                                            width: 100,
                                            padding: "12px 6px",
                                        }}
                                    >
                                        Departamento de residencia
                                    </th>
                                    <th
                                        style={{
                                            width: 80,
                                            padding: "12px 6px",
                                        }}
                                    >
                                        Estado
                                    </th>
                                    <th
                                        style={{
                                            width: 80,
                                            padding: "12px 6px",
                                        }}
                                    >
                                        Curso - 20 horas
                                    </th>
                                    <th
                                        style={{
                                            width: 80,
                                            padding: "12px 6px",
                                        }}
                                    >
                                        Diplomado - 120 horas
                                    </th>
                                    <th
                                        style={{
                                            width: 80,
                                            padding: "12px 6px",
                                        }}
                                    >
                                        Grupo
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
                                            "usuario.change_persona",
                                        )
                                            ? {
                                                  onClick: () => onView(row.id),
                                              }
                                            : {})}
                                    >
                                        <td>
                                            <Typography level="body-sm">
                                                {dayjs(
                                                    row.ultimo_registro,
                                                ).format("DD/MM/YYYY")}
                                                {/* HH:mm:ss A */}
                                            </Typography>
                                        </td>
                                        <td>
                                            <Typography level="body-sm">
                                                {row.tipo_doc_abbreviation}
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
                                        <td>
                                            <Typography level="body-sm">
                                                {row.curso_20horas}
                                            </Typography>
                                        </td>
                                        <td>
                                            <Typography level="body-sm">
                                                {row.diplomado_120horas}
                                            </Typography>
                                        </td>
                                        <td>
                                            <Typography level="body-sm">
                                                {row.grupos}
                                            </Typography>
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
