import Box from "@mui/joy/Box";
import CssBaseline from "@mui/joy/CssBaseline";
import { CssVarsProvider } from "@mui/joy/styles";

import Header from "@/components/Home/Header";
import Sidebar from "@/components/Home/Sidebar";
import useSettingsContext from "./settingsContext/useSettings";
import { getWindow } from "../utils";

function Layout({ children }) {
    const {
        location: { pathname },
    } = getWindow() ?? {};

    console.log(pathname);

    const useWide = pathname.includes("/avance-cursos");

    const { settings } = useSettingsContext();

    const sx = settings?.useWideInterface
        ? {
              mt: {
                  xs: "var(--Header-height)",
                  //  md: "65px"
              },
              //   height: { md: "calc(100dvh - 65px)" },
              //   height: "100dvh",
              pt: {
                  xs: "calc(12px + var(--Header-height))",
                  sm: "calc(12px + var(--Header-height))",
                  md: 4,
              },
          }
        : {
              ml: { md: "var(--Sidebar-width)" },
              // height: "100dvh"
          };

    return (
        <CssVarsProvider disableTransitionOnChange>
            <CssBaseline />
            <Box sx={{ display: "flex", minHeight: "100dvh" }}>
                <Header />
                <Sidebar />
                {/* Vista principal */}
                <Box
                    component="main"
                    sx={{
                        px: { xs: 2, md: 6 },
                        pt: {
                            xs: "calc(12px + var(--Header-height))",
                            sm: "calc(12px + var(--Header-height))",
                            md: 3,
                        },
                        pb: { xs: 2, sm: 2, md: 3 },
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        minWidth: 0,
                        gap: 1,
                        height: useWide ? undefined : "100vh",
                        ...sx,
                    }}
                >
                    {children}
                </Box>
            </Box>
        </CssVarsProvider>
    );
}

export default Layout;
