import STORAGE from "@/hooks/storage";
import useClient from "@/hooks/useClient";
import CircularProgress from "@mui/joy/CircularProgress";
import Stack from "@mui/joy/Stack";
import { useState } from "react";
import SettingsContext from ".";

function SettingsProvider({ children }) {
    const [loaded, setLoaded] = useState(false);

    const [settings, setSettings] = useState({
        colorScheme: "light",
        useWideInterface: false,
    });

    useClient(() => {
        setSettings(
            STORAGE.load("settings_app", STORAGE.LOCAL_STORAGE, {
                colorScheme: "light",
                useWideInterface: false,
            })
        );
        setLoaded(true);
    });

    const saveSettings = (ns) => {
        setSettings((prevSettings) => {
            const newSettings = ns || prevSettings;
            STORAGE.save?.("settings_app", newSettings);
            return newSettings;
        });
    };

    return (
        <SettingsContext.Provider
            value={{
                settings,
                saveSettings,
            }}
        >
            {loaded ? (
                children
            ) : (
                <Stack
                    justifyContent="center"
                    alignContent="center"
                    alignItems="center"
                    width="100%"
                    height="100%"
                    sx={{
                        position: "fixed",
                    }}
                >
                    <CircularProgress />
                </Stack>
            )}
        </SettingsContext.Provider>
    );
}

export default SettingsProvider;
