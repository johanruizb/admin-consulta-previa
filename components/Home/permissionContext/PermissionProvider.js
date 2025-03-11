import { useCallback } from "react";

import useSWR from "swr";

import PermissionContext from ".";
import fetcher from "@/components/fetcher";

function PermissionProvider({ children }) {
    const {
        data: permissions,
        isLoading,
        isValidating,
        error,
    } = useSWR("/api/permissions", fetcher);

    const hasPermission = useCallback(
        (permission) => {
            if (!permissions) return false;
            return permissions.includes(permission);
        },
        [permissions],
    );

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
