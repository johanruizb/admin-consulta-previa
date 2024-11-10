"use client";
import MenuIcon from "@mui/icons-material/Menu";
import GlobalStyles from "@mui/joy/GlobalStyles";
import IconButton from "@mui/joy/IconButton";
import Sheet from "@mui/joy/Sheet";

import { Box, Typography } from "@mui/joy";
import UnivalleIcon from "../Icons/Univalle";
import { toggleSidebar } from "../utils";
import ColorSchemeToggle from "./ColorSchemeToggle";
import { EXPERIMENTAL } from "./constants";
import useSettingsContext from "./settingsContext/useSettings";

export default function Header() {
    const { settings } = useSettingsContext();

    const sx = settings.useWideInterface
        ? {
              display: "flex",
              height: {
                  xs: "var(--Header-height)",
                  md: "65px",
              },
          }
        : {
              display: {
                  xs: "flex",
                  md: "none",
              },
              height: "var(--Header-height)",
          };

    return (
        <Sheet
            sx={{
                alignItems: "center",
                justifyContent: "space-between",
                position: "fixed",
                top: 0,
                width: "100vw",
                zIndex: 995,
                p: 2,
                gap: 1,
                borderBottom: "1px solid",
                borderColor: "background.level1",
                boxShadow: "sm",
                ...sx,
            }}
        >
            <GlobalStyles
                styles={(theme) => ({
                    ":root": {
                        "--Header-height": "52px",
                        [theme.breakpoints.up("md")]: {
                            "--Header-height": "0px",
                        },
                    },
                })}
            />
            <IconButton
                onClick={() => toggleSidebar()}
                variant="outlined"
                color="neutral"
                size="sm"
            >
                <MenuIcon />
            </IconButton>
            {EXPERIMENTAL && (
                <Box
                    sx={{
                        display: "flex",
                        gap: 1,
                        alignItems: "center",
                        flex: 1,
                    }}
                >
                    <IconButton variant="plain" color="primary" size="lg">
                        <UnivalleIcon
                            sx={(theme) => ({
                                fontSize: "38px",
                                fill: "#D9000C",
                                [theme.getColorSchemeSelector("dark")]: {
                                    fill: "white",
                                },
                            })}
                        />
                    </IconButton>
                    <Typography level="title-lg">Consulta previa</Typography>
                    <ColorSchemeToggle sx={{ ml: "auto" }} />
                </Box>
            )}
        </Sheet>
    );
}
