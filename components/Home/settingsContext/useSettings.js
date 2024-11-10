import { useContext } from "react";
import SettingsContext from ".";

function useSettingsContext() {
    const config = useContext(SettingsContext);
    return config;
}

export default useSettingsContext;
