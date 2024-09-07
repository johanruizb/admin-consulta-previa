import "@/styles/globals.css";
import { CssBaseline, extendTheme } from "@mui/joy";
import { CssVarsProvider as JoyCssVarsProvider } from "@mui/joy/styles";
import {
    THEME_ID as MATERIAL_THEME_ID,
    extendTheme as materialExtendTheme,
    ThemeProvider,
} from "@mui/material/styles";

const customTheme = extendTheme({
    colorSchemeSelector: "media",
});

const materialTheme = materialExtendTheme({
    colorSchemes: { dark: true, light: true },
    colorSchemeSelector: "data",
});

export default function App({ Component, pageProps }) {
    return (
        <JoyCssVarsProvider theme={customTheme} defaultMode="system">
            <ThemeProvider
                theme={{ [MATERIAL_THEME_ID]: materialTheme }}
                defaultMode="system"
            >
                <CssBaseline enableColorScheme />
                <Component {...pageProps} />
            </ThemeProvider>
        </JoyCssVarsProvider>
    );
}
