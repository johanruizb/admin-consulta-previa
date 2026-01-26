import fetcher from "@/components/fetcher";
import { getURL } from "@/components/utils";
import { useClerk, useUser } from "@clerk/nextjs";
import { enqueueSnackbar } from "notistack";
import { useCallback, useEffect } from "react";
import useSWR from "swr";
import PermissionContext from ".";

function PermissionProvider({ children }) {
    const { signOut } = useClerk();
    const { isLoaded: clerkLoaded, isSignedIn } = useUser();

    const {
        data: permissions,
        isLoading,
        isValidating,
        error,
    } = useSWR(
        clerkLoaded && isSignedIn ? getURL("/api/permissions") : null,
        fetcher,
    );

    const { data: djangoUser } = useSWR(getURL("api/user"), fetcher);

    const hasPermission = useCallback(
        (permission) => {
            if (!permissions || !djangoUser) return false;
            if (djangoUser.roleId === 1) return true; // Superusuario
            return permissions.includes(permission);
        },
        [permissions, djangoUser],
    );

    const invalid = clerkLoaded && isSignedIn && !isLoading && !permissions;

    useEffect(() => {
        if (invalid) {
            // Cerrar la sesion si no se pueden cargar los permisos
            enqueueSnackbar(
                "Sesión invalida, por favor inicie sesión de nuevo.",
                {
                    variant: "warning",
                },
            );
            signOut();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [invalid]);

    return (
        <PermissionContext.Provider
            value={{
                permissions,
                hasPermission,
                isLoading,
                isValidating,
                error,
            }}
        >
            {children}
        </PermissionContext.Provider>
    );
}

export default PermissionProvider;
