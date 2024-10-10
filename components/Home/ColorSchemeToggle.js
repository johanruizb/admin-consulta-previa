import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import LightModeIcon from "@mui/icons-material/LightMode";
import IconButton from "@mui/joy/IconButton";

import { useEffect, useState } from "react";

import CircularProgress from "@mui/joy/CircularProgress";
import Tooltip from "@mui/joy/Tooltip";
import { useColorScheme as useJoyColorScheme } from "@mui/joy/styles";
import { useColorScheme as useMaterialColorScheme } from "@mui/material/styles";

import ComputerIcon from "@mui/icons-material/Computer";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";

function getIcon(mode) {
    switch (mode) {
        case "dark":
            return <DarkModeRoundedIcon />;
        case "light":
            return <LightModeIcon />;
        case "system":
            return <ComputerIcon />;
        default:
            return <QuestionMarkIcon />;
    }
}

function getLegend(mode) {
    switch (mode) {
        case "dark":
            return "Modo oscuro";
        case "light":
            return "Modo claro";
        case "system":
            return "Preferencia del sistema";
        default:
            return "Desconocido";
    }
}

export default function ColorSchemeToggle(props) {
    const { onClick, sx, ...other } = props;
    const { mode, setMode: setMaterialMode } = useMaterialColorScheme();
    const { mode: joyMode, setMode: setJoyMode } = useJoyColorScheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (mounted && mode !== joyMode) setMaterialMode(joyMode);
    }, [mounted]);

    if (!mounted || !mode) {
        return (
            <IconButton
                data-screenshot="toggle-mode"
                size="sm"
                variant="outlined"
                color="neutral"
                {...other}
                sx={[...(Array.isArray(sx) ? sx : [sx])]}
            >
                <CircularProgress size="sm" />
            </IconButton>
        );
    }

    return (
        <Tooltip title={getLegend(mode)} arrow>
            <IconButton
                data-screenshot="toggle-mode"
                size="sm"
                variant="outlined"
                color="neutral"
                onClick={() => {
                    setMaterialMode(mode === "dark" ? "light" : "dark");
                    setJoyMode(mode === "dark" ? "light" : "dark");
                }}
                {...other}
                sx={[...(Array.isArray(sx) ? sx : [sx])]}
            >
                {getIcon(mode)}
            </IconButton>
        </Tooltip>
    );
}
