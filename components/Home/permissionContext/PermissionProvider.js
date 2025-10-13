import { useCallback } from "react";

import useSWR from "swr";

import PermissionContext from ".";
import fetcher from "@/components/fetcher";
import { getURL } from "@/components/utils";
import { useUser } from "@clerk/nextjs";

function PermissionProvider({ children }) {
    const { isLoaded: clerkLoaded, isSignedIn } = useUser();

    const {
        data: permissions,
        isLoading,
        isValidating,
        error,
    } = useSWR(
        clerkLoaded && isSignedIn ? getURL("/api/permissions") : null,
        fetcher
    );

    const hasPermission = useCallback(
        (permission) => {
            if (!permissions) return false;
            return permissions.includes(permission);
        },
        [permissions]
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
