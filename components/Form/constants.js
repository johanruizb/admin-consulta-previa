import TextField from "../Field/TextField";

const FormularioVerificacion = [
    {
        Component: TextField,
        controller: {
            name: "firstName",
            defaultValue: "",
            rules: {
                required: {
                    value: true,
                    message: "Este campo no puede estar vacio",
                },
                pattern: {
                    value: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
                    message: "Por favor verifica el nombre",
                },
            },
        },
        field: {
            label: "Nombres",
            onChange: (e, onChangeController) =>
                onChangeController((e.target.value || "").toUpperCase()),
        },
    },
];

export default FormularioVerificacion;
