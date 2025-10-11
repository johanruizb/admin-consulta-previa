/**
 * Utilidad para precargar datos usando SWR preload
 * 
 * Este módulo se encarga de precargar datos estadísticos de forma inteligente
 * basándose en los ciclos y cursos disponibles en el sistema.
 */

import { preload } from "swr";
import fetcher from "@/components/fetcher";
import { getURL } from "@/components/utils";

/**
 * Precarga datos de ciclos con cursos
 */
export const preloadCiclosConCursos = () => {
    preload(getURL("api/usuarios/ciclos/con-cursos"), fetcher);
};

/**
 * Precarga estadísticas de inscripciones por período
 * @param {number} cicloId - ID del ciclo
 * @param {string} periodo - Período (dias, semanas, meses)
 * @param {number[]} courseIds - Array de IDs de cursos
 */
export const preloadInscripcionesPorPeriodo = (cicloId, periodo = "dias", courseIds = []) => {
    const params = new URLSearchParams();
    params.append("ciclo_id", cicloId);
    params.append("periodo", periodo);
    
    if (courseIds.length > 0) {
        courseIds.forEach((courseId) => {
            params.append("courses", courseId);
        });
    }
    
    const url = getURL(`api/usuarios/inscripciones-por-periodo/?${params.toString()}`);
    preload(url, fetcher);
};

/**
 * Precarga estadísticas generales
 * @param {number} cicloId - ID del ciclo
 * @param {number[]} courseIds - Array de IDs de cursos (opcional)
 */
export const preloadEstadisticas = (cicloId, courseIds = null) => {
    const url = getURL(`api/usuarios/estadisticas?ciclo_id=${cicloId}`);
    
    preload(
        {
            url,
            args: {
                options: {
                    method: "POST",
                    body: JSON.stringify(courseIds),
                },
            },
        },
        ({ url, args: { options } }) => fetcher(url, options)
    );
};

/**
 * Precarga cursos disponibles para un ciclo
 * @param {number} cicloId - ID del ciclo
 */
export const preloadCursosDisponibles = (cicloId) => {
    const url = getURL(`api/usuarios/cursos/disponibles?ciclo_id=${cicloId}`);
    preload(url, fetcher);
};

/**
 * Precarga todos los datos necesarios para un ciclo específico
 * @param {number} cicloId - ID del ciclo
 * @param {number[]} courseIds - Array de IDs de cursos
 */
export const preloadCicloCompleto = (cicloId, courseIds = []) => {
    // Precargar cursos disponibles
    preloadCursosDisponibles(cicloId);
    
    // Precargar estadísticas generales
    preloadEstadisticas(cicloId, courseIds);
    
    // Precargar inscripciones por período para diferentes configuraciones
    const periodos = ["dias", "semanas", "meses"];
    
    periodos.forEach((periodo) => {
        // Todos los cursos
        if (courseIds.length > 0) {
            preloadInscripcionesPorPeriodo(cicloId, periodo, courseIds);
        }
        
        // Cada curso individualmente
        courseIds.forEach((courseId) => {
            preloadInscripcionesPorPeriodo(cicloId, periodo, [courseId]);
        });
    });
};

/**
 * Inicializa la precarga de datos basándose en los ciclos disponibles
 * Esta función debe llamarse lo antes posible en la aplicación
 */
export const initializePreload = async () => {
    try {
        // Primero, precargar la lista de ciclos con cursos
        preloadCiclosConCursos();
        
        // Obtener ciclos y cursos para precargar datos relevantes
        const response = await fetcher(getURL("api/usuarios/ciclos/con-cursos"));
        
        if (response?.success && response?.data) {
            const ciclos = response.data;
            
            // Precargar datos para cada ciclo (limitado a los 2 más recientes)
            const ciclosRecientes = ciclos.slice(0, 2);
            
            ciclosRecientes.forEach((ciclo) => {
                const courseIds = ciclo.cursos.map((curso) => curso.id);
                preloadCicloCompleto(ciclo.id, courseIds);
            });
        }
    } catch (error) {
        console.error("Error al inicializar precarga de datos:", error);
    }
};
