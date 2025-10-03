import { useCiclo } from "@/contexts/CicloContext";
import CustomSelect from "../Field/Select";
import fetcher from "@/components/fetcher";
import { getURL } from "@/components/utils";
import useSWR from "swr";
import { useMemo, useEffect } from "react";
import { useFormContext } from "react-hook-form";

export default function DynamicCursoSelect({ inputProps }) {
    const inputName = inputProps.controller.name;

    const { selectedCicloId } = useCiclo();
    const { setValue } = useFormContext();

    const { data: cursos, isLoading } = useSWR(
        selectedCicloId
            ? getURL(
                  `api/usuarios/cursos/disponibles?ciclo_id=${selectedCicloId}`
              )
            : null,
        fetcher
    );

    // Establecer valor por defecto cuando se cargan los cursos
    useEffect(() => {
        if (!isLoading && cursos?.length > 0) {
            const firstCourse = cursos[0];
            // Solo establecer el valor si tiene un ID válido
            if (firstCourse?.id !== undefined && firstCourse?.id !== null) {
                setValue(inputName, firstCourse.id);
            }
        }
    }, [inputName, isLoading, cursos, setValue]);

    // Crear las props dinámicas
    const dynamicInputProps = useMemo(
        () => ({
            ...inputProps,
            field: {
                ...inputProps.field,
                options: cursos
                    ? cursos
                          .filter((curso) => curso.id !== undefined && curso.id !== null)
                          .map((curso) => ({
                              value: curso.id,
                              label: curso.shortname || curso.name,
                          }))
                    : [],
                disabled: isLoading || !selectedCicloId,
                placeholder: isLoading
                    ? "Cargando cursos..."
                    : !selectedCicloId
                    ? "Seleccione un ciclo primero"
                    : cursos?.length === 0
                    ? "No hay cursos disponibles"
                    : "Seleccione un curso",
            },
        }),
        [cursos, inputProps, isLoading, selectedCicloId]
    );

    return <CustomSelect inputProps={dynamicInputProps} />;
}
