import { getURL } from "@/components/utils";
import { useMemo, useCallback } from "react";
import useSWR from "swr";

export function useAvancesData(formValues) {
    // Memoizar la SWR key para evitar recalculos innecesarios
    const swrKey = useMemo(() => {
        if (
            !formValues ||
            !formValues.ciclo_id ||
            !formValues.activity__module__course_id
        )
            return null;

        return [
            getURL("/api/moodle/reporte/resumen"),
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formValues),
            },
        ];
    }, [formValues]);

    // Fetcher optimizado
    const fetcher = useCallback(async ([url, config]) => {
        const res = await fetch(url, config);

        if (!res.ok) {
            throw new Error(`Error ${res.status}: ${res.statusText}`);
        }

        return res.json();
    }, []);

    // SWR con configuración optimizada
    const { data, error, isLoading, isValidating, mutate } = useSWR(
        swrKey,
        fetcher,
        {
            revalidateOnFocus: false, // Evitar revalidación al hacer focus
            revalidateOnReconnect: true,
            dedupingInterval: 5000, // Dedup requests por 5 segundos
            errorRetryCount: 2,
        },
    );

    // Función para refrescar datos manualmente
    const refreshData = useCallback(() => {
        return mutate(undefined, { revalidate: true });
    }, [mutate]);

    // Función para refrescar sin revalidación (más rápida)
    const forceRefresh = useCallback(() => {
        return mutate(undefined, { validate: false });
    }, [mutate]);

    return {
        data,
        error,
        isLoading,
        isValidating,
        refreshData,
        forceRefresh,
        // Estado derivado
        hasError: !!error,
        hasData: !!data && !error,
        isEmpty: !!data && (!data.resultados || data.resultados.length === 0),
    };
}
