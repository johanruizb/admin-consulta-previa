import fetcher from "@/components/fetcher";
import FormularioVerificacion, {
    DOCUMENTOS,
} from "@/components/Form/constants";
import usePermissionContext from "@/components/Home/permissionContext/usePermission";
import Navigate from "@/components/Navigate";
import { getIconHistory } from "@/components/Registros/functions";
import { convertToFormData, getURL } from "@/components/utils";
import useAlert from "@/hooks/useAlert";
import usePermission from "@/hooks/usePermission";

import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";

import Accordion from "@mui/joy/Accordion";
import AccordionDetails from "@mui/joy/AccordionDetails";
import AccordionSummary from "@mui/joy/AccordionSummary";
import ListDivider from "@mui/joy/ListDivider";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import CircularProgress from "@mui/joy/CircularProgress";
import DialogActions from "@mui/joy/DialogActions";
import DialogContent from "@mui/joy/DialogContent";
import DialogTitle from "@mui/joy/DialogTitle";
import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";
import ListItemContent from "@mui/joy/ListItemContent";
import ListItemDecorator from "@mui/joy/ListItemDecorator";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";

import Divider from "@mui/material/Divider";
import Backdrop from "@mui/material/Backdrop";
import Grid from "@mui/material/Grid2";
import useMediaQuery from "@mui/material/useMediaQuery";

import dayjs from "dayjs";
import { useRouter as useNavigate } from "next/navigation";
import { useRouter } from "next/router";
import { Fragment, useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import useSWRImmutable from "swr/immutable";

import Registros from ".";
import Tooltip from "@mui/joy/Tooltip";

export default function Wrapper() {
    const { isLoading: permissionIsLoading, hasPermission } =
        usePermissionContext();

    const [mounted, setMounted] = useState(false);
    const router = useRouter();

    const { id } = router.query;

    const {
        data: values,
        isValidating,
        isLoading,
    } = useSWRImmutable(getURL("/api/usuarios/inscritos/" + id), fetcher, {
        revalidateOnMount: true,
        refreshInterval: false,
    });

    useEffect(() => {
        setMounted(true);
    }, []);

    const ready =
        mounted && !permissionIsLoading && !isValidating && !isLoading;

    usePermission("usuario.view_persona");

    return ready ? (
        hasPermission("usuario.change_persona") ? (
            <View defaultValues={values} />
        ) : (
            <Navigate to="/registros" replace />
        )
    ) : (
        <Stack
            open
            component={Backdrop}
            justifyContent="center"
            alignContent="center"
            alignItems="center"
            width="100%"
            height="100%"
        >
            <CircularProgress />
        </Stack>
    );
}

function View({ defaultValues }) {
    const { onOpen: saveConfig } = useAlert();

    const [loading, setLoading] = useState(false);

    const router = useRouter();
    const { id } = router.query;

    const navigate = useNavigate();

    const sm = useMediaQuery((theme) => theme.breakpoints.down("md"));

    const onClose = () => {
        navigate.push("/registros", undefined, { shallow: true });
    };

    const openAlert = (content, color = "success") => {
        saveConfig(content, color);
    };

    const methods = useForm({ defaultValues });
    const { handleSubmit } = methods;

    const onSubmit = (data) => {
        delete data.historial;
        const formData = convertToFormData(data);

        setLoading(true);

        fetch(getURL("/api/usuarios/inscritos/" + id), {
            // headers: {
            //     "Content-Type": "multipart/form-data; boundary=----",
            // },
            method: "POST",
            body: formData,
        })
            .then(async (response) => {
                const res = await response.json();

                if (response.ok) {
                    openAlert(res.message);
                    router.back();
                } else {
                    openAlert(
                        res?.message ??
                            `Se ha producido un error (${response.statusText})`,

                        "danger",
                    );
                }
            })
            .catch((error) => {
                openAlert(
                    `Se ha producido un error (${error.toString()})`,

                    "danger",
                );
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const validado = defaultValues?.info_validada;

    return (
        <Registros>
            <Fragment>
                <Modal
                    open
                    onClose={onClose}
                    sx={{
                        zIndex: 1001,
                    }}
                >
                    <ModalDialog
                        layout={sm ? "fullscreen" : "center"}
                        slotProps={{
                            root: {
                                sx: sm
                                    ? {}
                                    : {
                                          width: "70%",
                                      },
                            },
                        }}
                    >
                        <DialogTitle>
                            {/* {validado
                                ? "Editar información"
                                : "Verificar inscripción"}
                            {" — "} */}
                            {defaultValues &&
                                `${defaultValues.nombres} ${
                                    defaultValues.apellidos
                                } ${
                                    DOCUMENTOS[defaultValues.tipo_doc].split(
                                        " ",
                                    )[0]
                                } ${defaultValues.num_doc}${
                                    defaultValues.grupos
                                        ? " — " + defaultValues.grupos
                                        : ""
                                }`}
                        </DialogTitle>
                        <DialogContent>
                            {validado
                                ? `La persona ya ha sido validada. Si hay algún error, edita los campos necesarios y presiona el botón "Guardar".`
                                : `Si hay algún error, edita los campos necesarios. Cuando la información sea correcta presiona el botón "Validar".`}

                            <Stack spacing={2}>
                                <FormProvider {...methods}>
                                    <Grid container spacing={1.25}>
                                        {FormularioVerificacion.map(
                                            (slotProps, index) => {
                                                const {
                                                    Component,
                                                    size = {
                                                        xs: 12,
                                                        md: 6,
                                                    },
                                                    ...inputProps
                                                } = slotProps;

                                                const { name } =
                                                    inputProps?.controller ??
                                                    {};

                                                return Component ? (
                                                    [
                                                        "genero_otro",
                                                        "otra_conectividad",
                                                    ].includes(name) ||
                                                    name === undefined ? (
                                                        <Component
                                                            key={index}
                                                            inputProps={
                                                                inputProps
                                                            }
                                                        />
                                                    ) : (
                                                        <Grid
                                                            key={index}
                                                            size={size}
                                                        >
                                                            <Component
                                                                inputProps={
                                                                    inputProps
                                                                }
                                                            />
                                                        </Grid>
                                                    )
                                                ) : null;
                                            },
                                        )}
                                    </Grid>
                                </FormProvider>
                            </Stack>
                            <Box
                                sx={{
                                    mt: "10px",
                                }}
                            >
                                <DialogTitle>Historial de cambios</DialogTitle>
                                <List
                                    size="lg"
                                    variant="outlined"
                                    sx={{ borderRadius: "sm", mt: "10px" }}
                                >
                                    {defaultValues.historial.map(
                                        (item, index) =>
                                            item.changes ? (
                                                <Accordion key={index}>
                                                    <AccordionSummary>
                                                        <ListItem key={index}>
                                                            <ListItemDecorator>
                                                                {getIconHistory(
                                                                    item.history_type,
                                                                    {
                                                                        color: item.changes
                                                                            ? "info"
                                                                            : undefined,
                                                                    },
                                                                )}
                                                            </ListItemDecorator>
                                                            <ListItemContent>
                                                                <Typography level="title-sm">
                                                                    {
                                                                        item.history_type
                                                                    }{" "}
                                                                    {item.has_user
                                                                        ? `por ${
                                                                              item.history_user_fullname
                                                                                  ? item.history_user_fullname +
                                                                                    " (" +
                                                                                    item.history_user_username +
                                                                                    ")"
                                                                                  : item.history_user_username
                                                                          } — ${
                                                                              item.history_user_role
                                                                          }`
                                                                        : ""}
                                                                </Typography>
                                                                <Typography
                                                                    level="body-sm"
                                                                    noWrap
                                                                >
                                                                    {dayjs(
                                                                        item.history_date,
                                                                    ).format(
                                                                        "DD/MM/YYYY HH:mm:ss A",
                                                                    )}
                                                                </Typography>
                                                            </ListItemContent>
                                                        </ListItem>
                                                    </AccordionSummary>
                                                    <AccordionDetails>
                                                        <List>
                                                            <Grid
                                                                container
                                                                // spacing={2}
                                                                // rowSpacing={2}
                                                            >
                                                                {Object.entries(
                                                                    item.changes,
                                                                ).map(
                                                                    (
                                                                        [
                                                                            field,
                                                                            changes,
                                                                        ],
                                                                        index,
                                                                    ) => (
                                                                        <Grid
                                                                            key={
                                                                                index
                                                                            }
                                                                            size={
                                                                                field ===
                                                                                    "Cursos inscritos" &&
                                                                                Object.values(
                                                                                    changes,
                                                                                ).every(
                                                                                    (
                                                                                        change,
                                                                                    ) =>
                                                                                        change,
                                                                                )
                                                                                    ? 12
                                                                                    : 6
                                                                            }
                                                                        >
                                                                            <ListItem
                                                                                sx={{
                                                                                    border: 1,
                                                                                    borderColor:
                                                                                        "divider",
                                                                                    mr:
                                                                                        (index +
                                                                                            1) %
                                                                                        2
                                                                                            ? 0.5
                                                                                            : 0,
                                                                                    ml:
                                                                                        (index +
                                                                                            1) %
                                                                                        2
                                                                                            ? 0
                                                                                            : 0.5,
                                                                                    my: 0.5,
                                                                                }}
                                                                            >
                                                                                <ListItemContent>
                                                                                    <Typography level="title-sm">
                                                                                        {
                                                                                            field
                                                                                        }
                                                                                    </Typography>
                                                                                    <Stack
                                                                                        direction="row"
                                                                                        alignItems="center"
                                                                                        spacing={
                                                                                            0.5
                                                                                        }
                                                                                        sx={{
                                                                                            cursor: "pointer",
                                                                                        }}
                                                                                    >
                                                                                        <Tooltip
                                                                                            title={
                                                                                                changes.old
                                                                                            }
                                                                                            arrow
                                                                                        >
                                                                                            <Typography
                                                                                                level="body-sm"
                                                                                                color="danger"
                                                                                                noWrap
                                                                                            >
                                                                                                {
                                                                                                    changes.old
                                                                                                }
                                                                                            </Typography>
                                                                                        </Tooltip>
                                                                                        <span>
                                                                                            {
                                                                                                "»»"
                                                                                            }
                                                                                        </span>
                                                                                        <Tooltip
                                                                                            title={
                                                                                                changes.new
                                                                                            }
                                                                                            arrow
                                                                                        >
                                                                                            <Typography
                                                                                                level="body-sm"
                                                                                                color="success"
                                                                                                noWrap
                                                                                            >
                                                                                                {
                                                                                                    changes.new
                                                                                                }
                                                                                            </Typography>
                                                                                        </Tooltip>
                                                                                    </Stack>
                                                                                </ListItemContent>
                                                                            </ListItem>
                                                                        </Grid>
                                                                    ),
                                                                )}
                                                            </Grid>
                                                            <Divider
                                                                sx={{
                                                                    mt: 2,
                                                                    mb: -1,
                                                                }}
                                                            />
                                                        </List>
                                                    </AccordionDetails>
                                                </Accordion>
                                            ) : (
                                                <ListItem key={index}>
                                                    <ListItemDecorator>
                                                        {getIconHistory(
                                                            item.history_type,
                                                        )}
                                                    </ListItemDecorator>
                                                    <ListItemContent>
                                                        <Typography level="title-sm">
                                                            {item.history_type}{" "}
                                                            {item.has_user
                                                                ? `por ${
                                                                      item.history_user_fullname
                                                                          ? item.history_user_fullname +
                                                                            " (" +
                                                                            item.history_user_username +
                                                                            ")"
                                                                          : item.history_user_username
                                                                  } — ${
                                                                      item.history_user_role
                                                                  }`
                                                                : ""}
                                                        </Typography>
                                                        <Typography
                                                            level="body-sm"
                                                            noWrap
                                                        >
                                                            {dayjs(
                                                                item.history_date,
                                                            ).format(
                                                                "DD/MM/YYYY HH:mm:ss A",
                                                            )}
                                                        </Typography>
                                                    </ListItemContent>
                                                </ListItem>
                                            ),
                                    )}
                                </List>
                            </Box>
                            {defaultValues.modulos && (
                                <Box
                                    sx={{
                                        mt: "10px",
                                    }}
                                >
                                    <DialogTitle>
                                        Avance de cursos y actividades
                                    </DialogTitle>
                                    <List
                                        size="lg"
                                        variant="outlined"
                                        sx={{ borderRadius: "sm", mt: "10px" }}
                                    >
                                        {
                                            defaultValues.modulos.map(
                                                (modulo, index) => (
                                                    <Accordion key={index}>
                                                        <AccordionSummary>
                                                            <ListItem>
                                                                <ListItemDecorator>
                                                                    {modulo.completado ? (
                                                                        <CheckBoxIcon
                                                                            fontSize="medium"
                                                                            color="primary"
                                                                        />
                                                                    ) : (
                                                                        <CheckBoxOutlineBlankIcon fontSize="medium" />
                                                                    )}
                                                                </ListItemDecorator>
                                                                <ListItemContent>
                                                                    <Typography
                                                                        level="title-sm"
                                                                        noWrap
                                                                    >
                                                                        {
                                                                            modulo.name
                                                                        }
                                                                    </Typography>
                                                                    <Typography
                                                                        level="body-sm"
                                                                        noWrap
                                                                    >
                                                                        {modulo.completado
                                                                            ? "Completado"
                                                                            : "Incompleto"}
                                                                    </Typography>
                                                                </ListItemContent>
                                                            </ListItem>
                                                        </AccordionSummary>
                                                        {index <
                                                            defaultValues
                                                                .modulos
                                                                .length -
                                                                1 && (
                                                            <ListDivider inset="gutter" />
                                                        )}
                                                        <AccordionDetails>
                                                            {modulo.actividades.map(
                                                                (
                                                                    actividad,
                                                                    index,
                                                                ) => (
                                                                    <ListItem
                                                                        key={
                                                                            index
                                                                        }
                                                                        sx={{
                                                                            ml: "24px",
                                                                        }}
                                                                    >
                                                                        <ListItemDecorator>
                                                                            {actividad?.completado ? (
                                                                                <CheckBoxIcon
                                                                                    fontSize="medium"
                                                                                    color="primary"
                                                                                />
                                                                            ) : (
                                                                                <CheckBoxOutlineBlankIcon fontSize="medium" />
                                                                            )}
                                                                        </ListItemDecorator>
                                                                        <ListItemContent>
                                                                            <Typography
                                                                                level="title-sm"
                                                                                noWrap
                                                                            >
                                                                                {
                                                                                    actividad?.name
                                                                                }
                                                                            </Typography>
                                                                            <Typography
                                                                                level="body-sm"
                                                                                noWrap
                                                                            >
                                                                                {actividad?.completado
                                                                                    ? `Completado — ${dayjs(
                                                                                          actividad.date,
                                                                                      ).format(
                                                                                          "DD/MM/YYYY HH:mm:ss A",
                                                                                      )}`
                                                                                    : "Incompleto"}
                                                                            </Typography>
                                                                        </ListItemContent>
                                                                    </ListItem>
                                                                ),
                                                            )}
                                                            {index <
                                                                defaultValues
                                                                    .modulos
                                                                    .length -
                                                                    1 && (
                                                                <ListDivider inset="gutter" />
                                                            )}
                                                        </AccordionDetails>
                                                    </Accordion>
                                                ),
                                            ) // Actividades
                                        }
                                    </List>
                                </Box>
                            )}
                        </DialogContent>
                        <DialogActions
                            sx={{
                                justifyContent: "space-between",
                            }}
                        >
                            <Button
                                onClick={handleSubmit(onSubmit)}
                                variant="solid"
                                endDecorator={<SaveIcon />}
                                size="lg"
                                color={validado ? "primary" : "success"}
                                loading={loading}
                            >
                                {validado ? "Guardar" : "Validar"}
                            </Button>
                            <Button
                                onClick={onClose}
                                variant="plain"
                                startDecorator={<CloseIcon />}
                                size="lg"
                                disabled={loading}
                            >
                                Cerrar
                            </Button>
                        </DialogActions>
                    </ModalDialog>
                </Modal>
            </Fragment>
        </Registros>
    );
}
