import UnivalleIcon from "@/components/Icons/Univalle";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import CssBaseline from "@mui/joy/CssBaseline";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import GlobalStyles from "@mui/joy/GlobalStyles";
import IconButton from "@mui/joy/IconButton";
import Input from "@mui/joy/Input";
import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";

import { Fragment, useState } from "react";

import Head from "next/head";
import { useRouter } from "next/navigation";
import ColorSchemeToggle from "@/components/Home/ColorSchemeToggle";

export default function JoySignInSideTemplate() {
    const router = useRouter();
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);

    const onSubmit = (event) => {
        event.preventDefault();
        setLoading(true);

        const formElements = event.currentTarget.elements;
        const data = {
            username: formElements.username.value,
            password: formElements.password.value,
        };

        fetch("api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        }).then(async (response) => {
            if (response.ok) location.reload();
            // router.refresh();
            else {
                setLoading(false);
                const r = JSON.parse(JSON.stringify(response));
                console.error({ ...r, body: await response.json() });
            }
        });
    };

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
                        <Stack sx={{ gap: 4, mt: 2 }}>
                            <form onSubmit={onSubmit}>
                                <FormControl required>
                                    <FormLabel>Usuario</FormLabel>
                                    <Input type="text" name="username" />
                                </FormControl>
                                <FormControl required>
                                    <FormLabel>Contraseña</FormLabel>
                                    <Input
                                        type={show ? "text" : "password"}
                                        name="password"
                                        endDecorator={
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                size="sm"
                                                onClick={() =>
                                                    setShow((prev) => !prev)
                                                }
                                            >
                                                {show ? (
                                                    <VisibilityOffIcon />
                                                ) : (
                                                    <VisibilityIcon />
                                                )}
                                            </IconButton>
                                        }
                                    />
                                </FormControl>
                                <Stack sx={{ gap: 4, mt: 2 }}>
                                    <Button
                                        type="submit"
                                        fullWidth
                                        loading={loading}
                                    >
                                        Iniciar sesión
                                    </Button>
                                </Stack>
                            </form>
                        </Stack>
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
