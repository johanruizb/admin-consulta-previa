import fetcher from "@/components/fetcher";
import { useCiclo } from "@/contexts/CicloContext";
import FormControl from "@mui/joy/FormControl";
import FormHelperText from "@mui/joy/FormHelperText";
import FormLabel from "@mui/joy/FormLabel";
import Option from "@mui/joy/Option";
import Select from "@mui/joy/Select";
import Skeleton from "@mui/joy/Skeleton";
import Grid from "@mui/material/Grid";
import { useEffect, useMemo } from "react";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import useSWR from "swr";

/**
 * Componente de selección de grupos dinámico.
 * Solo se muestra si el curso seleccionado tiene grupos en el ciclo actual.
 * Los grupos se cargan desde el endpoint /api/moodle/curso/{curso_id}/grupos
 * @param {Object} props
 * @param {boolean} props.compact - Si es true, no renderiza el wrapper Grid
 */
export default function GruposSelect({ compact = false, size = "md" }) {
    const { control, setValue } = useFormContext();
    const { selectedCicloId } = useCiclo();

    // Observar el curso seleccionado
    const courseId = useWatch({
        control,
        name: "activity__module__course_id",
    });

    // Construir URL solo si hay curso y ciclo seleccionados
    const apiUrl = useMemo(() => {
        if (!courseId || !selectedCicloId) return null;
        return `/api/moodle/curso/${courseId}/grupos?ciclo_id=${selectedCicloId}`;
    }, [courseId, selectedCicloId]);

    // Fetch de grupos
    const { data: grupos, isLoading, error } = useSWR(apiUrl, fetcher);

    // Convertir grupos a opciones del select
    const options = useMemo(() => {
        if (!grupos || !Array.isArray(grupos)) return [];
        return grupos.map((grupo) => ({
            value: grupo.id,
            label: grupo.name,
        }));
    }, [grupos]);

    // Resetear valor del grupo cuando cambie el curso o ciclo
    useEffect(() => {
        if (options.length > 0) {
            setValue("grupo_usuario", "all");
        }
    }, [courseId, selectedCicloId, setValue, options.length]);

    // No renderizar si no hay grupos disponibles
    if (!apiUrl || isLoading) {
        return null;
    }

    if (error || options.length === 0) {
        return null;
    }

    const selectContent = (
        <Controller
            control={control}
            name="grupo_usuario"
            defaultValue="all"
            render={({ field, fieldState: { error: fieldError } }) => (
                <FormControl error={Boolean(fieldError)} size={size}>
                    <FormLabel>Grupo</FormLabel>
                    {isLoading ? (
                        <Skeleton
                            variant="rectangular"
                            height={compact ? 32 : 36}
                        />
                    ) : (
                        <Select
                            {...field}
                            size={size}
                            onChange={(e, newValue) => {
                                field.onChange(newValue);
                            }}
                            placeholder="Seleccione un grupo"
                        >
                            {options.map((option) => (
                                <Option key={option.value} value={option.value}>
                                    {option.label}
                                </Option>
                            ))}
                        </Select>
                    )}
                    {!compact && (
                        <FormHelperText>
                            {fieldError?.message ?? " "}
                        </FormHelperText>
                    )}
                </FormControl>
            )}
        />
    );

    if (compact) {
        return selectContent;
    }

    return <Grid size={{ xs: 12, md: 3 }}>{selectContent}</Grid>;
}
