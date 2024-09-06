// import AssignmentRoundedIcon from "@mui/icons-material/AssignmentRounded";
// import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
// import GroupRoundedIcon from "@mui/icons-material/GroupRounded";
// import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
// import QuestionAnswerRoundedIcon from "@mui/icons-material/QuestionAnswerRounded";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import SupportRoundedIcon from "@mui/icons-material/SupportRounded";

// import Button from "@mui/joy/Button";
// import Card from "@mui/joy/Card";
// import Chip from "@mui/joy/Chip";
// import LinearProgress from "@mui/joy/LinearProgress";
// import Stack from "@mui/joy/Stack";
import Avatar from "@mui/joy/Avatar";
import Box from "@mui/joy/Box";
import Divider from "@mui/joy/Divider";
import GlobalStyles from "@mui/joy/GlobalStyles";
import IconButton from "@mui/joy/IconButton";
import Input from "@mui/joy/Input";
import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";
import ListItemButton, { listItemButtonClasses } from "@mui/joy/ListItemButton";
import ListItemContent from "@mui/joy/ListItemContent";
import Sheet from "@mui/joy/Sheet";
import Typography from "@mui/joy/Typography";

import UnivalleIcon from "../Icons/Univalle";
import { closeSidebar } from "../utils";
import ColorSchemeToggle from "./ColorSchemeToggle";

import { useRouter } from "next/navigation";
import { Fragment, useState } from "react";

function Toggler({ defaultExpanded = false, renderToggle, children }) {
    const [open, setOpen] = useState(defaultExpanded);

    return (
        <Fragment>
            {renderToggle({ open, setOpen })}
            <Box
                sx={[
                    {
                        display: "grid",
                        transition: "0.2s ease",
                        "& > *": {
                            overflow: "hidden",
                        },
                    },
                    open
                        ? { gridTemplateRows: "1fr" }
                        : { gridTemplateRows: "0fr" },
                ]}
            >
                {children}
            </Box>
        </Fragment>
    );
}

export default function Sidebar() {
    const [logout, setLogout] = useState(false);

    const router = useRouter();

    const onLogout = () => {
        setLogout(true);

        fetch("/api/logout", {
            method: "POST",
        }).then(() => {
            router.refresh();
        });
        router.refresh();
    };

    return (
        <Sheet
            className="Sidebar"
            sx={{
                position: { xs: "fixed", md: "sticky" },
                transform: {
                    xs: "translateX(calc(100% * (var(--SideNavigation-slideIn, 0) - 1)))",
                    md: "none",
                },
                transition: "transform 0.4s, width 0.4s",
                zIndex: 10000,
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
                    zIndex: 9998,
                    top: 0,
                    left: 0,
                    width: "100vw",
                    height: "100vh",
                    opacity: "var(--SideNavigation-slideIn)",
                    backgroundColor: "var(--joy-palette-background-backdrop)",
                    transition: "opacity 0.4s",
                    transform: {
                        xs: "translateX(calc(100% * (var(--SideNavigation-slideIn, 0) - 1) + var(--SideNavigation-slideIn, 0) * var(--Sidebar-width, 0px)))",
                        lg: "translateX(-100%)",
                    },
                }}
                onClick={() => closeSidebar()}
            />
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
            <Input
                size="sm"
                startDecorator={<SearchRoundedIcon />}
                placeholder="Search"
            />
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
                }}
            >
                <List
                    size="sm"
                    sx={{
                        gap: 1,
                        "--List-nestedInsetStart": "30px",
                        "--ListItem-radius": (theme) => theme.vars.radius.sm,
                    }}
                >
                    <ListItem>
                        <ListItemButton>
                            <HomeRoundedIcon />
                            <ListItemContent>
                                <Typography level="title-sm">Inicio</Typography>
                            </ListItemContent>
                        </ListItemButton>
                    </ListItem>

                    <ListItem>
                        <ListItemButton>
                            <DashboardRoundedIcon />
                            <ListItemContent>
                                <Typography level="title-sm">Panel</Typography>
                            </ListItemContent>
                        </ListItemButton>
                    </ListItem>

                    <ListItem>
                        <ListItemButton selected>
                            <GroupAddIcon />
                            <ListItemContent>
                                <Typography level="title-sm">
                                    Registros
                                </Typography>
                            </ListItemContent>
                        </ListItemButton>
                    </ListItem>

                    {/* <ListItem nested>
                        <Toggler
                            renderToggle={({ open, setOpen }) => (
                                <ListItemButton onClick={() => setOpen(!open)}>
                                    <AssignmentRoundedIcon />
                                    <ListItemContent>
                                        <Typography level="title-sm">
                                            Tasks
                                        </Typography>
                                    </ListItemContent>
                                    <KeyboardArrowDownIcon
                                        sx={[
                                            open
                                                ? {
                                                      transform:
                                                          "rotate(180deg)",
                                                  }
                                                : {
                                                      transform: "none",
                                                  },
                                        ]}
                                    />
                                </ListItemButton>
                            )}
                        >
                            <List sx={{ gap: 0.5 }}>
                                <ListItem sx={{ mt: 0.5 }}>
                                    <ListItemButton>All tasks</ListItemButton>
                                </ListItem>
                                <ListItem>
                                    <ListItemButton>Backlog</ListItemButton>
                                </ListItem>
                                <ListItem>
                                    <ListItemButton>In progress</ListItemButton>
                                </ListItem>
                                <ListItem>
                                    <ListItemButton>Done</ListItemButton>
                                </ListItem>
                            </List>
                        </Toggler>
                    </ListItem>
                    <ListItem>
                        <ListItemButton
                            role="menuitem"
                            component="a"
                            href="/joy-ui/getting-started/templates/messages/"
                        >
                            <QuestionAnswerRoundedIcon />
                            <ListItemContent>
                                <Typography level="title-sm">
                                    Messages
                                </Typography>
                            </ListItemContent>
                            <Chip size="sm" color="primary" variant="solid">
                                4
                            </Chip>
                        </ListItemButton>
                    </ListItem>
                    <ListItem nested>
                        <Toggler
                            renderToggle={({ open, setOpen }) => (
                                <ListItemButton onClick={() => setOpen(!open)}>
                                    <GroupRoundedIcon />
                                    <ListItemContent>
                                        <Typography level="title-sm">
                                            Users
                                        </Typography>
                                    </ListItemContent>
                                    <KeyboardArrowDownIcon
                                        sx={[
                                            open
                                                ? {
                                                      transform:
                                                          "rotate(180deg)",
                                                  }
                                                : {
                                                      transform: "none",
                                                  },
                                        ]}
                                    />
                                </ListItemButton>
                            )}
                        >
                            <List sx={{ gap: 0.5 }}>
                                <ListItem sx={{ mt: 0.5 }}>
                                    <ListItemButton
                                        role="menuitem"
                                        component="a"
                                        href="/joy-ui/getting-started/templates/profile-dashboard/"
                                    >
                                        My profile
                                    </ListItemButton>
                                </ListItem>
                                <ListItem>
                                    <ListItemButton>
                                        Create a new user
                                    </ListItemButton>
                                </ListItem>
                                <ListItem>
                                    <ListItemButton>
                                        Roles & permission
                                    </ListItemButton>
                                </ListItem>
                            </List>
                        </Toggler>
                    </ListItem> */}
                </List>
                <List
                    size="sm"
                    sx={{
                        mt: "auto",
                        flexGrow: 0,
                        "--ListItem-radius": (theme) => theme.vars.radius.sm,
                        "--List-gap": "8px",
                        mb: 2,
                    }}
                >
                    <ListItem>
                        <ListItemButton>
                            <SupportRoundedIcon />
                            Support
                        </ListItemButton>
                    </ListItem>
                    <ListItem>
                        <ListItemButton>
                            <SettingsRoundedIcon />
                            Settings
                        </ListItemButton>
                    </ListItem>
                </List>
            </Box>
            <Divider />
            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                <Avatar
                    variant="outlined"
                    size="sm"
                    // src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=286"
                />
                <Box sx={{ minWidth: 0, flex: 1 }}>
                    <Typography level="title-sm">Usuario</Typography>
                    <Typography level="body-xs">example@example.com</Typography>
                </Box>
                <IconButton
                    size="sm"
                    variant="plain"
                    color="neutral"
                    onClick={onLogout}
                    loading={logout}
                >
                    <LogoutRoundedIcon />
                </IconButton>
            </Box>
        </Sheet>
    );
}
