import { getURL } from "@/components/utils";
import { useMemo, useCallback } from "react";
import useSWR from "swr";

async function fetchResumen([url, body]) {
    const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
    });
    if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
    return res.json();
}

export function useAvancesData(formValues) {
    const serializedValues = JSON.stringify(formValues);

    const swrKey = useMemo(() => {
        if (!formValues?.ciclo_id || !formValues?.activity__module__course_id)
            return null;

        return [getURL("/api/moodle/reporte/resumen"), serializedValues];
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [serializedValues]);

    const { data, error, isLoading, isValidating, mutate } = useSWR(
        swrKey,
        fetchResumen,
        {
            revalidateOnReconnect: true,
            errorRetryCount: 2,
            keepPreviousData: true,
        },
    );

    const refreshData = useCallback(() => mutate(), [mutate]);

    return {
        data,
        error,
        isLoading,
        isValidating,
        refreshData,
    };
}
