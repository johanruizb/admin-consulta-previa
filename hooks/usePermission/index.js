import usePermissionContext from "@/components/Home/permissionContext/usePermission";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function usePermission(permissions = "" | []) {
    const { hasPermission, isLoading } = usePermissionContext();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading) {
            const isArray = Array.isArray(permissions);
            const hasAllPermissions = isArray
                ? permissions.every((permission) => hasPermission(permission))
                : hasPermission(permissions);
            if (!hasAllPermissions) router.replace("/");
        }
    }, [isLoading, hasPermission, permissions]);
}
