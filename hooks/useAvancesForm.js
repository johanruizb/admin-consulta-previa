import { useCiclo } from "@/contexts/CicloContext";
import { useEffect, useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";

export function useAvancesForm() {
    const { selectedCicloId } = useCiclo();

    // Valores por defecto optimizados
    const defaultValues = useMemo(
        () => ({
            // activity__module__course_id: 1,
            grupo_usuario: "all",
            activity__module_id: "all",
            user__ciudad_nac__state_id__country_id: "all",
            user__ciudad__state_id: "all",
            user__genero_id: "all",
            user__etnia: "all",
            user__tipo_cliente: "all",
            user__zona: "all",
            user__conectividad: "all",
            modulo_completado: "all",
            porcentaje_avance: [0, 100],
            ciclo_id: selectedCicloId || null,
        }),
        [selectedCicloId],
    );

    const methods = useForm({ defaultValues });
    const { control, setValue, reset } = methods;

    // Watch solo los campos que necesitamos para lógica condicional
    const [
        personas_sin_actividad,
        modulo_completado,
        activity__module__course_id,
    ] = useWatch({
        control,
        name: [
            "personas_sin_actividad",
            "modulo_completado",
            "activity__module__course_id",
        ],
    });

    // Watch todos los valores para SWR (memoizado)
    const formValues = useWatch({ control });

    // Actualizar ciclo_id cuando cambie el contexto
    useEffect(() => {
        if (selectedCicloId && formValues.ciclo_id !== selectedCicloId) {
            setValue("ciclo_id", selectedCicloId, { shouldDirty: false });
        }
    }, [selectedCicloId, formValues.ciclo_id, setValue]);

    // Lógica condicional para activity__module_id
    useEffect(() => {
        if ([1, 2].includes(activity__module__course_id)) {
            setValue("activity__module_id", "all");
        }
    }, [activity__module__course_id, setValue]);

    // Lógica condicional para modulo_completado
    useEffect(() => {
        if (
            personas_sin_actividad &&
            (modulo_completado !== "all" || modulo_completado === true)
        ) {
            setValue("modulo_completado", "all");
        }
    }, [personas_sin_actividad, modulo_completado, setValue]);

    // Reset form cuando cambie el ciclo principal
    useEffect(() => {
        if (selectedCicloId) {
            reset((prev) => ({ ...prev, ciclo_id: selectedCicloId }));
        }
    }, [selectedCicloId, reset]);

    return {
        methods,
        formValues,
        // Campos específicos para lógica condicional
        personas_sin_actividad,
        modulo_completado,
        activity__module__course_id,
    };
}
