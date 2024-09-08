import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import LightModeIcon from "@mui/icons-material/LightMode";
import IconButton from "@mui/joy/IconButton";

import { useEffect, useState } from "react";

import { useColorScheme as useJoyColorScheme } from "@mui/joy/styles";
import { useColorScheme as useMaterialColorScheme } from "@mui/material/styles";

export default function ColorSchemeToggle(props) {
    const { onClick, sx, ...other } = props;
    const { mode, setMode: setMaterialMode } = useMaterialColorScheme();
    const { setMode: setJoyMode } = useJoyColorScheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted || !mode) {
        // prevent server-side rendering mismatch
        // because `mode` is undefined on the server.
        return (
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
                sx={[
                    mode === "dark"
                        ? { "& > *:first-of-type": { display: "none" } }
                        : { "& > *:first-of-type": { display: "initial" } },
                    mode === "light"
                        ? { "& > *:last-child": { display: "none" } }
                        : { "& > *:last-child": { display: "initial" } },
                    ...(Array.isArray(sx) ? sx : [sx]),
                ]}
            >
                <DarkModeRoundedIcon />
                <LightModeIcon />
            </IconButton>
        );
    }

    console.log("mode", mode);

    return (
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
            sx={[
                mode === "dark"
                    ? { "& > *:first-of-type": { display: "none" } }
                    : { "& > *:first-of-type": { display: "initial" } },
                mode === "light"
                    ? { "& > *:last-child": { display: "none" } }
                    : { "& > *:last-child": { display: "initial" } },
                ...(Array.isArray(sx) ? sx : [sx]),
            ]}
        >
            <DarkModeRoundedIcon />
            <LightModeIcon />
        </IconButton>
    );
}
