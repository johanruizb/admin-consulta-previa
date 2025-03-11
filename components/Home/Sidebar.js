"use client";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import SchoolIcon from "@mui/icons-material/School";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";

import Box from "@mui/joy/Box";
import Divider from "@mui/joy/Divider";
import GlobalStyles from "@mui/joy/GlobalStyles";
import IconButton from "@mui/joy/IconButton";
import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";
import ListItemButton, { listItemButtonClasses } from "@mui/joy/ListItemButton";
import ListItemContent from "@mui/joy/ListItemContent";
import Sheet from "@mui/joy/Sheet";
import Typography from "@mui/joy/Typography";

import UnivalleIcon from "../Icons/Univalle";
import { closeSidebar } from "../utils";
import ColorSchemeToggle from "./ColorSchemeToggle";

import STORAGE from "@/hooks/storage";
import useClient from "@/hooks/useClient";
import CircularProgress from "@mui/material/CircularProgress";
import { useRouter } from "next/navigation";
import { useState } from "react";
import usePermissionContext from "./permissionContext/usePermission";
import Profile from "./Profile";
import Settings from "./Settings";
import useSettingsContext from "./settingsContext/useSettings";

export default function Sidebar() {
    const { isLoading, hasPermission } = usePermissionContext();

    const router = useRouter();

    const [mounted, setMounted] = useState(false);
    const [open, setOpen] = useState();

    useClient(() => {
        setMounted(true);
        setOpen(STORAGE.load("open_settings_app", sessionStorage, false));
    });

    const handleRouteChange = (url, replace = false) => {
        if (replace) router.replace(url, undefined, { shallow: true });
        else router.push(url, undefined, { shallow: true });
    };

    const { settings } = useSettingsContext();

    const sheetSx = settings.useWideInterface
        ? {
              transform:
                  "translateX(calc(100% * (var(--SideNavigation-slideIn, 0) - 1)))",
          }
        : {
              transform: {
                  xs: "translateX(calc(100% * (var(--SideNavigation-slideIn, 0) - 1)))",
                  md: "none",
              },
          };

    const Sidebaroverlay = settings.useWideInterface
        ? {
              transform:
                  "translateX(calc(100% * (var(--SideNavigation-slideIn, 0) - 1) + var(--SideNavigation-slideIn, 0) * var(--Sidebar-width, 0px)))",
          }
        : {
              transform: {
                  xs: "translateX(calc(100% * (var(--SideNavigation-slideIn, 0) - 1) + var(--SideNavigation-slideIn, 0) * var(--Sidebar-width, 0px)))",
                  lg: "translateX(-100%)",
              },
          };

    return (
        <Sheet
            className="Sidebar"
            sx={{
                position: "fixed",
                transition: "transform 0.4s, width 0.4s",
                zIndex: 1000,
                height: "100dvh",
                width: "var(--Sidebar-width)",
                top: 0,
                p: 2,
                flexShrink: 0,
                display: "flex",
                flexDirection: "column",
                gap: 2,
                borderRight: "1px solid",
                borderColor: "divider",
                ...sheetSx,
            }}
        >
            <GlobalStyles
                styles={(theme) => ({
                    ":root": {
                        "--Sidebar-width": "220px",
                        [theme.breakpoints.up("lg")]: {
                            "--Sidebar-width": "240px",
                        },
                    },
                })}
            />
            <Box
                className="Sidebar-overlay"
                sx={{
                    position: "fixed",
                    zIndex: 998,
                    top: 0,
                    left: 0,
                    width: "100vw",
                    height: "100vh",
                    opacity: "var(--SideNavigation-slideIn)",
                    backgroundColor: "var(--joy-palette-background-backdrop)",
                    transition: "opacity 0.4s",
                    ...Sidebaroverlay,
                }}
                onClick={() => closeSidebar()}
            />
            {!settings.useWideInterface && (
                <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                    <IconButton variant="plain" color="primary" size="lg">
                        <UnivalleIcon
                            sx={(theme) => ({
                                fontSize: "48px",
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
            <Box
                sx={{
                    minHeight: 0,
                    overflow: "hidden auto",
                    flexGrow: 1,
                    display: "flex",
                    flexDirection: "column",
                    [`& .${listItemButtonClasses.root}`]: {
                        gap: 1.5,
                    },
                    ...(isLoading && {
                        justifyContent: "center",
                        alignItems: "center",
                    }),
                }}
            >
                {isLoading ? (
                    <CircularProgress />
                ) : (
                    <List
                        size="sm"
                        sx={{
                            gap: 1,
                            "--List-nestedInsetStart": "30px",
                            "--ListItem-radius": (theme) =>
                                theme.vars.radius.sm,
                        }}
                    >
                        <ListItem>
                            <ListItemButton
                                component="a"
                                // href="/"
                                onClick={() => handleRouteChange("/")}
                                selected={
                                    mounted ? location.pathname == "/" : false
                                }
                            >
                                <HomeRoundedIcon />
                                <ListItemContent>
                                    <Typography level="title-sm">
                                        Inicio
                                    </Typography>
                                </ListItemContent>
                            </ListItemButton>
                        </ListItem>

                        {hasPermission("usuario.view_persona") && (
                            <ListItem>
                                <ListItemButton
                                    component="a"
                                    // href="/registros"
                                    onClick={() =>
                                        handleRouteChange("/registros")
                                    }
                                    selected={
                                        mounted
                                            ? location.pathname == "/registros"
                                            : false
                                    }
                                >
                                    <GroupAddIcon />
                                    <ListItemContent>
                                        <Typography level="title-sm">
                                            Registros
                                        </Typography>
                                    </ListItemContent>
                                </ListItemButton>
                            </ListItem>
                        )}
                        {hasPermission(
                            "moodle.view_actividadescompletadas",
                        ) && (
                            <ListItem>
                                <ListItemButton
                                    component="a"
                                    onClick={() =>
                                        handleRouteChange("/avance-cursos")
                                    }
                                    selected={
                                        mounted
                                            ? location.pathname ==
                                              "/avance-cursos"
                                            : false
                                    }
                                >
                                    <SchoolIcon />
                                    <ListItemContent>
                                        <Typography level="title-sm">
                                            Avance de cursos
                                        </Typography>
                                    </ListItemContent>
                                </ListItemButton>
                            </ListItem>
                        )}
                        {hasPermission("usuario.view_listaespera") && (
                            <ListItem>
                                <ListItemButton
                                    component="a"
                                    onClick={() =>
                                        handleRouteChange("/lista-espera")
                                    }
                                    selected={
                                        mounted
                                            ? location.pathname ==
                                              "/lista-espera"
                                            : false
                                    }
                                >
                                    <SchoolIcon />
                                    <ListItemContent>
                                        <Typography level="title-sm">
                                            Lista de espera
                                        </Typography>
                                    </ListItemContent>
                                </ListItemButton>
                            </ListItem>
                        )}
                    </List>
                )}
                <List
                    size="sm"
                    sx={{
                        mt: "auto",
                        flexGrow: 0,
                        "--ListItem-radius": (theme) => theme.vars.radius.sm,
                        "--List-gap": "8px",
                        // mb: 2,
                    }}
                >
                    <ListItem>
                        <ListItemButton
                            onClick={() => setOpen(true)}
                            selected={open}
                        >
                            <SettingsRoundedIcon />
                            Ajustes
                        </ListItemButton>
                    </ListItem>
                </List>
            </Box>
            <Divider />
            <Profile />
            {open && <Settings open={open} onClose={() => setOpen(false)} />}
        </Sheet>
    );
}
