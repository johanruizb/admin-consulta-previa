import { useCiclo } from "@/contexts/CicloContext";
import { getContrastColor } from "@/utils/colors";
import BlockIcon from "@mui/icons-material/Block";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import SearchIcon from "@mui/icons-material/Search";
import { Chip, Tooltip } from "@mui/joy";
import Box from "@mui/joy/Box";
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
import { green, orange } from "@mui/material/colors";
import Pagination from "@mui/material/Pagination";
import { useSessionStorage } from "@uidotdev/usehooks";
import dayjs from "dayjs";
import { debounce } from "lodash";
import { Fragment, memo, useCallback, useEffect, useMemo } from "react";
import useSWR, { preload } from "swr";
import fetcher from "../fetcher";
import { getURL } from "../utils";
import { filterTable } from "./functions";
import usePermissionContext from "./permissionContext/usePermission";

const EMPTY_ROWS = { filtered: [], chunked: [], pages: 0 };

// Componente memoizado para cada fila de la tabla
const TableRow = memo(function TableRow({
    row,
    selectedCicloId,
    etiquetaLookup,
    hasChangePermission,
    onRowClick,
}) {
    const handleClick = useCallback(() => {
        if (hasChangePermission) {
            onRowClick(row.id);
        }
    }, [hasChangePermission, onRowClick, row.id]);

    // Prefetch al hover para anticipar navegación
    const handleMouseEnter = useCallback(() => {
        if (hasChangePermission) {
            preload(getURL(`/api/usuarios/inscritos/${row.id}`), fetcher);
        }
    }, [hasChangePermission, row.id]);

    // Pre-procesar etiquetas
    const processedEtiquetas = useMemo(() => {
        if (!row.etiquetas_name || selectedCicloId !== 2) return null;

        return row.etiquetas_name
            .map((etiquetaName, index) => {
                if (!etiquetaName) return null;

                const etiquetaId = row?.etiquetas?.[index];
                const etiqueta = etiquetaId
                    ? etiquetaLookup[etiquetaId]
                    : undefined;
                const backgroundColor = etiqueta?.color;

                return {
                    key: `${row.id}-${etiquetaId}-${index}`,
                    name: etiquetaName,
                    backgroundColor,
                    textColor: getContrastColor(backgroundColor),
                };
            })
            .filter(Boolean);
    }, [
        row.etiquetas_name,
        row.etiquetas,
        row.id,
        selectedCicloId,
        etiquetaLookup,
    ]);

    return (
        <tr
            className={hasChangePermission ? "pointer-row" : ""}
            onClick={handleClick}
            onMouseEnter={handleMouseEnter}
        >
            <td>
                <Typography level="body-sm">{row.formatted_date}</Typography>
            </td>
            <td>
                <Typography level="body-sm">
                    {row.tipo_doc_abbreviation}
                </Typography>
            </td>
            <td>
                <Typography level="body-sm">{row.num_doc}</Typography>
            </td>
            <td>
                <Typography level="body-sm">
                    {row.nombres} {row.apellidos}
                </Typography>
            </td>
            <td>
                <Typography level="body-sm">{row.telefono1}</Typography>
            </td>
            <td>
                <Typography level="body-sm">{row.estado_name}</Typography>
            </td>
            <td>
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                    }}
                >
                    <Box
                        sx={{
                            bgcolor: row.info_validada ? green[50] : orange[50],
                            width: "40px !important",
                            height: "40px !important",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: "50%",
                        }}
                    >
                        <Tooltip
                            title={
                                row.info_validada ? "Validado" : "No validado"
                            }
                            arrow
                        >
                            {row.info_validada ? (
                                <CheckRoundedIcon
                                    fontSize="medium"
                                    color="success"
                                />
                            ) : (
                                <BlockIcon fontSize="medium" color="warning" />
                            )}
                        </Tooltip>
                    </Box>
                </Box>
            </td>
            {selectedCicloId === 1 && (
                <td>
                    <Typography level="body-sm">{row.curso_20horas}</Typography>
                </td>
            )}
            <td>
                <Typography level="body-sm">
                    {row.diplomado_120horas}
                </Typography>
            </td>
            <td>
                <Typography level="body-sm">{row.grupos}</Typography>
            </td>
            {selectedCicloId === 2 && (
                <Fragment>
                    <td>
                        <Typography level="body-sm">
                            {row.plataforma_registro === "web"
                                ? "Formulario web"
                                : row.plataforma_registro === "whatsapp"
                                  ? "WhatsApp"
                                  : "Desconocida"}
                        </Typography>
                    </td>
                    <td>
                        {processedEtiquetas && processedEtiquetas.length > 0 ? (
                            <Tooltip
                                title={
                                    "Etiquetas: " +
                                    processedEtiquetas
                                        .map((e) => e.name)
                                        .join(", ")
                                }
                                arrow
                            >
                                <Stack direction="row" spacing={0.5}>
                                    {processedEtiquetas.map((etiqueta) => (
                                        <Chip
                                            key={etiqueta.key}
                                            sx={{
                                                width: "100%",
                                                bgcolor:
                                                    etiqueta.backgroundColor,
                                                color: etiqueta.textColor,
                                            }}
                                        >
                                            <span>{etiqueta.name}</span>
                                        </Chip>
                                    ))}
                                </Stack>
                            </Tooltip>
                        ) : (
                            <span> </span>
                        )}
                    </td>
                </Fragment>
            )}
        </tr>
    );
});

export default function OrderTable({ data, onView }) {
    const { isLoading: permissionIsLoading, hasPermission } =
        usePermissionContext();

    const [page, setPage] = useSessionStorage("OrderTable__page", 1);
    const [filter, setFilter] = useSessionStorage("OrderTable__filter", {});

    const { selectedCicloId } = useCiclo();

    const { data: etiquetasData } = useSWR(
        getURL("/api/usuarios/etiquetas"),
        fetcher,
    );

    const { data: cursosData } = useSWR(
        selectedCicloId
            ? getURL(`/api/usuarios/cursos?ciclo_id=${selectedCicloId}`)
            : null,
        fetcher,
    );

    // URL de grupos dinámica según el curso seleccionado
    const gruposUrl = useMemo(() => {
        if (!selectedCicloId) return null;

        const cursoId = filter.cursos_ids;
        if (cursoId) {
            return getURL(
                `/api/moodle/curso/${cursoId}/grupos?ciclo_id=${selectedCicloId}`,
            );
        }
        return getURL(`/api/moodle/grupos?ciclo_id=${selectedCicloId}`);
    }, [selectedCicloId, filter.cursos_ids]);

    const { data: gruposData } = useSWR(gruposUrl, fetcher);

    const etiquetaLookup = useMemo(() => {
        if (!Array.isArray(etiquetasData)) {
            return {};
        }

        return etiquetasData.reduce((acc, etiqueta) => {
            acc[etiqueta.value] = etiqueta;
            return acc;
        }, {});
    }, [etiquetasData]);

    const updateFilter = useCallback(
        (key, rawValue) => {
            setFilter((prev) => {
                const value =
                    rawValue === undefined || rawValue === null
                        ? undefined
                        : rawValue;

                const hasKey = Object.prototype.hasOwnProperty.call(prev, key);

                if (!hasKey && value === undefined) {
                    return prev;
                }

                if (hasKey && prev[key] === value) {
                    return prev;
                }

                if (value === undefined) {
                    const { [key]: _removed, ...rest } = prev;
                    return rest;
                }

                return {
                    ...prev,
                    [key]: value,
                };
            });
        },
        [setFilter],
    );

    const setSearchFilter = useMemo(
        () =>
            debounce((value) => {
                setFilter((prev) => {
                    const nextSearch =
                        value === undefined || value === null
                            ? undefined
                            : value;

                    if (prev.search === nextSearch) {
                        return prev;
                    }

                    if (nextSearch === undefined) {
                        const { search: _removed, ...rest } = prev;
                        return rest;
                    }

                    return {
                        ...prev,
                        search: nextSearch,
                    };
                });
            }, 250),
        [setFilter],
    );

    useEffect(() => () => setSearchFilter.cancel(), [setSearchFilter]);

    // Limpiar filtro de grupo cuando cambia el curso seleccionado
    useEffect(() => {
        if (filter.grupo_id !== undefined) {
            updateFilter("grupo_id", undefined);
        }
        // Solo depender de cursos_ids para ejecutar cuando cambie el curso
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filter.cursos_ids]);

    const ready = !permissionIsLoading && Array.isArray(data);

    // Pre-procesar datos: formatear fechas una sola vez
    const processedData = useMemo(() => {
        if (!ready || !data) return [];

        return data.map((row) => ({
            ...row,
            formatted_date: dayjs(row.ultimo_registro).format("DD/MM/YYYY"),
        }));
    }, [ready, data]);

    const rows = useMemo(() => {
        if (!ready) {
            return EMPTY_ROWS;
        }
        return filterTable(processedData, filter);
    }, [ready, processedData, filter]);

    const currentRows = useMemo(
        () => rows.chunked?.[page - 1] ?? [],
        [rows, page],
    );

    const totalPages = rows.pages || 0;

    // Corregir paginación si esta fuera de rango
    useEffect(() => {
        if (ready && page > totalPages) {
            setPage(totalPages || 1);
        }
    }, [ready, page, totalPages, setPage]);

    const handleSearchChange = useCallback(
        (event) => {
            const value = event.target.value;
            setSearchFilter(value ? value : undefined);
        },
        [setSearchFilter],
    );

    const handleSelectChange = useCallback(
        (key) => (_, newValue) => {
            updateFilter(key, newValue !== "" ? newValue : undefined);
        },
        [updateFilter],
    );

    // Memoizar el handler de click
    const handleRowClick = useCallback(
        (id) => {
            onView(id);
        },
        [onView],
    );

    // Verificar permiso una sola vez
    const hasChangePermission = useMemo(
        () => hasPermission("usuario.change_persona"),
        [hasPermission],
    );

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
                        defaultValue={filter?.search ?? ""}
                        onChange={handleSearchChange}
                        startDecorator={<SearchIcon />}
                    />
                </FormControl>
                <FormControl size="sm">
                    <FormLabel>Estado</FormLabel>
                    <Select
                        size="sm"
                        placeholder="Filtrar por estado"
                        slotProps={{ button: { sx: { whiteSpace: "nowrap" } } }}
                        onChange={handleSelectChange("info_validada")}
                        value={filter.info_validada ?? ""}
                    >
                        <Option value={""}>Todos</Option>
                        <Option value={"true"}>Validado</Option>
                        <Option value={"false"}>No validado</Option>
                    </Select>
                </FormControl>
                <FormControl size="sm">
                    <FormLabel>Origen</FormLabel>
                    <Select
                        size="sm"
                        placeholder="Filtrar por estado"
                        slotProps={{ button: { sx: { whiteSpace: "nowrap" } } }}
                        onChange={handleSelectChange("plataforma_registro")}
                        value={filter.plataforma_registro ?? ""}
                    >
                        <Option value="">Todos</Option>
                        <Option value="web">Formulario web</Option>
                        <Option value="whatsapp">WhatsApp</Option>
                    </Select>
                </FormControl>
                {etiquetasData && (
                    <FormControl size="sm">
                        <FormLabel>Etiquetas</FormLabel>
                        <Select
                            size="sm"
                            placeholder="Filtrar por etiquetas"
                            slotProps={{
                                button: { sx: { whiteSpace: "nowrap" } },
                            }}
                            onChange={handleSelectChange("etiquetas")}
                            value={filter.etiquetas ?? ""}
                        >
                            <Option value="">Todos</Option>
                            <Option value="__EMPTY__">Sin etiquetas</Option>
                            {etiquetasData.map((etiqueta) => (
                                <Option
                                    key={etiqueta.value}
                                    value={etiqueta.value}
                                >
                                    {etiqueta.label}
                                </Option>
                            ))}
                        </Select>
                    </FormControl>
                )}
                {cursosData && (
                    <FormControl size="sm">
                        <FormLabel>Curso</FormLabel>
                        <Select
                            size="sm"
                            placeholder="Filtrar por curso"
                            slotProps={{
                                button: { sx: { whiteSpace: "nowrap" } },
                            }}
                            onChange={handleSelectChange("cursos_ids")}
                            value={filter.cursos_ids ?? ""}
                        >
                            <Option value="">Todos</Option>
                            {cursosData.map((curso) => (
                                <Option key={curso.id} value={curso.id}>
                                    {curso.shortname || curso.name}
                                </Option>
                            ))}
                        </Select>
                    </FormControl>
                )}
                {gruposData && gruposData.length > 0 && (
                    <FormControl size="sm">
                        <FormLabel>Grupo</FormLabel>
                        <Select
                            size="sm"
                            placeholder="Filtrar por grupo"
                            slotProps={{
                                button: { sx: { whiteSpace: "nowrap" } },
                            }}
                            onChange={handleSelectChange("grupo_id")}
                            value={filter.grupo_id ?? ""}
                        >
                            <Option value="">Todos</Option>
                            <Option value="__EMPTY__">Sin grupo</Option>
                            {gruposData.map((grupo) => (
                                <Option key={grupo.id} value={grupo.id}>
                                    {grupo.name ?? grupo.shortname}
                                </Option>
                            ))}
                        </Select>
                    </FormControl>
                )}
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
                                            width: 70,
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
                                            width: 70,
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
                                            width: 70,
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
                                            width: 50,
                                            padding: "12px 6px",
                                        }}
                                    >
                                        Validado
                                    </th>
                                    {selectedCicloId === 1 && (
                                        <th
                                            style={{
                                                width: 80,
                                                padding: "12px 6px",
                                            }}
                                        >
                                            Curso - 20 horas
                                        </th>
                                    )}
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
                                            width: 50,
                                            padding: "12px 6px",
                                        }}
                                    >
                                        Grupo
                                    </th>
                                    {selectedCicloId === 2 && (
                                        <Fragment>
                                            <th
                                                style={{
                                                    width: 80,
                                                    padding: "12px 6px",
                                                }}
                                            >
                                                Plataforma de registro
                                            </th>
                                            <th
                                                style={{
                                                    width: 100,
                                                    padding: "12px 6px",
                                                }}
                                            >
                                                Etiquetas
                                            </th>
                                        </Fragment>
                                    )}
                                </tr>
                            </thead>
                            <tbody>
                                {currentRows.map((row) => (
                                    <TableRow
                                        key={row.id}
                                        row={row}
                                        selectedCicloId={selectedCicloId}
                                        etiquetaLookup={etiquetaLookup}
                                        hasChangePermission={
                                            hasChangePermission
                                        }
                                        onRowClick={handleRowClick}
                                    />
                                ))}
                                {rows.pages === 0 && (
                                    <tr>
                                        <td
                                            colSpan={
                                                selectedCicloId == 2 ? 11 : 7
                                            }
                                        >
                                            <Typography textAlign="center">
                                                No se encontraron registros
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
