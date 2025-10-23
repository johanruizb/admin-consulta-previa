import { getIconHistory } from "@/components/Registros/functions";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import Accordion from "@mui/joy/Accordion";
import AccordionDetails from "@mui/joy/AccordionDetails";
import AccordionSummary from "@mui/joy/AccordionSummary";
import Box from "@mui/joy/Box";
import DialogTitle from "@mui/joy/DialogTitle";
import List from "@mui/joy/List";
import ListDivider from "@mui/joy/ListDivider";
import ListItem from "@mui/joy/ListItem";
import ListItemContent from "@mui/joy/ListItemContent";
import ListItemDecorator from "@mui/joy/ListItemDecorator";
import Stack from "@mui/joy/Stack";
import Tooltip from "@mui/joy/Tooltip";
import Typography from "@mui/joy/Typography";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import dayjs from "dayjs";
import PropTypes from "prop-types";

/**
 * Helper function to safely render values that might be objects
 * @param {*} value - The value to render
 * @returns {string} A string representation of the value
 */
function safeRenderValue(value) {
    if (value === null || value === undefined) {
        return "N/A";
    }
    if (typeof value === "object") {
        if (Array.isArray(value)) {
            return value.join(", ");
        }
        return JSON.stringify(value);
    }
    return String(value);
}

/**
 * Componente para renderizar un item del historial con cambios
 */
function HistoryItemWithChanges({ item, index }) {
    return (
        <Accordion key={index}>
            <AccordionSummary>
                <ListItem>
                    <ListItemDecorator>
                        {getIconHistory(item.history_type, {
                            color: item.changes ? "info" : undefined,
                        })}
                    </ListItemDecorator>
                    <ListItemContent>
                        <Typography level="title-sm">
                            {item.history_type}{" "}
                            {item.has_user
                                ? `por ${
                                      item.history_user_fullname
                                          ? `${item.history_user_fullname} (${item.history_user_username})`
                                          : item.history_user_username
                                  } — ${item.history_user_role}`
                                : ""}
                        </Typography>
                        <Typography level="body-sm" noWrap>
                            {dayjs(item.history_date).format(
                                "DD/MM/YYYY HH:mm:ss A",
                            )}
                        </Typography>
                    </ListItemContent>
                </ListItem>
            </AccordionSummary>
            <AccordionDetails
                sx={{
                    m: 0,
                    p: 0,
                }}
            >
                <List>
                    <Grid container spacing={1}>
                        {Object.entries(item.changes).map(
                            ([field, changes], idx) => (
                                <Grid
                                    key={idx}
                                    size={
                                        field === "Cursos inscritos" &&
                                        Object.values(changes).every(
                                            (change) => change,
                                        )
                                            ? 12
                                            : 6
                                    }
                                >
                                    <ListItem
                                        sx={{
                                            border: 1,
                                            borderColor: "divider",
                                            // mr: (idx + 1) % 2 ? 0.5 : 0,
                                            // ml: (idx + 1) % 2 ? 0 : 0.5,
                                            width: "100%",
                                        }}
                                    >
                                        <ListItemContent>
                                            <Typography level="title-sm">
                                                {field}
                                            </Typography>
                                            <Stack
                                                direction="row"
                                                alignItems="center"
                                                spacing={0.5}
                                                sx={{ cursor: "pointer" }}
                                            >
                                                <Tooltip
                                                    title={safeRenderValue(
                                                        changes.old,
                                                    )}
                                                    arrow
                                                >
                                                    <Typography
                                                        level="body-sm"
                                                        color="danger"
                                                        noWrap
                                                    >
                                                        {safeRenderValue(
                                                            changes.old,
                                                        )}
                                                    </Typography>
                                                </Tooltip>
                                                <span>{"»»"}</span>
                                                <Tooltip
                                                    title={safeRenderValue(
                                                        changes.new,
                                                    )}
                                                    arrow
                                                >
                                                    <Typography
                                                        level="body-sm"
                                                        color="success"
                                                        noWrap
                                                    >
                                                        {safeRenderValue(
                                                            changes.new,
                                                        )}
                                                    </Typography>
                                                </Tooltip>
                                            </Stack>
                                        </ListItemContent>
                                    </ListItem>
                                </Grid>
                            ),
                        )}
                    </Grid>
                    <Divider sx={{ mt: 2, mb: -1 }} />
                </List>
            </AccordionDetails>
        </Accordion>
    );
}

HistoryItemWithChanges.propTypes = {
    item: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
};

/**
 * Componente para renderizar un item del historial sin cambios
 */
function HistoryItemSimple({ item, index }) {
    return (
        <ListItem key={index}>
            <ListItemDecorator>
                {getIconHistory(item.history_type)}
            </ListItemDecorator>
            <ListItemContent>
                <Typography level="title-sm">
                    {item.history_type}{" "}
                    {item.has_user
                        ? `por ${
                              item.history_user_fullname
                                  ? `${item.history_user_fullname} (${item.history_user_username})`
                                  : item.history_user_username
                          } — ${item.history_user_role}`
                        : ""}
                </Typography>
                <Typography level="body-sm" noWrap>
                    {dayjs(item.history_date).format("DD/MM/YYYY HH:mm:ss A")}
                </Typography>
            </ListItemContent>
        </ListItem>
    );
}

HistoryItemSimple.propTypes = {
    item: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
};

/**
 * Componente para mostrar el historial de cambios
 */
export function HistoryList({ historial }) {
    if (!historial || historial.length === 0) return null;

    return (
        <Box sx={{ mt: "10px" }}>
            <DialogTitle>Historial de cambios</DialogTitle>
            <List
                size="lg"
                variant="outlined"
                sx={{ borderRadius: "sm", mt: "10px" }}
            >
                {historial.map((item, index) =>
                    item.changes ? (
                        <HistoryItemWithChanges
                            key={index}
                            item={item}
                            index={index}
                        />
                    ) : (
                        <HistoryItemSimple
                            key={index}
                            item={item}
                            index={index}
                        />
                    ),
                )}
            </List>
        </Box>
    );
}

HistoryList.propTypes = {
    historial: PropTypes.array.isRequired,
};

/**
 * Componente para renderizar una actividad
 */
function ActivityItem({ actividad, index }) {
    return (
        <ListItem key={index} sx={{ ml: "24px" }}>
            <ListItemDecorator>
                {actividad?.completado ? (
                    <CheckBoxIcon fontSize="medium" color="primary" />
                ) : (
                    <CheckBoxOutlineBlankIcon fontSize="medium" />
                )}
            </ListItemDecorator>
            <ListItemContent>
                <Typography level="title-sm" noWrap>
                    {actividad?.name}
                </Typography>
                <Typography level="body-sm" noWrap>
                    {actividad?.completado
                        ? `Completado — ${dayjs(actividad.date).format(
                              "DD/MM/YYYY HH:mm:ss A",
                          )}`
                        : "Incompleto"}
                </Typography>
            </ListItemContent>
        </ListItem>
    );
}

ActivityItem.propTypes = {
    actividad: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
};

/**
 * Componente para renderizar un módulo con sus actividades
 */
function ModuleItem({ modulo, index, isLast }) {
    return (
        <Accordion key={index}>
            <AccordionSummary>
                <ListItem>
                    <ListItemDecorator>
                        {modulo.completado ? (
                            <CheckBoxIcon fontSize="medium" color="primary" />
                        ) : (
                            <CheckBoxOutlineBlankIcon fontSize="medium" />
                        )}
                    </ListItemDecorator>
                    <ListItemContent>
                        <Typography level="title-sm" noWrap>
                            {modulo.name}
                        </Typography>
                        <Typography level="body-sm" noWrap>
                            {modulo.completado ? "Completado" : "Incompleto"}
                        </Typography>
                    </ListItemContent>
                </ListItem>
            </AccordionSummary>
            {!isLast && <ListDivider inset="gutter" />}
            <AccordionDetails>
                {modulo.actividades.map((actividad, idx) => (
                    <ActivityItem key={idx} actividad={actividad} index={idx} />
                ))}
                {!isLast && <ListDivider inset="gutter" />}
            </AccordionDetails>
        </Accordion>
    );
}

ModuleItem.propTypes = {
    modulo: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
    isLast: PropTypes.bool.isRequired,
};

/**
 * Componente para mostrar el avance de cursos y actividades
 */
export function CourseProgressList({ modulos }) {
    if (!modulos || modulos.length === 0) return null;

    return (
        <Box sx={{ mt: "10px" }}>
            <DialogTitle>Avance de cursos y actividades</DialogTitle>
            <List
                size="lg"
                variant="outlined"
                sx={{ borderRadius: "sm", mt: "10px" }}
            >
                {modulos.map((modulo, index) => (
                    <ModuleItem
                        key={index}
                        modulo={modulo}
                        index={index}
                        isLast={index === modulos.length - 1}
                    />
                ))}
            </List>
        </Box>
    );
}

CourseProgressList.propTypes = {
    modulos: PropTypes.array,
};

/**
 * Componente para renderizar el título del usuario
 */
export function UserTitle({ defaultValues, DOCUMENTOS }) {
    if (!defaultValues) return null;

    const { nombres, apellidos, tipo_doc, num_doc, grupos } = defaultValues;
    const documentType = DOCUMENTOS[tipo_doc]?.split(" ")[0] || "";
    const gruposText = grupos ? ` — ${grupos}` : "";

    return `${nombres} ${apellidos} ${documentType} ${num_doc}${gruposText}`;
}

UserTitle.propTypes = {
    defaultValues: PropTypes.object,
    DOCUMENTOS: PropTypes.object.isRequired,
};

/**
 * Componente para el mensaje de instrucciones según el estado de validación
 */
export function InstructionMessage({ validado }) {
    return validado
        ? "La persona ya ha sido validada. Si hay algún error, edita los campos necesarios y presiona el botón 'Guardar'."
        : "Si hay algún error, edita los campos necesarios. Cuando la información sea correcta presiona el botón 'Validar'.";
}

InstructionMessage.propTypes = {
    validado: PropTypes.bool,
};

/**
 * Componente para renderizar el formulario de verificación
 */
export function FormSection({
    FormularioVerificacion,
    methods,
    disabled = false,
}) {
    return (
        <Grid container spacing={1.25}>
            {FormularioVerificacion.map((slotProps, index) => {
                const {
                    Component,
                    size = { xs: 12, md: 6 },
                    ...inputProps
                } = slotProps;

                const { name } = inputProps?.controller ?? {};

                if (!Component) return null;

                // Propagar disabled a los inputProps
                const enhancedInputProps = {
                    ...inputProps,
                    field: {
                        ...inputProps.field,
                        readOnly: disabled || inputProps.field?.readOnly,
                    },
                };

                const isGridless =
                    ["genero_otro", "otra_conectividad"].includes(name) ||
                    name === undefined;

                return isGridless ? (
                    <Component key={index} inputProps={enhancedInputProps} />
                ) : (
                    <Grid key={index} size={size}>
                        <Component inputProps={enhancedInputProps} />
                    </Grid>
                );
            })}
        </Grid>
    );
}

FormSection.propTypes = {
    FormularioVerificacion: PropTypes.array.isRequired,
    methods: PropTypes.object.isRequired,
    disabled: PropTypes.bool,
};
