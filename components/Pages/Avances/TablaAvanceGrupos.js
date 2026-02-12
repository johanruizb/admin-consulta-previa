import { getURL } from "@/components/utils";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { Button } from "@mui/joy";
import Box from "@mui/joy/Box";
import Sheet from "@mui/joy/Sheet";
import Tooltip from "@mui/joy/Tooltip";
import Typography from "@mui/joy/Typography";
import { DataGrid, Toolbar } from "@mui/x-data-grid";
import dayjs from "dayjs";
import { useSnackbar } from "notistack";
import { memo, useCallback, useMemo, useState } from "react";

const AVANCE_COLORS = {
    sin_avance: { bg: "#e0e0e0", text: "#616161" },
    bajo: { bg: "#ffcdd2", text: "#c62828" },
    moderado: { bg: "#fff9c4", text: "#f57f17" },
    alto: { bg: "#c8e6c9", text: "#2e7d32" },
};

function getAvanceLevel(porcentaje) {
    if (porcentaje === 0) return "sin_avance";
    if (porcentaje <= 33) return "bajo";
    if (porcentaje <= 66) return "moderado";
    return "alto";
}

function getAvanceLabel(porcentaje) {
    if (porcentaje === 0) return "Sin avance";
    if (porcentaje <= 33) return "Bajo";
    if (porcentaje <= 66) return "Moderado";
    return "Alto";
}

const AvanceCell = memo(function AvanceCell({ value, isTotal }) {
    if (!value || typeof value !== "object") return null;

    const { cantidad, porcentaje } = value;
    const level = getAvanceLevel(porcentaje);
    const colors = AVANCE_COLORS[level];

    return (
        <Tooltip
            title={`${getAvanceLabel(porcentaje)} (${porcentaje}%)`}
            placement="top"
            arrow
            enterDelay={400}
        >
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100%",
                    width: "100%",
                    // bgcolor: isTotal ? "rgba(11, 107, 203, 0.15)" : colors.bg,
                    // color: isTotal ? "text.primary" : colors.text,
                    bgcolor: colors.bg,
                    color: colors.text,
                    fontWeight: 600,
                    fontSize: "0.8rem",
                }}
            >
                <Typography level="body2">
                    {cantidad} ({porcentaje}%)
                </Typography>
            </Box>
        </Tooltip>
    );
});

function ExportToolbar({ cicloId, cursoId }) {
    const { enqueueSnackbar } = useSnackbar();
    const [loading, setLoading] = useState(false);

    const handleExport = useCallback(() => {
        if (!cicloId || !cursoId) return;
        setLoading(true);

        fetch(getURL("/api/moodle/avance-por-grupo-exportar"), {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ciclo_id: cicloId, curso_id: cursoId }),
        })
            .then(async (response) => {
                if (!response.ok) {
                    enqueueSnackbar(
                        `No se pudo exportar el archivo. (${response.statusText ?? "Error"})`,
                        { variant: "error" },
                    );
                } else {
                    const blob = await response.blob();
                    const reader = new FileReader();
                    reader.onload = () => {
                        const link = document.createElement("a");
                        link.href = reader.result;
                        link.download = `Avance por grupo_${dayjs().format("YYYY-MM-DD HH-mm-ss")}.xlsx`;
                        link.click();
                    };
                    reader.readAsDataURL(blob);
                    enqueueSnackbar("Archivo exportado correctamente.", {
                        variant: "success",
                    });
                }
            })
            .catch((error) => {
                enqueueSnackbar(
                    `No se pudo exportar el archivo. (${String(error?.message ?? error)})`,
                    { variant: "error" },
                );
            })
            .finally(() => setLoading(false));
    }, [cicloId, cursoId, enqueueSnackbar]);

    return (
        <Toolbar

            sx={{
                justifyContent: "space-between",
            }}>
            <Typography level="title-lg" sx={{ px: 2 }}>
                Avances en grupos
            </Typography>
            <Tooltip title="Exportar a Excel">
                {/* <ToolbarButton onClick={handleExport} disabled={loading}>
                    <FileDownloadIcon fontSize="small" />
                </ToolbarButton> */}
                <Button
                    startDecorator={<FileDownloadIcon />}
                    onClick={handleExport}
                    disabled={loading}
                    // variant="outlined"
                    size="sm"
                >
                    Exportar XLSX
                </Button>
            </Tooltip>
        </Toolbar>
    );
}

export default function TablaAvanceGrupos({ data, cicloId, cursoId }) {
    const { filas, columnas, column_groups } = data ?? {};

    const columns = useMemo(() => {
        if (!columnas) return [];

        return columnas.map((col) => {
            const base = {
                field: col.field,
                headerName: col.headerName,
                width: col.width,
                sortable: false,
            };

            if (col.type === "avance") {
                return {
                    ...base,
                    renderCell: (params) => (
                        <AvanceCell
                            value={params.row[params.field]}
                            isTotal={params.row.id === "total"}
                        />
                    ),
                };
            }

            if (col.type === "number") {
                return {
                    ...base,
                    type: "number",
                    headerAlign: "center",
                    align: "center",
                };
            }

            return base;
        });
    }, [columnas]);

    const columnGroupingModel = useMemo(() => {
        return column_groups ?? [];
    }, [column_groups]);

    const rows = useMemo(() => filas ?? [], [filas]);

    if (!data || !filas?.length) return null;

    return (
        <Sheet
        // variant="outlined"
        // sx={{
        //     width: "100%",
        //     borderRadius: "sm",
        //     overflow: "auto",
        //     height: Math.min(400 + rows.length * 52, 700),
        // }}
        >
            <DataGrid
                rows={rows}
                columns={columns}
                columnGroupingModel={columnGroupingModel}
                disableRowSelectionOnClick
                disableColumnSorting
                disableColumnMenu
                showCellVerticalBorder
                showColumnVerticalBorder
                hideFooter
                columnGroupHeaderHeight={40}
                showToolbar
                slots={{ toolbar: ExportToolbar }}
                slotProps={{ toolbar: { cicloId, cursoId } }}
                getRowClassName={(params) =>
                    params.row.id === "total" ? "row-total" : ""
                }
                getCellClassName={(params) => {
                    if (params.value && Object.hasOwnProperty.call(params.value, "cantidad") && Object.hasOwnProperty.call(params.value, "porcentaje")) return "cell-avance";
                    return "";
                }}
                sx={{
                    "& .row-total": {
                        // bgcolor: "rgba(11, 107, 203, 0.12) !important",
                        fontWeight: 700,
                    },
                    "& .cell-total": {
                        fontWeight: 700,
                    },
                    "& .MuiDataGrid-columnHeader": {
                        fontSize: "0.8rem",
                    },
                    // "& .MuiDataGrid-cell": {
                    //     padding: 0,
                    // },
                    "& .MuiDataGrid-cell.cell-avance": {
                        padding: 0,
                    },
                }}
            />
        </Sheet>
    );
}
