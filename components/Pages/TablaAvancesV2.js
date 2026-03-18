import Box from "@mui/joy/Box";
import Checkbox from "@mui/joy/Checkbox";
import Sheet from "@mui/joy/Sheet";
import Tooltip from "@mui/joy/Tooltip";
import Typography from "@mui/joy/Typography";
import { DataGrid } from "@mui/x-data-grid";
import dayjs from "dayjs";
import { Fragment, memo, useCallback, useMemo } from "react";

// Componente optimizado con React.memo para evitar re-renders innecesarios
const Status = memo(function Status({ params, header }) {
    const { estado, fecha } = params?.row[header?.field] || {};

    const estadoNumero = Number(estado);
    const completado = estadoNumero >= 1 || params?.row[header?.field] === true;

    const tooltipTitle = fecha
        ? completado
            ? dayjs(fecha).format("DD [de] MMMM [de] YYYY, [a las] HH:mm:ss a")
            : "Actividad no completada"
        : completado
            ? "Completado"
            : "Módulo no completado";

    return (
        <Tooltip
            component="span"
            title={completado ? tooltipTitle : "Aun sin completar"}
            placement="top"
            arrow
            enterDelay={500}
            enterNextDelay={500}
        >
            <Box
                component="span"
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100%",
                    flex: 1,
                }}
            >
                <Checkbox readOnly checked={completado} />
            </Box>
        </Tooltip>
    );
});

export default function TablaAvancesV2({
    data,
    hasPermission,
    onView,
    filter,
}) {
    const { headers, resultados: rows, columnGroupingModel: rawColumnGroupingModel } = data ?? {};

    // Memoizar getStatus para evitar recreación en cada render
    const getStatus = useCallback((params, header) => {
        const { id } = params.row;
        if (id === "resumen")
            return (
                <Tooltip
                    title={`Usuarios que lo han completado: ${params.row[header.field]
                        }`}
                    placement="top"
                    arrow
                    enterDelay={500}
                    enterNextDelay={500}
                >
                    <Typography
                        level="body-sm"
                        textAlign="center"
                        fontWeight="bold"
                        color="textPrimary"
                    >
                        {params.row[header.field]}
                    </Typography>
                </Tooltip>
            );
        return <Status params={params} header={header} />;
    }, []);

    const columns = useMemo(() => {
        const defaultColumns = [
            { field: "id", headerName: "ID", width: 50 },
            {
                field: "documento",
                headerName: "Documento",
                width: 120,
            },
            {
                field: "usuario",
                headerName: "Nombre completo",
                width: 300,
                renderCell: (params) => {
                    return (
                        <Fragment>
                            <Typography level="body-sm" color="textPrimary">
                                {params.row.usuario}
                            </Typography>
                            {params.row.email && (
                                <Typography level="body-sm" color="textPrimary">
                                    {params.row.email}
                                </Typography>
                            )}
                        </Fragment>
                    );
                },
            },
        ];
        if (!headers) return defaultColumns;
        return defaultColumns.concat(
            headers.map((header) => {
                const isNumber = Number(header.field);
                const isCheckbox =
                    isNumber ||
                    header.field.toLowerCase().includes("completado");
                const isPorcentaje = header.field === "porcentaje_avance";

                const h = {
                    ...header,
                    field: header.field.toString(),
                    width: headers.length > 5 && isCheckbox ? 100 : (isPorcentaje ? 120 : 70),
                };
                if (isPorcentaje)
                    return h;
                if (
                    isNumber ||
                    header.field.toLowerCase().includes("completado")
                )
                    return {
                        ...h,
                        headerClassName: "module-column-header",
                        renderCell: (params) => getStatus(params, header),
                        valueGetter: (value, row) =>
                            row[header.field]?.estado > 0,
                        type: "boolean",
                    };
                return h;
            }),
        );
    }, [headers, getStatus]);

    const columnGroupingModel = useMemo(() => {
        if (!rawColumnGroupingModel) return undefined;
        return rawColumnGroupingModel.map((group) => ({
            ...group,
            children: group.children.map((child) => ({
                ...child,
                field: child.field?.toString(),
            })),
        }));
    }, [rawColumnGroupingModel]);

    const __rows = useMemo(() => filter ?? rows ?? [], [filter, rows]);

    return (
        <Fragment>
            <Fragment>
                <Sheet
                    className="OrderTableContainer"
                    variant="outlined"
                    sx={{
                        display: { xs: "none", sm: "block" },
                        // position: "absolute",
                        width: "100%",
                        borderRadius: "sm",
                        flexShrink: 1,
                        height: "calc(120vh - 150px)",
                        overflow: "auto",
                        mb: 12,
                        "& .MuiDataGrid-cell[data-field='usuario']": {
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                        },
                    }}
                >
                    <DataGrid
                        rows={__rows}
                        columns={columns}
                        {...(columnGroupingModel ? { columnGroupingModel } : {})}
                        columnGroupHeaderHeight={40}
                        columnVisibilityModel={{
                            id: false,
                        }}
                        disableRowSelectionOnClick
                        disableColumnSorting
                        disableColumnMenu
                        showCellVerticalBorder
                        showColumnVerticalBorder
                        rowBuffer={10}
                        columnBuffer={5}
                        getCellClassName={(params) => {
                            let className = "";

                            if (params.row.id === "resumen")
                                className += "cell-resumen ";

                            const number = Number(params.field);
                            className +=
                                number ||
                                    number === 0 ||
                                    params.field
                                        .toLowerCase()
                                        .includes("completado")
                                    ? "cell-avance"
                                    : "";
                            return className;
                        }}
                        getRowClassName={(params) => {
                            return params.row.id === "resumen"
                                ? "row-resumen"
                                : "";
                        }}
                        sx={{
                            "& .row-resumen": {
                                bgcolor: "rgba(11, 107, 203, 0.25) !important",
                                position: "sticky",
                                top: 0,
                                zIndex: 4,
                            },
                            "& .module-column-header .MuiDataGrid-columnHeaderTitle": {
                                textAlign: "center",
                                whiteSpace: "nowrap",
                                transformOrigin: "50% 50%",
                                transform: "rotate(-90deg)",
                            },
                            "& .module-column-header .MuiDataGrid-columnHeaderTitleContainerContent":
                            {
                                height: 136,
                            },
                            "& .MuiDataGrid-columnGroupHeader .MuiDataGrid-columnHeaderTitle": {
                                transform: "none",
                                whiteSpace: "normal",
                                lineHeight: 1.2,
                                textOverflow: "ellipsis",
                                overflow: "hidden",
                            },
                            "& .MuiDataGrid-columnGroupHeader .MuiDataGrid-columnHeaderTitleContainerContent":
                            {
                                height: "auto",
                            },
                        }}
                        onRowClick={(params) => {
                            if (
                                hasPermission("usuario.change_persona") &&
                                params.row.id !== "resumen"
                            )
                                onView(params.row.id);
                        }}
                        // autosizeOnMount
                        columnHeaderHeight={136}
                    />
                </Sheet>
            </Fragment>
        </Fragment>
    );
}
