import { useContext } from "react";
import PermissionContext from ".";

function usePermissionContext() {
    const permissions = useContext(PermissionContext);
    return permissions;
}

export default usePermissionContext;
