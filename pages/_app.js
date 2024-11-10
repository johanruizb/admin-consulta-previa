import PermissionProvider from "@/components/Home/permissionContext/PermissionProvider";

import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import CssBaseline from "@mui/joy/CssBaseline";
import {
    extendTheme,
    CssVarsProvider as JoyCssVarsProvider,
} from "@mui/joy/styles";
import {
    THEME_ID as MATERIAL_THEME_ID,
    extendTheme as materialExtendTheme,
    ThemeProvider,
} from "@mui/material/styles";
import { SWRConfig } from "swr";

import CustomAlert from "@/components/Alert";
import "@/styles/globals.css";
import "@/styles/Option.css";
import "@/styles/OrderTable.css";
import "@/styles/Avances.css";
import SettingsProvider from "@/components/Home/settingsContext/SettingsProvider";
import { Fragment } from "react";

const customTheme = extendTheme({
    colorSchemeSelector: "media",
});

const materialTheme = materialExtendTheme({
    colorSchemes: { dark: true, light: true },
    colorSchemeSelector: "data",
});

const cache = createCache({ key: "css", prepend: true });

export default function App({ Component, pageProps }) {
    return (
        <CacheProvider value={cache}>
            <JoyCssVarsProvider theme={customTheme} defaultMode="light">
                <ThemeProvider
                    theme={{ [MATERIAL_THEME_ID]: materialTheme }}
                    defaultMode="light"
                >
                    <CssBaseline enableColorScheme />
                    <SWRConfig
                        value={{
                            revalidateOnMount: true,
                            fetcher: async (...args) => {
                                const res = await fetch(...args);
                                return res.ok
                                    ? res.json()
                                    : Promise.reject({
                                          status: res.status,
                                          statusText: res.statusText,
                                      });
                            },
                        }}
                    >
                        <PermissionProvider>
                            <SettingsProvider>
                                <Fragment>
                                    <Component {...pageProps} />
                                    <CustomAlert />
                                </Fragment>
                            </SettingsProvider>
                        </PermissionProvider>
                    </SWRConfig>
                </ThemeProvider>
            </JoyCssVarsProvider>
        </CacheProvider>
    );
}
