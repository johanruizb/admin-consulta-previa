import usePermissionContext from "@/components/Home/permissionContext/usePermission";
import SearchIcon from "@mui/icons-material/Search";
import Box from "@mui/joy/Box";
import CircularProgress from "@mui/joy/CircularProgress";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import { iconButtonClasses } from "@mui/joy/IconButton";
import Input from "@mui/joy/Input";
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

import Fuse from "fuse.js";

import { chunk, cloneDeep } from "lodash";

function filterTable(originalData, filter, setRows) {
    let result = cloneDeep(originalData);

    if (filter.search !== undefined) {
        const fuse = new Fuse(result, {
            keys: ["nombres", "apellidos", "telefono1", "correo_electronico"],
            useExtendedSearch: true,
            // threshold: 0.3,
        });
        // result = fuse.search("=" + filter.search).map((item) => item.item);
        result = fuse.search("'" + filter.search).map((item) => item.item);
    }

    const chunkedList = chunk(result, 50);

    setRows((prev) => ({
        ...prev,
        filtered: result,
        chunked: chunkedList,
        pages: chunkedList.length,
    }));
}

export default function TablaEspera({ data }) {
    const { isLoading: permissionIsLoading } = usePermissionContext();

    const [page, setPage] = useSessionStorage("TablaEspera__page", 1);
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
            </Box>
            {ready ? (
                <Fragment>
                    <Sheet
                        className="TablaEsperaContainer"
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
                                            width: 40,
                                            padding: "12px 6px",
                                        }}
                                    >
                                        Fecha de registro
                                    </th>
                                    <th
                                        style={{
                                            width: 100,
                                            padding: "12px 6px",
                                        }}
                                    >
                                        Nombre completo
                                    </th>
                                    <th
                                        style={{
                                            width: 30,
                                            padding: "12px 6px",
                                        }}
                                    >
                                        Teléfono
                                    </th>
                                    <th
                                        style={{
                                            width: 80,
                                            padding: "12px 6px",
                                        }}
                                    >
                                        Correo electrónico
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {rows?.chunked?.[page - 1]?.map((row) => (
                                    <tr
                                        key={uuidv4()}
                                        // onClick={() => onView(row.id)}
                                        className="pointer-row"
                                    >
                                        <td>
                                            <Typography level="body-sm">
                                                {dayjs(row.created_at).format(
                                                    "DD/MM/YYYY HH:mm:ss A",
                                                )}
                                                {/* HH:mm:ss A */}
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
                                                {row.correo_electronico}
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
