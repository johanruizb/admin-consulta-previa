/**
 * PreloadManager
 *
 * Componente que se encarga de precargar datos de forma inteligente
 * al iniciar la aplicación. No renderiza nada visible.
 */

import { useEffect } from "react";
import { initializePreload } from "@/utils/preloadData";
import { useIsClient, useToggle } from "@uidotdev/usehooks";

export default function PreloadManager({ children }) {
    const [completed, setCompleted] = useToggle(false);
    const [initialized, toggle] = useToggle(false);
    const isClient = useIsClient();

    useEffect(() => {
        if (isClient && !initialized) {
            initializePreload().then(() => {
                setCompleted(true);
            });
            toggle();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isClient, initialized]);

    if (!completed) return null;

    return children;
}
