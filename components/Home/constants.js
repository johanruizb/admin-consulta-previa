import CustomCheckbox from "../Field/CheckBox";
import CustomSelect from "../Field/Select";

const EXPERIMENTAL = true;

const SettingsForm = [
    {
        Component: CustomSelect,
        controller: {
            name: "colorScheme",
        },
        field: {
            options: [
                {
                    value: "dark",
                    label: "Modo oscuro",
                },
                {
                    value: "light",
                    label: "Modo claro",
                },
            ],
            label: "Tema de la app",
        },
    },
    {
        Component: CustomCheckbox,
        controller: {
            name: "useWideInterface",
        },
        field: {
            label: "Interfaz amplia",
            content: "Usar una interfaz mas amplia en PC",
        },
    },
];

export { EXPERIMENTAL, SettingsForm };
