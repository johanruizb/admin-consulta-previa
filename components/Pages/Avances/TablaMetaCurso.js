import { formatNumber } from "@/components/utils";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import Chip from "@mui/joy/Chip";
import Sheet from "@mui/joy/Sheet";
import Table from "@mui/joy/Table";
import Typography from "@mui/joy/Typography";
import { memo } from "react";

const LEVEL_COLORS = {
    sin_avance: { bg: "transparent", color: "neutral" },
    bajo: { bg: "#ffcdd2", color: "danger" },
    moderado: { bg: "#fff9c4", color: "warning" },
    alto: { bg: "#c8e6c9", color: "success" },
};

function getLevel(porcentaje) {
    if (porcentaje === 0) return "sin_avance";
    if (porcentaje <= 33) return "bajo";
    if (porcentaje <= 66) return "moderado";
    return "alto";
}

function PorcentajeChip({ value }) {
    const level = getLevel(value);
    const { color } = LEVEL_COLORS[level];
    return (
        <Chip size="sm" variant="soft" color={color}>
            {value}%
        </Chip>
    );
}

function TablaMetaCurso({ data }) {
    if (!data) return null;

    const { meta, modulos, activos, inactivos } = data;

    if (!meta || !modulos?.length) {
        return (
            <Card>
                <CardContent>
                    <Typography level="body-lg" textAlign="center" color="neutral">
                        No hay meta configurada para este curso
                    </Typography>
                </CardContent>
            </Card>
        );
    }

    return (
        <Sheet
            variant="outlined"
            sx={{
                borderRadius: "sm",
                overflow: "auto",
            }}
        >
            <Table
                stripe="odd"
                hoverRow
                sx={{
                    "& th": { textAlign: "center" },
                    "& td": { textAlign: "center" },
                    "& td:first-of-type, & th:first-of-type": {
                        textAlign: "left",
                    },
                }}
            >
                <thead>
                    <tr>
                        <th>Módulo</th>
                        <th>Completados (meta {formatNumber(meta)})</th>
                        <th>% de la meta</th>
                        <th>Faltan</th>
                    </tr>
                </thead>
                <tbody>
                    {modulos.map((modulo) => (
                        <tr key={modulo.id}>
                            <td>
                                <Typography level="body-sm">
                                    {modulo.name}
                                </Typography>
                            </td>
                            <td>{formatNumber(modulo.completados)}</td>
                            <td>
                                <PorcentajeChip value={modulo.porcentaje} />
                            </td>
                            <td>{formatNumber(modulo.faltan)}</td>
                        </tr>
                    ))}
                    <tr
                        style={{
                            borderTop: "2px solid var(--joy-palette-divider)",
                            fontWeight: 700,
                        }}
                    >
                        <td>
                            <Typography level="body-sm" fontWeight="lg">
                                Activos
                            </Typography>
                            {activos.descripcion && (
                                <Typography level="body-xs" color="neutral">
                                    {activos.descripcion}
                                </Typography>
                            )}
                        </td>
                        <td>
                            <strong>
                                {formatNumber(activos.cantidad)}
                            </strong>
                        </td>
                        <td>
                            <PorcentajeChip value={activos.porcentaje} />
                        </td>
                        <td>
                            <strong>
                                {formatNumber(activos.faltan)}
                            </strong>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <Typography level="body-sm" fontWeight="lg">
                                Inactivos
                            </Typography>
                            {inactivos.descripcion && (
                                <Typography level="body-xs" color="neutral">
                                    {inactivos.descripcion}
                                </Typography>
                            )}
                        </td>
                        <td>
                            <strong>
                                {formatNumber(inactivos.cantidad)}
                            </strong>
                        </td>
                        <td>—</td>
                        <td>—</td>
                    </tr>
                </tbody>
            </Table>
        </Sheet>
    );
}

export default memo(TablaMetaCurso);
