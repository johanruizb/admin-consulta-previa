"use client";

import { createContext, useContext, useMemo, useState, useCallback } from "react";
import { useEncargados, useUsuariosAsignables } from "@/hooks/useEncargados";

const EncargadosContext = createContext(null);

/**
 * Provider para gestión de encargados.
 * Proporciona estado y acciones a todos los subcomponentes.
 */
export function EncargadosProvider({ cursoId = null, children }) {
    const [search, setSearch] = useState("");

    const {
        encargados,
        encargadosPorGrupo,
        encargadosPorCurso,
        error,
        isLoading,
        isValidating,
        isPending,
        asignar,
        remover,
        refrescar,
    } = useEncargados({ cursoId });

    const { usuarios, isLoading: isLoadingUsuarios } = useUsuariosAsignables(search);

    const value = useMemo(
        () => ({
            encargados,
            encargadosPorGrupo,
            encargadosPorCurso,
            usuarios,
            error,
            isLoading,
            isValidating,
            isPending,
            isLoadingUsuarios,
            search,
            setSearch,
            asignar,
            remover,
            refrescar,
        }),
        [
            encargados,
            encargadosPorGrupo,
            encargadosPorCurso,
            usuarios,
            error,
            isLoading,
            isValidating,
            isPending,
            isLoadingUsuarios,
            search,
            asignar,
            remover,
            refrescar,
        ]
    );

    return (
        <EncargadosContext.Provider value={value}>
            {children}
        </EncargadosContext.Provider>
    );
}

/**
 * Hook para acceder al contexto de encargados.
 */
export function useEncargadosContext() {
    const context = useContext(EncargadosContext);
    if (!context) {
        throw new Error("useEncargadosContext debe usarse dentro de EncargadosProvider");
    }
    return context;
}
