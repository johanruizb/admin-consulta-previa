import AppInitializer from "@/components/AppInitializer";
import PermissionProvider from "@/components/Home/permissionContext/PermissionProvider";
import Navigate from "@/components/Navigate";
import { CicloProvider } from "@/contexts/CicloContext";
import "@/styles/Avances.css";
import "@/styles/globals.css";
import "@/styles/Option.css";
import "@/styles/OrderTable.css";
import { ClerkProvider, SignedOut } from "@clerk/nextjs";
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
import { SnackbarProvider } from "notistack";
import { SWRConfig } from "swr";

const customTheme = extendTheme({
    colorSchemeSelector: "media",
    cssVariables: true,
});

const materialTheme = materialExtendTheme({
    colorSchemes: { dark: true, light: true },
    colorSchemeSelector: "[data-mode-%s]",
    cssVariables: true,
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
                    <ClerkProvider
                        {...pageProps}
                        appearance={{
                            cssLayerName: "clerk",
                        }}
                    >
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
                            <SnackbarProvider
                                maxSnack={3}
                                anchorOrigin={{
                                    vertical: "bottom",
                                    horizontal: "right",
                                }}
                                autoHideDuration={5000}
                            >
                                <PermissionProvider>
                                    <AppInitializer>
                                        <CicloProvider>
                                            <Component {...pageProps} />
                                        </CicloProvider>
                                    </AppInitializer>
                                </PermissionProvider>
                            </SnackbarProvider>
                        </SWRConfig>
                    </ClerkProvider>
                </ThemeProvider>
            </JoyCssVarsProvider>
        </CacheProvider>
    );
}
