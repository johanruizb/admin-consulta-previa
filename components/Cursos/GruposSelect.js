import Option from "@mui/joy/Option";
import Select from "@mui/joy/Select";
import FormControl from "@mui/joy/FormControl";
import FormHelperText from "@mui/joy/FormHelperText";
import FormLabel from "@mui/joy/FormLabel";
import Skeleton from "@mui/joy/Skeleton";
import Grid from "@mui/material/Grid";
import useSWR from "swr";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { useEffect, useMemo } from "react";

import fetcher from "@/components/fetcher";
import { useCiclo } from "@/contexts/CicloContext";

/**
 * Componente de selección de grupos dinámico.
 * Solo se muestra si el curso seleccionado tiene grupos en el ciclo actual.
 * Los grupos se cargan desde el endpoint /api/moodle/curso/{curso_id}/grupos
 */
export default function GruposSelect() {
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
            label: grupo.shortname !== "all" ? grupo.shortname : grupo.name,
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

    return (
        <Grid size={{ xs: 12, md: 3 }}>
            <Controller
                control={control}
                name="grupo_usuario"
                defaultValue="all"
                render={({ field, fieldState: { error: fieldError } }) => (
                    <FormControl error={Boolean(fieldError)}>
                        <FormLabel>Grupo</FormLabel>
                        {isLoading ? (
                            <Skeleton variant="rectangular" height={36} />
                        ) : (
                            <Select
                                {...field}
                                onChange={(e, newValue) => {
                                    field.onChange(newValue);
                                }}
                                placeholder="Seleccione un grupo"
                            >
                                {options.map((option) => (
                                    <Option
                                        key={option.value}
                                        value={option.value}
                                    >
                                        {option.label}
                                    </Option>
                                ))}
                            </Select>
                        )}
                        <FormHelperText>
                            {fieldError?.message ?? " "}
                        </FormHelperText>
                    </FormControl>
                )}
            />
        </Grid>
    );
}
