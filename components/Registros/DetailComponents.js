import { getIconHistory } from "@/components/Registros/functions";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import InfoIcon from "@mui/icons-material/Info";
import { Alert } from "@mui/joy";
import Accordion from "@mui/joy/Accordion";
import AccordionDetails from "@mui/joy/AccordionDetails";
import AccordionGroup from "@mui/joy/AccordionGroup";
import AccordionSummary from "@mui/joy/AccordionSummary";
import Box from "@mui/joy/Box";
import Chip from "@mui/joy/Chip";
import DialogTitle from "@mui/joy/DialogTitle";
import List from "@mui/joy/List";
import ListDivider from "@mui/joy/ListDivider";
import ListItem from "@mui/joy/ListItem";
import ListItemContent from "@mui/joy/ListItemContent";
import ListItemDecorator from "@mui/joy/ListItemDecorator";
import Skeleton from "@mui/joy/Skeleton";
import Stack from "@mui/joy/Stack";
import Tooltip from "@mui/joy/Tooltip";
import Typography from "@mui/joy/Typography";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import dayjs from "dayjs";
import PropTypes from "prop-types";
import { memo, useCallback, useMemo, useState } from "react";

// Estilos constantes extraídos para evitar recreación en cada render
const ACCORDION_DETAILS_SX = { m: 0, p: 0 };
const BOX_MT_SX = { mt: "10px" };
const LIST_SX = { borderRadius: "sm", mt: "10px" };
const ACCORDION_SUMMARY_SX = { py: 1 };
const CYCLE_ACCORDION_GROUP_SX = {
    borderRadius: "sm",
    mt: "10px",
    [`& .MuiAccordion-root`]: {
        marginTop: "0",
        transition: "0.2s ease",
        '& button:not([aria-expanded="true"])': {
            transition: "0.2s ease",
            paddingBottom: "0.625rem",
        },
        "& button:hover": {
            background: "transparent",
        },
    },
    [`& .MuiAccordion-root.Mui-expanded`]: {
        bgcolor: "background.level1",
        borderRadius: "md",
        borderBottom: "1px solid",
        borderColor: "background.level2",
    },
};

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
const HistoryItemWithChanges = memo(function HistoryItemWithChanges({ item }) {
    // Pre-formatear fecha
    const formattedDate = useMemo(
        () => dayjs(item.history_date).format("DD/MM/YYYY HH:mm:ss A"),
        [item.history_date],
    );

    // Pre-calcular entries de cambios
    const changesEntries = useMemo(
        () => Object.entries(item.changes),
        [item.changes],
    );

    return (
        <Accordion>
            <AccordionSummary>
                <ListItem>
                    <ListItemDecorator>
                        {getIconHistory(item.history_type, {
                            color: "info",
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
                            {formattedDate}
                        </Typography>
                    </ListItemContent>
                </ListItem>
            </AccordionSummary>
            <AccordionDetails sx={ACCORDION_DETAILS_SX}>
                <List>
                    <Grid container spacing={1}>
                        {changesEntries.map(([field, changes]) => (
                            <Grid
                                key={field}
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
                        ))}
                    </Grid>
                    <Divider sx={{ mt: 2, mb: -1 }} />
                </List>
            </AccordionDetails>
        </Accordion>
    );
});

HistoryItemWithChanges.propTypes = {
    item: PropTypes.object.isRequired,
};

/**
 * Componente para renderizar un item del historial sin cambios
 */
const HistoryItemSimple = memo(function HistoryItemSimple({ item }) {
    // Pre-formatear fecha
    const formattedDate = useMemo(
        () => dayjs(item.history_date).format("DD/MM/YYYY HH:mm:ss A"),
        [item.history_date],
    );

    return (
        <ListItem>
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
                    {formattedDate}
                </Typography>
            </ListItemContent>
        </ListItem>
    );
});

HistoryItemSimple.propTypes = {
    item: PropTypes.object.isRequired,
};

/**
 * Componente para mostrar el historial de cambios
 */
export const HistoryList = memo(function HistoryList({ historial }) {
    if (!historial || historial.length === 0) return null;

    return (
        <Box sx={BOX_MT_SX}>
            <DialogTitle>Historial de cambios</DialogTitle>
            <List size="lg" variant="outlined" sx={LIST_SX}>
                {historial.map((item, index) =>
                    item.changes ? (
                        <HistoryItemWithChanges key={index} item={item} />
                    ) : (
                        <HistoryItemSimple key={index} item={item} />
                    ),
                )}
            </List>
        </Box>
    );
});

HistoryList.propTypes = {
    historial: PropTypes.array.isRequired,
};

/**
 * Componente para renderizar una actividad
 */
const ActivityItem = memo(function ActivityItem({ actividad }) {
    const statusText = !actividad?.completado
        ? "Incompleto"
        : `Completado — ${dayjs(actividad.date).format(
              "DD/MM/YYYY HH:mm:ss A",
          )}`;

    return (
        <ListItem sx={{ ml: "24px" }}>
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
                    {statusText}
                </Typography>
            </ListItemContent>
        </ListItem>
    );
});

ActivityItem.propTypes = {
    actividad: PropTypes.object.isRequired,
};

/**
 * Componente para renderizar un módulo con sus actividades
 */
const ModuleItem = memo(function ModuleItem({ modulo, isLast }) {
    return (
        <Accordion>
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
            <AccordionDetails>
                {modulo.actividades.map((actividad, idx) => (
                    <ActivityItem key={idx} actividad={actividad} />
                ))}
            </AccordionDetails>
        </Accordion>
    );
});

ModuleItem.propTypes = {
    modulo: PropTypes.object.isRequired,
    isLast: PropTypes.bool.isRequired,
};

/**
 * Componente para mostrar los módulos de un ciclo específico
 */
const CycleModulesList = memo(function CycleModulesList({ modulos }) {
    return (
        <AccordionGroup>
            {modulos.map((modulo, index) => (
                <ModuleItem
                    key={modulo.name || index}
                    modulo={modulo}
                    isLast={index === modulos.length - 1}
                />
            ))}
        </AccordionGroup>
    );
});

CycleModulesList.propTypes = {
    modulos: PropTypes.array.isRequired,
};

/**
 * Componente para mostrar el avance de cursos y actividades agrupados por ciclo
 */
export const CourseProgressList = memo(function CourseProgressList({
    modulos,
}) {
    // Detectar estructura y calcular índice expandido en un solo useMemo
    // Los hooks deben ejecutarse antes de cualquier return condicional
    const { isNewStructure, initialExpandedIndex } = useMemo(() => {
        if (!modulos || modulos.length === 0) {
            return { isNewStructure: false, initialExpandedIndex: null };
        }
        const isNew = modulos[0]?.ciclo_id !== undefined;
        if (!isNew)
            return { isNewStructure: false, initialExpandedIndex: null };

        const currentIndex = modulos.findIndex((ciclo) => ciclo.es_actual);
        return {
            isNewStructure: true,
            initialExpandedIndex: currentIndex >= 0 ? currentIndex : 0,
        };
    }, [modulos]);

    // Lazy initialization para useState
    const [expandedIndex, setExpandedIndex] = useState(
        () => initialExpandedIndex,
    );

    // Callback memoizado para manejar cambios de accordion
    const handleAccordionChange = useCallback(
        (index) => (_, expanded) => {
            setExpandedIndex(expanded ? index : null);
        },
        [],
    );

    // Guard clause después de los hooks
    if (!modulos || modulos.length === 0) return null;

    // Estructura antigua: renderizar directamente los módulos
    if (!isNewStructure) {
        return (
            <Box sx={BOX_MT_SX}>
                <DialogTitle>Avance de cursos y actividades</DialogTitle>
                <AccordionGroup>
                    {modulos.map((modulo, index) => (
                        <ModuleItem
                            key={modulo.name || index}
                            modulo={modulo}
                            isLast={index === modulos.length - 1}
                        />
                    ))}
                </AccordionGroup>
            </Box>
        );
    }

    // Nueva estructura: renderizar por ciclo con accordions
    return (
        <Box sx={BOX_MT_SX}>
            <DialogTitle>Avance de cursos y actividades</DialogTitle>
            <AccordionGroup
                variant="outlined"
                sx={CYCLE_ACCORDION_GROUP_SX}
                size="lg"
            >
                {modulos.map((ciclo, index) => (
                    <Accordion
                        key={ciclo.ciclo_id}
                        expanded={expandedIndex === index}
                        onChange={handleAccordionChange(index)}
                    >
                        <AccordionSummary
                            indicator={<ExpandMoreIcon />}
                            sx={ACCORDION_SUMMARY_SX}
                        >
                            <Stack
                                direction="row"
                                spacing={1}
                                alignItems="center"
                            >
                                <Typography level="title-md">
                                    {ciclo.ciclo_nombre}
                                </Typography>
                                {ciclo.es_actual && (
                                    <Chip size="sm" color="primary">
                                        Actual
                                    </Chip>
                                )}
                            </Stack>
                        </AccordionSummary>
                        <AccordionDetails>
                            <CycleModulesList modulos={ciclo.modulos} />
                        </AccordionDetails>
                    </Accordion>
                ))}
            </AccordionGroup>
        </Box>
    );
});

CourseProgressList.propTypes = {
    modulos: PropTypes.array,
};

/**
 * Componente para renderizar el título del usuario
 */
export const UserTitle = memo(function UserTitle({
    defaultValues,
    DOCUMENTOS,
}) {
    if (!defaultValues) return null;

    const { nombres, apellidos, tipo_doc, num_doc, grupos } = defaultValues;
    const documentType = DOCUMENTOS[tipo_doc]?.split(" ")[0] || "";
    const gruposText = grupos ? ` — ${grupos}` : "";

    return `${nombres} ${apellidos} ${documentType} ${num_doc}${gruposText}`;
});

UserTitle.propTypes = {
    defaultValues: PropTypes.object,
    DOCUMENTOS: PropTypes.object.isRequired,
};

/**
 * Componente para el mensaje de instrucciones según el estado de validación
 */
const ALERT_SX = { my: 2 };

export const InstructionMessage = memo(function InstructionMessage({
    validado,
}) {
    return (
        <Alert
            color="primary"
            variant="soft"
            startDecorator={<InfoIcon />}
            sx={ALERT_SX}
        >
            {validado
                ? "La persona ya ha sido validada. Si hay algún error, edita los campos necesarios y presiona el botón 'Guardar'."
                : "Si hay algún error, edita los campos necesarios. Cuando la información sea correcta y completa, presiona el botón 'Guardar y validar' para validar la persona. De lo contrario, puedes presionar 'Guardar sin validar' para guardar los cambios sin validar."}
        </Alert>
    );
});

InstructionMessage.propTypes = {
    validado: PropTypes.bool,
};

/**
 * Componente para renderizar el formulario de verificación
 */
export const FormSection = memo(function FormSection({
    FormularioVerificacion,
    methods,
    disabled = false,
    disabledFields = [],
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

                // Verificar si el campo está en la lista de campos deshabilitados
                const isFieldDisabled = disabledFields.includes(name);

                // Propagar disabled a los inputProps
                const enhancedInputProps = {
                    ...inputProps,
                    field: {
                        ...inputProps.field,
                        readOnly:
                            disabled ||
                            isFieldDisabled ||
                            inputProps.field?.readOnly,
                    },
                };

                // Componente renderizado
                const renderedComponent = (
                    <Component inputProps={enhancedInputProps} />
                );

                // Envolver en Tooltip si el campo está deshabilitado por restricción de permisos
                const componentWithTooltip = isFieldDisabled ? (
                    <Tooltip
                        title="Este campo no se puede modificar. Contacta al administrador."
                        placement="bottom"
                        arrow
                    >
                        <Box component="span" sx={{ cursor: "not-allowed" }}>
                            {renderedComponent}
                        </Box>
                    </Tooltip>
                ) : (
                    renderedComponent
                );

                return (
                    <Grid key={index} size={size}>
                        {componentWithTooltip}
                    </Grid>
                );
            })}
        </Grid>
    );
});

FormSection.propTypes = {
    FormularioVerificacion: PropTypes.array.isRequired,
    methods: PropTypes.object.isRequired,
    disabled: PropTypes.bool,
    disabledFields: PropTypes.arrayOf(PropTypes.string),
};

// ============================================================
// SKELETON LOADING COMPONENTS
// ============================================================

/**
 * Skeleton para el título del usuario
 */
export function UserTitleSkeleton() {
    return (
        <Stack direction="row" spacing={1} alignItems="center">
            <Skeleton variant="text" width={150} height={24} />
            <Skeleton variant="text" width={120} height={24} />
            <Skeleton variant="text" width={80} height={24} />
        </Stack>
    );
}

/**
 * Skeleton para el formulario de verificación
 */
export function FormSectionSkeleton() {
    return (
        <Grid container spacing={1.25}>
            {Array(12)
                .fill(0)
                .map((_, i) => (
                    <Grid key={i} size={{ xs: 12, md: 6 }}>
                        <Stack spacing={0.5}>
                            <Skeleton variant="text" width={100} height={16} />
                            <Skeleton
                                variant="rectangular"
                                height={56}
                                sx={{ borderRadius: "sm" }}
                            />
                        </Stack>
                    </Grid>
                ))}
        </Grid>
    );
}

/**
 * Skeleton para el historial de cambios
 */
export function HistoryListSkeleton() {
    return (
        <Box sx={{ mt: "10px" }}>
            <DialogTitle>
                <Skeleton variant="text" width={180} height={28} />
            </DialogTitle>
            <List
                size="lg"
                variant="outlined"
                sx={{ borderRadius: "sm", mt: "10px" }}
            >
                {Array(3)
                    .fill(0)
                    .map((_, i) => (
                        <ListItem key={i}>
                            <ListItemDecorator>
                                <Skeleton
                                    variant="circular"
                                    width={24}
                                    height={24}
                                />
                            </ListItemDecorator>
                            <ListItemContent>
                                <Skeleton
                                    variant="text"
                                    width="60%"
                                    height={20}
                                />
                                <Skeleton
                                    variant="text"
                                    width="40%"
                                    height={16}
                                />
                            </ListItemContent>
                        </ListItem>
                    ))}
            </List>
        </Box>
    );
}

/**
 * Skeleton para el avance de cursos
 */
export function CourseProgressListSkeleton() {
    return (
        <Box sx={{ mt: "10px" }}>
            <DialogTitle>
                <Skeleton variant="text" width={250} height={28} />
            </DialogTitle>
            <List
                size="lg"
                variant="outlined"
                sx={{ borderRadius: "sm", mt: "10px" }}
            >
                {Array(4)
                    .fill(0)
                    .map((_, i) => (
                        <ListItem key={i}>
                            <ListItemDecorator>
                                <Skeleton
                                    variant="circular"
                                    width={24}
                                    height={24}
                                />
                            </ListItemDecorator>
                            <ListItemContent>
                                <Skeleton
                                    variant="text"
                                    width="50%"
                                    height={20}
                                />
                                <Skeleton
                                    variant="text"
                                    width="30%"
                                    height={16}
                                />
                            </ListItemContent>
                        </ListItem>
                    ))}
            </List>
        </Box>
    );
}
