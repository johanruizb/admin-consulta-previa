import { useCallback, useMemo, useTransition } from "react";
import useSWR from "swr";
import fetcher from "@/components/fetcher";
import { getURL } from "@/components/utils";
import { useCiclo } from "@/contexts/CicloContext";

/**
 * Hook para gestionar encargados de grupos.
 * Provee funciones para listar, asignar y remover encargados.
 *
 * @param {Object} options - Opciones de configuración
 * @param {number} options.cursoId - Filtrar por curso específico
 * @param {number} options.grupoId - Filtrar por grupo específico
 * @returns {Object} Estado y funciones para gestionar encargados
 */
export function useEncargados({ cursoId = null, grupoId = null } = {}) {
    const { selectedCicloId } = useCiclo();
    const [isPending, startTransition] = useTransition();

    const swrKey = useMemo(() => {
        if (!selectedCicloId) return null;

        const params = new URLSearchParams({ ciclo_id: selectedCicloId });
        if (cursoId) params.append("curso_id", cursoId);
        if (grupoId) params.append("grupo_id", grupoId);

        return getURL(`/api/moodle/encargados/?${params.toString()}`);
    }, [selectedCicloId, cursoId, grupoId]);

    const { data, error, isLoading, isValidating, mutate } = useSWR(
        swrKey,
        fetcher,
        {
            revalidateOnFocus: false,
            dedupingInterval: 5000,
        }
    );

    const asignar = useCallback(
        async ({ grupoId, usuarioId, rol = "principal" }) => {
            if (!selectedCicloId) {
                throw new Error("No hay ciclo seleccionado");
            }

            return new Promise((resolve, reject) => {
                startTransition(async () => {
                    try {
                        const response = await fetch(
                            getURL("/api/moodle/encargados/"),
                            {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({
                                    grupo: grupoId,
                                    usuario: usuarioId,
                                    ciclo: selectedCicloId,
                                    rol,
                                }),
                            }
                        );

                        const result = await response.json();

                        if (!response.ok) {
                            reject(new Error(result.message || result.non_field_errors?.[0] || "Error al asignar encargado"));
                            return;
                        }

                        await mutate();
                        resolve(result);
                    } catch (err) {
                        reject(err);
                    }
                });
            });
        },
        [selectedCicloId, mutate]
    );

    const remover = useCallback(
        async (encargadoId) => {
            return new Promise((resolve, reject) => {
                startTransition(async () => {
                    try {
                        const response = await fetch(
                            getURL(`/api/moodle/encargados/${encargadoId}/`),
                            { method: "DELETE" }
                        );

                        if (!response.ok) {
                            const result = await response.json();
                            reject(new Error(result.message || "Error al remover encargado"));
                            return;
                        }

                        await mutate();
                        resolve({ success: true });
                    } catch (err) {
                        reject(err);
                    }
                });
            });
        },
        [mutate]
    );

    const encargadosPorGrupo = useMemo(() => {
        if (!data) return {};

        const mapa = {};
        for (const encargado of data) {
            const grupoId = encargado.grupo_id;
            if (!mapa[grupoId]) {
                mapa[grupoId] = [];
            }
            mapa[grupoId].push(encargado);
        }
        return mapa;
    }, [data]);

    const encargadosPorCurso = useMemo(() => {
        if (!data) return {};

        const mapa = {};
        for (const encargado of data) {
            const cursoId = encargado.curso_id;
            if (!mapa[cursoId]) {
                mapa[cursoId] = [];
            }
            mapa[cursoId].push(encargado);
        }
        return mapa;
    }, [data]);

    return {
        encargados: data ?? [],
        encargadosPorGrupo,
        encargadosPorCurso,
        error,
        isLoading,
        isValidating,
        isPending,
        asignar,
        remover,
        refrescar: mutate,
    };
}

/**
 * Hook para buscar usuarios asignables como encargados.
 *
 * @param {string} search - Término de búsqueda
 * @returns {Object} Lista de usuarios y estado de carga
 */
export function useUsuariosAsignables(search = "") {
    const swrKey = useMemo(() => {
        const params = new URLSearchParams();
        if (search) params.append("search", search);
        return getURL(`/api/moodle/encargados/usuarios_asignables/?${params.toString()}`);
    }, [search]);

    const { data, error, isLoading } = useSWR(swrKey, fetcher, {
        revalidateOnFocus: false,
        dedupingInterval: 10000,
    });

    return {
        usuarios: data ?? [],
        error,
        isLoading,
    };
}

/**
 * Hook para obtener el encargado principal de un grupo específico.
 *
 * @param {number} grupoId - ID del grupo
 * @returns {Object} Encargado principal y estado de carga
 */
export function useEncargadoGrupo(grupoId) {
    const { selectedCicloId } = useCiclo();

    const swrKey = useMemo(() => {
        if (!grupoId) return null;

        const params = new URLSearchParams({ grupo_id: grupoId });
        if (selectedCicloId) params.append("ciclo_id", selectedCicloId);

        return getURL(`/api/moodle/encargados/por_grupo/?${params.toString()}`);
    }, [grupoId, selectedCicloId]);

    const { data, error, isLoading } = useSWR(swrKey, fetcher, {
        revalidateOnFocus: false,
    });

    return {
        encargado: data,
        error,
        isLoading,
    };
}

export default useEncargados;
