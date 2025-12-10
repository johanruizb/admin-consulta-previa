/**
 * InscripcionesPorPeriodo
 *
 * Componente para visualizar las inscripciones a lo largo del tiempo
 * agrupadas por días, semanas o meses.
 *
 * Características:
 * - Selector de período (días/semanas/meses)
 * - Gráfica de barras interactiva
 * - Se actualiza automáticamente al cambiar el ciclo
 * - Muestra total de inscripciones en el período
 * - Precarga inteligente de datos usando SWR preload
 * - Exportación a Excel con los mismos datos visualizados
 */

import fetcher from "@/components/fetcher";
import { formatNumber, getURL } from "@/components/utils";
import { useCiclo } from "@/contexts/CicloContext";
import useAlert from "@/hooks/useAlert";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import CircularProgress from "@mui/joy/CircularProgress";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import IconButton from "@mui/joy/IconButton";
import Option from "@mui/joy/Option";
import Select from "@mui/joy/Select";
import Tooltip from "@mui/joy/Tooltip";
import Typography from "@mui/joy/Typography";
import Stack from "@mui/material/Stack";
import { BarChart } from "@mui/x-charts/BarChart";
import dayjs from "dayjs";
import { useState } from "react";
import useSWR from "swr";

export default function InscripcionesPorPeriodo({
    courses = [],
    filters = {},
}) {
    const { selectedCicloId } = useCiclo();
    const [periodo, setPeriodo] = useState("dias");
    const [exporting, setExporting] = useState(false);
    const { onOpen } = useAlert();

    const params = new URLSearchParams();
    params.append("ciclo_id", selectedCicloId);
    params.append("periodo", periodo);

    courses.forEach((courseId) => {
        params.append("courses", courseId);
    });

    Object.entries(filters || {}).forEach(([key, value]) => {
        if (value) {
            params.append(key, value);
        }
    });

    const { data, isLoading, error } = useSWR(
        selectedCicloId
            ? getURL(
                  `api/usuarios/inscripciones-por-periodo/?${params.toString()}`,
              )
            : null,
        fetcher,
    );

    const handlePeriodoChange = (event, newValue) => {
        setPeriodo(newValue);
    };

    const handleExport = () => {
        setExporting(true);
        fetch(
            getURL(
                `api/usuarios/inscripciones-por-periodo/exportar?${params.toString()}`,
            ),
            {
                method: "GET",
            },
        )
            .then(async (response) => {
                if (!response.ok) {
                    onOpen(
                        `No se pudo exportar el archivo. (${String(
                            response?.statusText ?? response,
                        )})`,
                        "danger",
                    );
                } else {
                    const blob = await response.blob();
                    const contentDisposition =
                        response.headers.get("Content-Disposition");
                    let filename = `inscripciones_por_${periodo}_${dayjs().format(
                        "YYYY-MM-DD",
                    )}.xlsx`;

                    if (contentDisposition) {
                        const match =
                            contentDisposition.match(/filename="?(.+)"?/);
                        if (match && match.length >= 2) {
                            filename = match[1].replace(/"/g, "");
                        }
                    }

                    const reader = new FileReader();
                    reader.onload = () => {
                        const link = document.createElement("a");
                        link.href = reader.result;
                        link.download = filename;
                        link.click();
                    };
                    reader.readAsDataURL(blob);
                    onOpen("Archivo exportado correctamente.", "success");
                }
            })
            .catch((error) => {
                onOpen(
                    `No se pudo exportar el archivo. (${String(
                        error?.statusText ?? error ?? "UNKNOWN_ERROR",
                    )})`,
                    "danger",
                );
            })
            .finally(() => {
                setExporting(false);
            });
    };

    if (isLoading) {
        return (
            <Card
                variant="outlined"
                sx={{
                    height: "100%",
                }}
            >
                <CardContent>
                    <Stack
                        justifyContent="center"
                        alignItems="center"
                        minHeight={300}
                    >
                        <CircularProgress />
                    </Stack>
                </CardContent>
            </Card>
        );
    }

    if (error) {
        return (
            <Card
                variant="outlined"
                sx={{
                    height: "100%",
                }}
            >
                <CardContent>
                    <Typography level="title-lg" color="danger">
                        Error al cargar inscripciones
                    </Typography>
                    <Typography level="body-sm" color="neutral">
                        {error?.message || "Ocurrió un error inesperado"}
                    </Typography>
                </CardContent>
            </Card>
        );
    }

    if (!data?.data || data.data.length === 0) {
        return (
            <Card
                variant="outlined"
                sx={{
                    height: "100%",
                }}
            >
                <CardContent>
                    <Typography level="title-lg">
                        Inscripciones por período
                    </Typography>
                    <Typography level="body-md" sx={{ mt: 2 }}>
                        No hay datos de inscripciones disponibles para este
                        ciclo
                    </Typography>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card
            variant="outlined"
            sx={{
                height: "100%",
            }}
        >
            <CardContent>
                <Stack
                    direction={{ xs: "column", md: "row" }}
                    justifyContent="space-between"
                    alignItems={{ xs: "start", md: "center" }}
                    spacing={2}
                    mb={2}
                >
                    <Stack spacing={0.5}>
                        <Typography level="title-lg">
                            Inscripciones por{" "}
                            {periodo === "dias"
                                ? "día"
                                : periodo === "semanas"
                                  ? "semana"
                                  : "mes"}{" "}
                            (por plataforma)
                        </Typography>
                        <Typography level="body-sm" color="neutral">
                            Total: {formatNumber(data.total_inscripciones)}{" "}
                            inscripciones
                        </Typography>
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="flex-end">
                        <FormControl size="sm" sx={{ minWidth: 150 }}>
                            <FormLabel>Agrupar por</FormLabel>
                            <Select
                                value={periodo}
                                onChange={handlePeriodoChange}
                                size="sm"
                            >
                                <Option value="dias">Días</Option>
                                <Option value="semanas">Semanas</Option>
                                <Option value="meses">Meses</Option>
                            </Select>
                        </FormControl>
                        <Tooltip title="Exportar a Excel">
                            <IconButton
                                variant="outlined"
                                color="neutral"
                                size="sm"
                                onClick={handleExport}
                                disabled={
                                    exporting ||
                                    !data?.data ||
                                    data.data.length === 0
                                }
                                loading={exporting}
                            >
                                <FileDownloadIcon />
                            </IconButton>
                        </Tooltip>
                    </Stack>
                </Stack>

                <BarChart
                    dataset={data.data}
                    xAxis={[
                        {
                            scaleType: "band",
                            dataKey: "label",
                            tickLabelStyle: {
                                angle: data.data.length > 15 ? -45 : 0,
                                textAnchor:
                                    data.data.length > 15 ? "end" : "middle",
                                fontSize: 12,
                            },
                        },
                    ]}
                    series={[
                        {
                            dataKey: "total_web",
                            label: "Formulario Web",
                            color: "#1976d2",
                        },
                        {
                            dataKey: "total_whatsapp",
                            label: "WhatsApp",
                            color: "#25D366",
                        },
                    ]}
                    height={350}
                    margin={{
                        top: 20,
                        right: 20,
                        bottom: data.data.length > 15 ? 100 : 80,
                        left: 60,
                    }}
                    slotProps={{
                        legend: {
                            direction: "row",
                            position: {
                                vertical: "bottom",
                                horizontal: "middle",
                            },
                            padding: 0,
                        },
                    }}
                />
            </CardContent>
        </Card>
    );
}
