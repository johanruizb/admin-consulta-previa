import Box from "@mui/joy/Box";
import Checkbox from "@mui/joy/Checkbox";
import Sheet from "@mui/joy/Sheet";
import Tooltip from "@mui/joy/Tooltip";
import Typography from "@mui/joy/Typography";
import { DataGrid } from "@mui/x-data-grid";
import { useIntersectionObserver } from "@uidotdev/usehooks";
import dayjs from "dayjs";
import { Fragment, useMemo } from "react";
import { v4 } from "uuid";

function Status({ params, header } = {}) {
    const [ref, entry] = useIntersectionObserver({
        threshold: 0,
        root: null,
        rootMargin: "24px",
    });

    const { estado, fecha } = params?.row[header?.field] || {};

    const estadoNumero = Number(estado);
    const completado = estadoNumero >= 1 || params?.row[header?.field] === true;

    return (
        <Box ref={ref}>
            {/* <AnimatePresence initial={false}>
                {isNear ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0 }}
                        key={v4()}
                    >
                        {completado ? (
                            <Tooltip
                                component="span"
                                // key={id}
                                title={
                                    fecha
                                        ? completado
                                            ? `${dayjs(fecha).format(
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
                        ) : (
                            <Tooltip
                                component="span"
                                key={v4()}
                                title="Aun sin completar"
                                placement="top"
                                arrow
                            >
                                <Box
                                    component="span"
                                    sx={{
                                        display: "flex",
                                        justifyContent: "center",
                                    }}
                                >
                                    <Checkbox readOnly />
                                </Box>
                            </Tooltip>
                        )}
                    </motion.div>
                ) : null}
            </AnimatePresence> */}
            {entry?.isIntersecting ? (
                completado ? (
                    <Tooltip
                        component="span"
                        // key={id}
                        title={
                            fecha
                                ? completado
                                    ? `${dayjs(fecha).format(
                                          "DD [de] MMMM [de] YYYY, [a las] HH:mm:ss a",
                                      )}`
                                    : "Actividad no completada"
                                : completado
                                  ? "Completado"
                                  : "Módulo no completado"
                        }
                        placement="top"
                        arrow
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
                ) : (
                    <Tooltip
                        component="span"
                        key={v4()}
                        title="Aun sin completar"
                        placement="top"
                        arrow
                    >
                        <Box
                            component="span"
                            sx={{
                                display: "flex",
                                justifyContent: "center",
                            }}
                        >
                            <Checkbox readOnly />
                        </Box>
                    </Tooltip>
                )
            ) : null}
        </Box>
    );
}

function getStatus(params, header) {
    const { id } = params.row;
    if (id === "resumen")
        return (
            <Fragment>
                <Tooltip
                    key={id}
                    title={`Usuarios que lo han completado: ${
                        params.row[header.field]
                    }`}
                    placement="top"
                    arrow
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
            </Fragment>
        );
    return <Status params={params} header={header} />;
}

export default function TablaAvancesV2({
    data,
    hasPermission,
    onView,
    filter,
}) {
    const { headers, resultados: rows } = data ?? {};

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

                const h = {
                    ...header,
                    field: header.field.toString(),
                    width: headers.length > 5 && isCheckbox ? 100 : 70,
                };
                if (
                    isNumber ||
                    header.field.toLowerCase().includes("completado")
                )
                    return {
                        ...h,
                        renderCell: (params) => getStatus(params, header),
                        valueGetter: (value, row) =>
                            row[header.field]?.estado > 0,
                        type: "boolean",
                    };
                return h;
            }),
        );
    }, [headers]);

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
                    }}
                >
                    <DataGrid
                        key={v4()}
                        rows={__rows}
                        columns={columns}
                        columnVisibilityModel={{
                            id: false,
                        }}
                        disableRowSelectionOnClick
                        disableColumnSorting
                        disableColumnMenu
                        showCellVerticalBorder
                        showColumnVerticalBorder
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
                            },
                            "& .MuiDataGrid-columnHeaderTitle": {
                                // position: "relative",
                                textAlign: "center",
                                whiteSpace: "nowrap",
                                transformOrigin: "50% 50%",
                                // overflow: "visible",
                                transform: "rotate(-90deg)",
                            },
                            "& .MuiDataGrid-columnHeaderTitle:before": {
                                content: `""`,
                                paddingTop: "120%",
                                /* takes width as reference, + 10% for faking some extra padding */
                                display: "inline-block",
                                verticalAlign: "middle",
                            },
                            "& .MuiDataGrid-columnHeader": {
                                height: "auto !important",
                                // width: "250px !important",
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
                    />
                </Sheet>
            </Fragment>
        </Fragment>
    );
}
