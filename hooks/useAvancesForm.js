import { useCiclo } from "@/contexts/CicloContext";
import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";

export function useAvancesForm() {
    const { selectedCicloId } = useCiclo();

    const methods = useForm({
        defaultValues: {
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
        },
    });

    const { control, reset, setValue } = methods;
    const formValues = useWatch({ control });

    useEffect(() => {
        if (selectedCicloId) {
            reset((prev) => ({ ...prev, ciclo_id: selectedCicloId }));
        }
    }, [selectedCicloId, reset]);

    const courseId = formValues.activity__module__course_id;
    useEffect(() => {
        if (courseId) {
            setValue("activity__module_id", "all");
            setValue("grupo_usuario", "all");
        }
    }, [courseId, setValue]);

    return { methods, formValues };
}
