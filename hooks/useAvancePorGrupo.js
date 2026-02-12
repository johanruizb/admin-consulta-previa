import fetcher from "@/components/fetcher";
import { getURL } from "@/components/utils";
import useSWR from "swr";

export default function useAvancePorGrupo(cicloId, cursoId) {
    const { data, error, isLoading, mutate } = useSWR(
        cicloId && cursoId
            ? getURL(
                  `api/moodle/avance-por-grupo?ciclo_id=${cicloId}&curso_id=${cursoId}`,
              )
            : null,
        fetcher,
        {
            revalidateOnFocus: false,
            dedupingInterval: 5000,
            errorRetryCount: 2,
        },
    );

    return {
        data,
        error,
        isLoading,
        refreshData: mutate,
        hasData: !!data?.filas?.length,
    };
}
