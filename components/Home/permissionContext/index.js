const { createContext } = require("react");

const PermissionContext = createContext({
    permissions: null,
    hasPermission: () => false,
    isAdmin: false,
    isLoading: true,
    isValidating: false,
    error: null,
});

export default PermissionContext;
