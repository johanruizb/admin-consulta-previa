import { Fragment } from "react";
import ColorSchemeToggle from "@/components/Home/ColorSchemeToggle";
import UnivalleIcon from "@/components/Icons/Univalle";
import { SignIn } from "@clerk/nextjs";
import Box from "@mui/joy/Box";
import CssBaseline from "@mui/joy/CssBaseline";
import GlobalStyles from "@mui/joy/GlobalStyles";
import IconButton from "@mui/joy/IconButton";
import Typography from "@mui/joy/Typography";
import Head from "next/head";

export default function JoySignInSideTemplate() {
    return (
        <Fragment>
            <Head>
                <title>Iniciar sesión - Consulta previa</title>
            </Head>
            <CssBaseline />
            <GlobalStyles
                styles={{
                    ":root": {
                        "--Form-maxWidth": "800px",
                        "--Transition-duration": "0.4s", // set to `none` to disable transition
                    },
                }}
            />
            <Box
                sx={(theme) => ({
                    width: { xs: "100%", md: "50vw" },
                    transition: "width var(--Transition-duration)",
                    transitionDelay: "calc(var(--Transition-duration) + 0.1s)",
                    position: "relative",
                    zIndex: 1,
                    display: "flex",
                    justifyContent: "flex-end",
                    backdropFilter: "blur(12px)",
                    backgroundColor: "rgba(255 255 255 / 0.2)",
                    [theme.getColorSchemeSelector("dark")]: {
                        backgroundColor: "rgba(19 19 24 / 0.4)",
                    },
                })}
            >
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        minHeight: "100dvh",
                        width: "100%",
                        px: 2,
                    }}
                >
                    <Box
                        component="header"
                        sx={{
                            py: 3,
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <Box
                            sx={{
                                gap: 2,
                                display: "flex",
                                alignItems: "center",
                            }}
                        >
                            <IconButton
                                variant="plain"
                                color="primary"
                                size="lg"
                            >
                                <UnivalleIcon
                                    sx={(theme) => ({
                                        fontSize: "56px",
                                        fill: "#D9000C",
                                        [theme.getColorSchemeSelector("dark")]:
                                            {
                                                fill: "white",
                                            },
                                    })}
                                />
                            </IconButton>
                            <Typography level="title-lg">
                                Proyecto Consulta Previa
                            </Typography>
                        </Box>
                        <ColorSchemeToggle
                            sx={{
                                width: 40,
                                height: 40,
                            }}
                        />
                    </Box>
                    <Box
                        component="main"
                        sx={{
                            my: "auto",
                            py: 2,
                            pb: 5,
                            display: "flex",
                            flexDirection: "column",
                            gap: 2,
                            width: 400,
                            maxWidth: "100%",
                            mx: "auto",
                            borderRadius: "sm",
                            "& form": {
                                display: "flex",
                                flexDirection: "column",
                                gap: 2,
                            },
                            [`& .MuiFormLabel-asterisk`]: {
                                visibility: "hidden",
                            },
                        }}
                    >
                        <SignIn />
                    </Box>
                    <Box component="footer" sx={{ py: 3 }}>
                        <Typography
                            level="body-xs"
                            sx={{ textAlign: "center" }}
                        >
                            Universidad del Valle {" — "} Componente Técnico y
                            Pedagógico
                        </Typography>
                    </Box>
                </Box>
            </Box>
            <Box
                sx={(theme) => ({
                    height: "100%",
                    position: "fixed",
                    right: 0,
                    top: 0,
                    bottom: 0,
                    left: { xs: 0, md: "50vw" },
                    transition:
                        "background-image var(--Transition-duration), left var(--Transition-duration) !important",
                    transitionDelay: "calc(var(--Transition-duration) + 0.1s)",
                    backgroundColor: "background.level1",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    backgroundImage:
                        "url(https://images.unsplash.com/photo-1527181152855-fc03fc7949c8?auto=format&w=1000&dpr=2)",
                    [theme.getColorSchemeSelector("dark")]: {
                        backgroundImage:
                            "url(https://images.unsplash.com/photo-1572072393749-3ca9c8ea0831?auto=format&w=1000&dpr=2)",
                    },
                })}
            />
        </Fragment>
    );
}
