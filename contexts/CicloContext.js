import { createContext, useContext, useMemo } from "react";
import { useSessionStorage } from "@uidotdev/usehooks";
import useSWR from "swr";
import fetcher from "@/components/fetcher";
import { getURL } from "@/components/utils";
import { useUser } from "@clerk/nextjs";

// Crear el contexto
const CicloContext = createContext();

// Provider del contexto
export function CicloProvider({ children }) {
    const { isLoaded: clerkLoaded, isSignedIn } = useUser();

    // SWR para obtener ciclos disponibles (una sola llamada para toda la app)
    const {
        data: ciclos,
        isLoading,
        error,
    } = useSWR(
        clerkLoaded && isSignedIn ? getURL("api/usuarios/ciclos") : null,
        fetcher
    );

    // SessionStorage para persistir ciclo seleccionado
    const [selectedCicloId, setSelectedCicloId] = useSessionStorage(
        "selected-ciclo-id",
        null
    );

    // Lógica para determinar el ciclo actual
    const cicloActual = useMemo(() => {
        if (ciclos?.success && ciclos.data.length > 0) {
            if (selectedCicloId) {
                const encontrado = ciclos.data.find(
                    (c) => c.id === selectedCicloId
                );
                if (encontrado) return encontrado;
            }
            // Si no hay ciclo seleccionado, usar el ciclo actual por defecto
            const cicloActualPorDefecto = ciclos.data.find((c) => c.is_current);
            if (cicloActualPorDefecto) {
                // Actualizar el sessionStorage con el ciclo actual
                setSelectedCicloId(cicloActualPorDefecto.id);
                return cicloActualPorDefecto;
            }
            // Último fallback al primer ciclo disponible
            const primerCiclo = ciclos.data[0];
            setSelectedCicloId(primerCiclo.id);
            return primerCiclo;
        }
        return null;
    }, [ciclos, selectedCicloId, setSelectedCicloId]);

    // Función para cambiar el ciclo
    const setCiclo = useMemo(
        () => (cicloId) => {
            setSelectedCicloId(cicloId);
        },
        [setSelectedCicloId]
    );

    // Valor del contexto optimizado con useMemo
    const value = useMemo(
        () => ({
            // Datos
            ciclos: ciclos?.data || [],
            cicloActual,
            selectedCicloId: cicloActual?.id || selectedCicloId,

            // Estados
            isLoading,
            error: error || (!ciclos?.success && ciclos?.message),

            // Acciones
            setCiclo,

            // Helpers
            isSuccess: ciclos?.success || false,
        }),
        [ciclos, cicloActual, selectedCicloId, isLoading, error, setCiclo]
    );

    return (
        <CicloContext.Provider value={value}>
            {isLoading ? null : children}
        </CicloContext.Provider>
    );
}

// Hook personalizado para usar el contexto
export function useCiclo() {
    const context = useContext(CicloContext);

    if (context === undefined) {
        throw new Error("useCiclo debe ser usado dentro de un CicloProvider");
    }

    return context;
}

// Hook auxiliar para obtener solo el ciclo actual (optimización)
export function useCicloActual() {
    const { cicloActual } = useCiclo();
    return cicloActual;
}

// Hook auxiliar para cambiar ciclos
export function useCicloActions() {
    const { setCiclo, ciclos } = useCiclo();
    return { setCiclo, ciclos };
}

// Hook para debugging (remover en producción)
export function useCicloDebug() {
    const context = useCiclo();
    console.log("Ciclo Debug:", {
        isLoading: context.isLoading,
        cicloActual: context.cicloActual,
        selectedCicloId: context.selectedCicloId,
        ciclosCount: context.ciclos.length,
    });
    return context;
}
