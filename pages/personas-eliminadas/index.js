"use client";

import fetcher from "@/components/fetcher";
import Layout from "@/components/Home/Layout";
import { getURL } from "@/components/utils";
import { useCiclo } from "@/contexts/CicloContext";
import usePermission from "@/hooks/usePermission";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import ReplayIcon from "@mui/icons-material/Replay";
import SearchIcon from "@mui/icons-material/Search";
import Box from "@mui/joy/Box";
import Breadcrumbs from "@mui/joy/Breadcrumbs";
import Button from "@mui/joy/Button";
import CircularProgress from "@mui/joy/CircularProgress";
import FormControl from "@mui/joy/FormControl";
import Input from "@mui/joy/Input";
import Link from "@mui/joy/Link";
import Sheet from "@mui/joy/Sheet";
import Stack from "@mui/joy/Stack";
import Table from "@mui/joy/Table";
import Tooltip from "@mui/joy/Tooltip";
import Typography from "@mui/joy/Typography";
import Chip from "@mui/joy/Chip";
import Pagination from "@mui/material/Pagination";
import Head from "next/head";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState, memo } from "react";
import useSWR from "swr";
import dayjs from "dayjs";

const PAGE_SIZE = 25;

const TableRow = memo(function TableRow({ row, onRowClick }) {
    const handleClick = useCallback(() => {
        onRowClick(row.id);
    }, [onRowClick, row.id]);

    return (
        <tr className="pointer-row" onClick={handleClick}>
            <td>
                <Typography level="body-sm">
                    {row.nombres} {row.apellidos}
                </Typography>
            </td>
            <td>
                <Typography level="body-sm">
                    {row.tipo_doc} {row.num_doc}
                </Typography>
            </td>
            <td>
                <Typography level="body-sm">
                    {row.causa || "Sin especificar"}
                </Typography>
            </td>
            <td>
                <Typography level="body-sm">
                    {row.eliminado_por || "Sin información"}
                </Typography>
            </td>
            <td>
                <Typography level="body-sm">
                    {row.deleted_at
                        ? dayjs(row.deleted_at).format("DD/MM/YYYY HH:mm")
                        : "—"}
                </Typography>
            </td>
            <td>
                <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
                    {row.cursos?.map((curso) => (
                        <Chip key={curso} size="sm" variant="soft" color="neutral">
                            {curso}
                        </Chip>
                    ))}
                </Stack>
            </td>
        </tr>
    );
});

function EliminadosTable({ data, onView }) {
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);

    const filtered = useMemo(() => {
        if (!data || !Array.isArray(data)) return [];
        if (!search.trim()) return data;

        const term = search.toLowerCase();
        return data.filter(
            (row) =>
                row.nombres?.toLowerCase().includes(term) ||
                row.apellidos?.toLowerCase().includes(term) ||
                row.num_doc?.toLowerCase().includes(term) ||
                row.correo_electronico?.toLowerCase().includes(term) ||
                row.causa?.toLowerCase().includes(term) ||
                row.eliminado_por?.toLowerCase().includes(term),
        );
    }, [data, search]);

    const pages = Math.ceil(filtered.length / PAGE_SIZE);
    const paged = useMemo(
        () => filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
        [filtered, page],
    );

    const handleSearch = useCallback((e) => {
        setSearch(e.target.value);
        setPage(1);
    }, []);

    return (
        <>
            <Box
                sx={{
                    display: "flex",
                    gap: 2,
                    alignItems: "flex-end",
                    flexWrap: "wrap",
                    mb: 1,
                }}
            >
                <FormControl sx={{ flex: 1, minWidth: 200 }} size="sm">
                    <Input
                        size="sm"
                        placeholder="Buscar por nombre, documento, causa..."
                        startDecorator={<SearchIcon />}
                        value={search}
                        onChange={handleSearch}
                    />
                </FormControl>
                <Typography level="body-xs" color="neutral">
                    {filtered.length} resultado{filtered.length !== 1 && "s"}
                </Typography>
            </Box>
            <Sheet
                variant="outlined"
                sx={{
                    borderRadius: "sm",
                    overflow: "auto",
                    flex: 1,
                }}
            >
                <Table
                    aria-label="Personas eliminadas"
                    stickyHeader
                    hoverRow
                    sx={{
                        "--TableCell-headBackground":
                            "var(--joy-palette-background-level1)",
                        "& tr.pointer-row": {
                            cursor: "pointer",
                        },
                    }}
                >
                    <thead>
                        <tr>
                            <th style={{ width: "20%" }}>Nombre</th>
                            <th style={{ width: "14%" }}>Documento</th>
                            <th style={{ width: "16%" }}>Causa de baja</th>
                            <th style={{ width: "14%" }}>Eliminado por</th>
                            <th style={{ width: "14%" }}>Fecha eliminación</th>
                            <th style={{ width: "22%" }}>Cursos</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paged.length === 0 ? (
                            <tr>
                                <td colSpan={6}>
                                    <Typography
                                        level="body-sm"
                                        textAlign="center"
                                        sx={{ py: 4 }}
                                    >
                                        No se encontraron personas eliminadas
                                    </Typography>
                                </td>
                            </tr>
                        ) : (
                            paged.map((row) => (
                                <TableRow
                                    key={row.id}
                                    row={row}
                                    onRowClick={onView}
                                />
                            ))
                        )}
                    </tbody>
                </Table>
            </Sheet>
            {pages > 1 && (
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        mt: 2,
                    }}
                >
                    <Pagination
                        count={pages}
                        page={page}
                        onChange={(_, v) => setPage(v)}
                        size="small"
                    />
                </Box>
            )}
        </>
    );
}

export default function PersonasEliminadas({ children }) {
    const router = useRouter();
    const { selectedCicloId } = useCiclo();

    const { data, isLoading, isValidating, mutate } = useSWR(
        getURL(`/api/usuarios/eliminados?ciclo_id=${selectedCicloId}`),
        fetcher,
    );

    const onView = useCallback(
        (id) => {
            router.push(`/personas-eliminadas/${id}`, undefined, {
                shallow: true,
            });
        },
        [router],
    );

    usePermission("usuario.delete_persona");

    return (
        <Layout>
            <Head>
                <title>Personas eliminadas - Consulta previa</title>
            </Head>
            <Box sx={{ display: "flex", alignItems: "center" }}>
                <Breadcrumbs
                    size="sm"
                    aria-label="breadcrumbs"
                    separator={<ChevronRightRoundedIcon fontSize="sm" />}
                    sx={{ pl: 0 }}
                >
                    <Link
                        underline="none"
                        color="neutral"
                        href="/"
                        aria-label="Home"
                    >
                        <HomeRoundedIcon />
                    </Link>
                    <Typography
                        color="primary"
                        sx={{ fontWeight: 500, fontSize: 12 }}
                    >
                        Personas eliminadas
                    </Typography>
                </Breadcrumbs>
            </Box>
            <Box
                sx={{
                    display: "flex",
                    mb: 1,
                    gap: 1,
                    flexDirection: { xs: "column", sm: "row" },
                    alignItems: { xs: "start", sm: "center" },
                    justifyContent: "space-between",
                }}
            >
                <Typography level="h2" component="h1">
                    Personas eliminadas
                </Typography>
            </Box>
            {isLoading ? (
                <Stack
                    justifyContent="center"
                    alignContent="center"
                    alignItems="center"
                    width="100%"
                    height="100%"
                >
                    <CircularProgress />
                </Stack>
            ) : (
                <EliminadosTable data={data} onView={onView} />
            )}
            {children}
            <Tooltip
                title={
                    isLoading
                        ? "Cargando lista..."
                        : isValidating
                          ? "Actualizando lista..."
                          : "Actualizar lista"
                }
                placement="left"
                arrow
            >
                <Box
                    sx={{
                        position: "fixed",
                        bottom: 16,
                        right: 16,
                        zIndex: 1,
                    }}
                >
                    <Button
                        variant="solid"
                        color="primary"
                        onClick={() => mutate({})}
                        loading={isLoading || isValidating}
                        size="lg"
                        startDecorator={<ReplayIcon />}
                    >
                        Actualizar
                    </Button>
                </Box>
            </Tooltip>
        </Layout>
    );
}
