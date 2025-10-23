import STORAGE from "@/hooks/storage";
import useClient from "@/hooks/useClient";
import { initializePreload } from "@/utils/preloadData";
import CircularProgress from "@mui/joy/CircularProgress";
import LinearProgress from "@mui/joy/LinearProgress";
import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";
import { useState } from "react";
import SettingsContext from "./Home/settingsContext";
import { SignedOut, useUser } from "@clerk/nextjs";

export default function AppInitializer({ children }) {
    const { isLoaded, isSignedIn, user } = useUser();

    const [loadingStage, setLoadingStage] = useState("settings");
    const [settings, setSettings] = useState({
        colorScheme: "light",
        useWideInterface: false,
    });

    useClient(() => {
        const loadedSettings = STORAGE.load(
            "settings_app",
            STORAGE.LOCAL_STORAGE,
            {
                colorScheme: "light",
                useWideInterface: false,
            },
        );
        setSettings(loadedSettings);
        setLoadingStage("preload");

        initializePreload().finally(() => {
            setLoadingStage("ready");
        });
    });

    const saveSettings = (ns) => {
        setSettings((prevSettings) => {
            const newSettings = ns || prevSettings;
            STORAGE.save?.("settings_app", newSettings);
            return newSettings;
        });
    };

    if (isLoaded && !isSignedIn) {
        return <SignedOut>{children}</SignedOut>;
    }

    if (loadingStage === "settings" || !isLoaded) {
        return (
            <Stack
                justifyContent="center"
                alignItems="center"
                width="100vw"
                height="100vh"
                spacing={2}
            >
                <CircularProgress size="md" />
            </Stack>
        );
    }

    return (
        <SettingsContext.Provider value={{ settings, saveSettings }}>
            {loadingStage === "preload" && (
                <Stack
                    position="fixed"
                    bottom={0}
                    left={0}
                    right={0}
                    p={2}
                    spacing={1}
                    sx={{ zIndex: 9999 }}
                >
                    <LinearProgress size="sm" />
                    <Typography
                        level="body-xs"
                        textAlign="center"
                        textColor="text.tertiary"
                    >
                        Optimizando experiencia
                    </Typography>
                </Stack>
            )}
            {loadingStage === "ready" && children}
        </SettingsContext.Provider>
    );
}
