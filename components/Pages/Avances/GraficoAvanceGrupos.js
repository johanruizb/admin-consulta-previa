import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import Typography from "@mui/joy/Typography";
import { BarChart } from "@mui/x-charts/BarChart";
import { useMemo } from "react";

export default function GraficoAvanceGrupos({ data }) {
    const { dataset, series } = data ?? {};

    const chartSeries = useMemo(() => {
        if (!series?.length) return [];
        return series.map((s) => ({
            dataKey: s.dataKey,
            label: s.label,
            valueFormatter: (value) => `${value}%`,
        }));
    }, [series]);

    if (!dataset?.length || !series?.length) return null;

    const chartHeight = Math.max(400, dataset.length * 80 + 80);

    return (
        <Card>
            <CardContent>
                <Typography level="title-lg" sx={{ mb: 1 }}>
                    Avance por actividad y grupo
                </Typography>
                <BarChart
                    dataset={dataset}
                    yAxis={[
                        {
                            scaleType: "band",
                            dataKey: "actividad",
                            width: 300,
                        },
                    ]}
                    xAxis={[
                        {
                            label: "Avance (%)",
                            min: 0,
                            max: 100,
                        },
                    ]}
                    series={chartSeries}
                    layout="horizontal"
                    height={chartHeight}
                    grid={{ vertical: true }}
                    borderRadius={4}
                />
            </CardContent>
        </Card>
    );
}
