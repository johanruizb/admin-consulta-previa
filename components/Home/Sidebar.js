"use client";
import STORAGE from "@/hooks/storage";
import useClient from "@/hooks/useClient";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import SchoolIcon from "@mui/icons-material/School";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import Box from "@mui/joy/Box";
import Divider from "@mui/joy/Divider";
import GlobalStyles from "@mui/joy/GlobalStyles";
import IconButton from "@mui/joy/IconButton";
import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";
import ListItemButton, { listItemButtonClasses } from "@mui/joy/ListItemButton";
import ListItemContent from "@mui/joy/ListItemContent";
import Sheet from "@mui/joy/Sheet";
import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useRouter, usePathname } from "next/navigation";
import { useState, useCallback, useMemo, memo } from "react";
import useSWR from "swr";
import fetcher from "../fetcher";
import UnivalleIcon from "../Icons/Univalle";
import { closeSidebar, getURL } from "../utils";
import ColorSchemeToggle from "./ColorSchemeToggle";
import usePermissionContext from "./permissionContext/usePermission";
import Profile from "./Profile";
import useSettingsContext from "./settingsContext/useSettings";

const Settings = dynamic(() => import("./Settings"), { ssr: false });

const NavItem = memo(function NavItem({ onClick, selected, icon, children }) {
    return (
        <ListItem>
            <ListItemButton component="a" onClick={onClick} selected={selected}>
                {icon}
                <ListItemContent>
                    <Typography level="title-sm">{children}</Typography>
                </ListItemContent>
            </ListItemButton>
        </ListItem>
    );
});

const ExternalNavItem = memo(function ExternalNavItem({
    href,
    icon,
    children,
    customIcon,
}) {
    return (
        <ListItem>
            <ListItemButton component="a" href={href} target="_blank">
                {customIcon || icon}
                <ListItemContent>
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <Typography level="title-sm">{children}</Typography>
                    </Stack>
                </ListItemContent>
                <OpenInNewIcon fontSize="small" />
            </ListItemButton>
        </ListItem>
    );
});

export default function Sidebar() {
    const { data: user } = useSWR(getURL("api/user"), fetcher);
    const { isLoading, hasPermission } = usePermissionContext();
    const { settings } = useSettingsContext();
    const router = useRouter();
    const pathname = usePathname();

    const [open, setOpen] = useState(false);

    useClient(() => {
        setOpen(STORAGE.load("open_settings_app", sessionStorage, false));
    });

    const handleRouteChange = useCallback(
        (url, replace = false) => {
            if (replace) router.replace(url, undefined, { shallow: true });
            else router.push(url, undefined, { shallow: true });
        },
        [router],
    );

    const handleOpenSettings = useCallback(() => setOpen(true), []);
    const handleCloseSettings = useCallback(() => setOpen(false), []);
    const handleCloseSidebar = useCallback(() => closeSidebar(), []);

    const sheetSx = useMemo(
        () =>
            settings.useWideInterface
                ? {
                      transform:
                          "translateX(calc(100% * (var(--SideNavigation-slideIn, 0) - 1)))",
                  }
                : {
                      transform: {
                          xs: "translateX(calc(100% * (var(--SideNavigation-slideIn, 0) - 1)))",
                          md: "none",
                      },
                  },
        [settings.useWideInterface],
    );

    const sidebarOverlaySx = useMemo(
        () =>
            settings.useWideInterface
                ? {
                      transform:
                          "translateX(calc(100% * (var(--SideNavigation-slideIn, 0) - 1) + var(--SideNavigation-slideIn, 0) * var(--Sidebar-width, 0px)))",
                  }
                : {
                      transform: {
                          xs: "translateX(calc(100% * (var(--SideNavigation-slideIn, 0) - 1) + var(--SideNavigation-slideIn, 0) * var(--Sidebar-width, 0px)))",
                          lg: "translateX(-100%)",
                      },
                  },
        [settings.useWideInterface],
    );

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
                    ...sidebarOverlaySx,
                }}
                onClick={handleCloseSidebar}
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
                        <NavItem
                            onClick={() => handleRouteChange("/")}
                            selected={pathname === "/"}
                            icon={<HomeRoundedIcon />}
                        >
                            Inicio
                        </NavItem>

                        {hasPermission("usuario.view_persona") && (
                            <NavItem
                                onClick={() => handleRouteChange("/registros")}
                                selected={pathname === "/registros"}
                                icon={<GroupAddIcon />}
                            >
                                Registros
                            </NavItem>
                        )}
                        {hasPermission(
                            "moodle.view_actividadescompletadas",
                        ) && (
                            <NavItem
                                onClick={() =>
                                    handleRouteChange("/avance-cursos")
                                }
                                selected={pathname === "/avance-cursos"}
                                icon={<SchoolIcon />}
                            >
                                Avance de cursos
                            </NavItem>
                        )}
                        {hasPermission("usuario.view_listaespera") && (
                            <NavItem
                                onClick={() =>
                                    handleRouteChange("/lista-espera")
                                }
                                selected={pathname === "/lista-espera"}
                                icon={<SchoolIcon />}
                            >
                                Lista de espera
                            </NavItem>
                        )}
                        {hasPermission("is_superuser") && (
                            <NavItem
                                onClick={() => handleRouteChange("/api-keys")}
                                selected={pathname === "/api-keys"}
                                icon={<VpnKeyIcon />}
                            >
                                API Keys
                            </NavItem>
                        )}
                        {hasPermission("is_superuser") && (
                            <ExternalNavItem
                                href="https://status.consultaprevia.net"
                                customIcon={
                                    <div style={{ position: "relative" }}>
                                        <Image
                                            style={{ objectFit: "contain" }}
                                            src="https://status.consultaprevia.net/api/badge/3/status?label=&style=for-the-badge"
                                            alt="Estado del sistema"
                                            unoptimized
                                            width={26}
                                            height={26}
                                        />
                                    </div>
                                }
                            >
                                Estado del sistema
                            </ExternalNavItem>
                        )}

                        <ExternalNavItem
                            href="https://erk-software-bussiness.online"
                            icon={<WhatsAppIcon />}
                        >
                            Chatbot
                        </ExternalNavItem>
                    </List>
                )}
                <List
                    size="sm"
                    sx={{
                        mt: "auto",
                        flexGrow: 0,
                        "--ListItem-radius": (theme) => theme.vars.radius.sm,
                        "--List-gap": "8px",
                    }}
                >
                    <ListItem>
                        <ListItemButton
                            onClick={handleOpenSettings}
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
            {open && <Settings open={open} onClose={handleCloseSettings} />}
        </Sheet>
    );
}
