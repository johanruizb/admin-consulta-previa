const { createContext } = require("react");

const SettingsContext = createContext({
    settings: { colorScheme: "light", useWideInterface: false },
    saveSettings: () => {},
});

export default SettingsContext;
