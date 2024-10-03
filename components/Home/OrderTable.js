/* eslint-disable jsx-a11y/anchor-is-valid */
import Box from "@mui/joy/Box";
import Chip from "@mui/joy/Chip";
import Divider from "@mui/joy/Divider";
import Dropdown from "@mui/joy/Dropdown";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import IconButton, { iconButtonClasses } from "@mui/joy/IconButton";
import Input from "@mui/joy/Input";
import Menu from "@mui/joy/Menu";
import MenuButton from "@mui/joy/MenuButton";
import MenuItem from "@mui/joy/MenuItem";
import Option from "@mui/joy/Option";
import Select from "@mui/joy/Select";
import Sheet from "@mui/joy/Sheet";
import Table from "@mui/joy/Table";
import Typography from "@mui/joy/Typography";

import BlockIcon from "@mui/icons-material/Block";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import MoreHorizRoundedIcon from "@mui/icons-material/MoreHorizRounded";
import SearchIcon from "@mui/icons-material/Search";
import Pagination from "@mui/material/Pagination";

import dayjs from "dayjs";

import { chunk } from "lodash";

import { Fragment, useMemo, useState } from "react";

import { v4 as uuidv4 } from "uuid";
import usePermissionContext from "./permissionContext/usePermission";
import { CircularProgress } from "@mui/joy";

function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === "desc"
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

function RowMenu() {
    return (
        <Dropdown>
            <MenuButton
                slots={{ root: IconButton }}
                slotProps={{
                    root: { variant: "plain", color: "neutral", size: "sm" },
                }}
            >
                <MoreHorizRoundedIcon />
            </MenuButton>
            <Menu size="sm" sx={{ minWidth: 140 }}>
                <MenuItem>Edit</MenuItem>
                <MenuItem>Rename</MenuItem>
                <MenuItem>Move</MenuItem>
                <Divider />
                <MenuItem color="danger">Delete</MenuItem>
            </Menu>
        </Dropdown>
    );
}
export default function OrderTable({ data, onView }) {
    const { isLoading: permissionIsLoading, hasPermission } =
        usePermissionContext();

    const [page, setPage] = useState(1);
    const [filter, setFilter] = useState({});

    const rows = useMemo(() => {
        const filtered = [...(data ?? [])]?.filter((row) => {
            if (filter.info_validada !== undefined)
                return row.info_validada === filter.info_validada;
            return row;
        });

        const chunkedList = chunk(filtered, 50) ?? [];

        return {
            filtered,
            chunked: chunkedList,
            pages: chunkedList.length,
        };
    }, [data, filter]);

    return (
        <Fragment>
            <Box
                className="SearchAndFilters-tabletUp"
                sx={{
                    borderRadius: "sm",
                    py: 2,
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
                                info_validada: newValue,
                            }));
                        }}
                    >
                        <Option value={true}>Validado</Option>
                        <Option value={false}>No validado</Option>
                    </Select>
                </FormControl>
            </Box>
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
                {permissionIsLoading ? (
                    <CircularProgress />
                ) : (
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
                                <th style={{ width: 140, padding: "12px 6px" }}>
                                    Fecha de registro
                                </th>
                                <th style={{ width: 120, padding: "12px 6px" }}>
                                    Tipo de documento
                                </th>
                                <th style={{ width: 120, padding: "12px 6px" }}>
                                    Número de documento
                                </th>
                                <th style={{ width: 180, padding: "12px 6px" }}>
                                    Nombre completo
                                </th>
                                <th style={{ width: 100, padding: "12px 6px" }}>
                                    Teléfono
                                </th>
                                <th style={{ width: 160, padding: "12px 6px" }}>
                                    Departamento de residencia
                                </th>
                                <th style={{ width: 100, padding: "12px 6px" }}>
                                    Estado
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows?.chunked[page - 1]?.map((row) => (
                                <tr
                                    key={uuidv4()}
                                    // onClick={() => onView(row.id)}
                                    className="pointer-row"
                                    {...(hasPermission("usuario.change_persona")
                                        ? { onClick: () => onView(row.id) }
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
                                    <td colSpan={5}>
                                        <Typography textAlign="center">
                                            No hay registros.
                                        </Typography>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                )}
            </Sheet>
            <Box
                className="Pagination-laptopUp"
                sx={{
                    pt: 2,
                    gap: 1,
                    [`& .${iconButtonClasses.root}`]: { borderRadius: "50%" },
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
    );
}
