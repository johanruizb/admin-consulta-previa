/**
 * PreloadManager
 *
 * Componente que se encarga de precargar datos de forma inteligente
 * al iniciar la aplicación. No renderiza nada visible.
 */

import { useEffect, useRef } from "react";
import { initializePreload } from "@/utils/preloadData";

export default function PreloadManager() {
    const initialized = useRef(false);

    useEffect(() => {
        // Evitar múltiples inicializaciones en desarrollo (React 18 StrictMode)
        if (!initialized.current) {
            initialized.current = true;
            initializePreload();
        }
    }, []);

    // Este componente no renderiza nada
    return null;
}
