import "@/styles/globals.css";
import { CssVarsProvider, extendTheme } from "@mui/joy";

const customTheme = extendTheme({
    colorSchemeSelector: "media",
});

export default function App({ Component, pageProps }) {
    return (
        <CssVarsProvider theme={customTheme} defaultMode="system">
            <Component {...pageProps} />
        </CssVarsProvider>
    );
}
