import PermissionProvider from "@/components/Home/permissionContext/PermissionProvider";
import "@/styles/globals.css";
import "@/styles/OrderTable.css";

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
                    <PermissionProvider>
                        <SWRConfig
                            value={{
                                revalidateOnMount: true,
                                revalidateOnFocus: false,
                                refreshInterval: 15000,
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
                            <Component {...pageProps} />
                        </SWRConfig>
                    </PermissionProvider>
                </ThemeProvider>
            </JoyCssVarsProvider>
        </CacheProvider>
    );
}
