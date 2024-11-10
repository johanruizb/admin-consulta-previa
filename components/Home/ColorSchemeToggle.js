import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import LightModeIcon from "@mui/icons-material/LightMode";
import IconButton from "@mui/joy/IconButton";

import { useEffect, useState } from "react";

import Tooltip from "@mui/joy/Tooltip";
import { useColorScheme as useJoyColorScheme } from "@mui/joy/styles";
import { useColorScheme as useMaterialColorScheme } from "@mui/material/styles";

import ComputerIcon from "@mui/icons-material/Computer";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import useSettingsContext from "./settingsContext/useSettings";
import useClient from "@/hooks/useClient";

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
    const { settings, saveSettings } = useSettingsContext();

    const { onClick, sx, ...other } = props;
    const { mode, setMode: setMaterialMode } = useMaterialColorScheme();
    const { mode: joyMode, setMode: setJoyMode } = useJoyColorScheme();
    const [mounted, setMounted] = useState(false);

    useClient(() => {
        setMounted(true);
        if (mode !== joyMode) setMaterialMode(joyMode);
        saveSettings({
            ...settings,
            colorScheme: joyMode,
        });
    });

    if (!mounted || !mode) return null;

    return (
        <Tooltip title={getLegend(mode)} arrow>
            <IconButton
                data-screenshot="toggle-mode"
                size="sm"
                variant="outlined"
                color="neutral"
                onClick={() => {
                    const colorScheme = mode === "dark" ? "light" : "dark";
                    setMaterialMode(colorScheme);
                    setJoyMode(colorScheme);

                    saveSettings({
                        ...settings,
                        colorScheme,
                    });
                }}
                {...other}
                sx={[...(Array.isArray(sx) ? sx : [sx])]}
            >
                {getIcon(mode)}
            </IconButton>
        </Tooltip>
    );
}
