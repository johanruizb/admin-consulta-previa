"use client";

import { memo } from "react";
import Chip from "@mui/joy/Chip";
import Skeleton from "@mui/joy/Skeleton";
import Tooltip from "@mui/joy/Tooltip";
import PersonIcon from "@mui/icons-material/Person";
import { useEncargadoGrupo } from "@/hooks/useEncargados";

/**
 * Badge que muestra el encargado principal de un grupo.
 * Útil para mostrar en fichas de persona.
 */
const EncargadoBadge = memo(function EncargadoBadge({
    grupoId,
    showIcon = true,
    size = "sm",
    variant = "soft",
    color = "primary",
}) {
    const { encargado, isLoading } = useEncargadoGrupo(grupoId);

    if (isLoading) {
        return <Skeleton variant="rectangular" width={80} height={24} />;
    }

    if (!encargado) {
        return (
            <Chip
                size={size}
                variant="outlined"
                color="neutral"
                startDecorator={showIcon ? <PersonIcon /> : null}
            >
                Sin encargado
            </Chip>
        );
    }

    const nombreCompleto = encargado.usuario?.full_name || encargado.usuario?.username;

    return (
        <Tooltip
            title={`Encargado ${encargado.rol_display}: ${nombreCompleto}`}
            placement="top"
        >
            <Chip
                size={size}
                variant={variant}
                color={color}
                startDecorator={showIcon ? <PersonIcon /> : null}
            >
                {nombreCompleto}
            </Chip>
        </Tooltip>
    );
});

/**
 * Versión inline del badge sin fetch.
 * Recibe los datos directamente.
 */
export const EncargadoBadgeInline = memo(function EncargadoBadgeInline({
    encargado,
    showIcon = true,
    size = "sm",
    variant = "soft",
    color = "primary",
}) {
    if (!encargado) {
        return (
            <Chip
                size={size}
                variant="outlined"
                color="neutral"
                startDecorator={showIcon ? <PersonIcon /> : null}
            >
                Sin encargado
            </Chip>
        );
    }

    return (
        <Tooltip
            title={`Encargado: ${encargado.usuario_nombre || encargado.usuario_username}`}
            placement="top"
        >
            <Chip
                size={size}
                variant={variant}
                color={color}
                startDecorator={showIcon ? <PersonIcon /> : null}
            >
                {encargado.usuario_nombre || encargado.usuario_username}
            </Chip>
        </Tooltip>
    );
});

export default EncargadoBadge;
