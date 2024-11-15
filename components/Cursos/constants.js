import AsyncSelect from "@/components/Field/AsyncSelect";
import CustomSelect from "../Field/Select";
import ThreeCheckBox from "../Field/ThreeCheckBox";

const FormularioCursos = [
    {
        Component: AsyncSelect,
        controller: {
            name: "user__ciudad_nac__state_id__country_id",
        },
        field: {
            label: "País de nacimiento",
            placeholder: "Seleccione un país",
        },
        url: "/api/ubicacion/paises",
    },
    {
        Component: AsyncSelect,
        controller: {
            name: "user__ciudad__state_id",
        },
        field: {
            label: "Departamento de residencia",
            placeholder: "Seleccione un departamento",
        },
        url: "/api/ubicacion/estados/48",
    },
    {
        Component: AsyncSelect,
        controller: {
            name: "user__genero_id",
        },
        field: {
            label: "Género",
            placeholder: "Seleccione un género",
        },
        url: "/api/usuarios/general/generos",
    },
    {
        Component: AsyncSelect,
        controller: {
            name: "user__etnia",
        },
        field: {
            label: "Grupo poblacional",
            placeholder: "Seleccione un grupo poblacional",
        },
        url: "/api/usuarios/general/etnias",
    },
    {
        Component: AsyncSelect,
        controller: {
            name: "user__tipo_cliente",
        },
        field: {
            label: "De los siguientes roles en cuál se reconoce?",
            placeholder: "Seleccione un rol",
        },
        url: "/api/usuarios/general/tipo-cliente",
    },
    {
        Component: CustomSelect,
        controller: {
            name: "user__zona",
        },
        field: {
            options: [
                {
                    value: "all",
                    label: "Todas las zonas",
                },
                {
                    value: "rural",
                    label: "Rural",
                },
                {
                    value: "urbana",
                    label: "Urbana",
                },
            ],
            label: "Zona de residencia",
            placeholder: "Seleccione una zona",
        },
    },
    {
        Component: AsyncSelect,
        controller: {
            name: "user__conectividad",
        },
        field: {
            label: "Conectividad",
            placeholder: "Seleccione una opción",
        },
        url: "/api/usuarios/general/conectividad",
    },
    {
        Component: CustomSelect,
        controller: {
            name: "activity__module_id",
            defaultValue: "",
        },
        field: {
            options: [
                {
                    value: "all",
                    label: "Todos los módulos",
                },
                {
                    value: 2,
                    label: "Módulo 1 - Derecho Fundamental a la Consulta Previa",
                },
                {
                    value: 7,
                    label: "Módulo 2 - Derecho Fundamental a la Consulta Previa",
                },
                {
                    value: 11,
                    label: "Módulo 3 - Derecho Fundamental a la Consulta Previa",
                },
                {
                    value: 12,
                    label: "Módulo 4 - Derecho Fundamental a la Consulta Previa",
                },
            ],
            label: "Modulo",
            placeholder: "Seleccione una opción",
        },
    },
    {
        Component: ThreeCheckBox,
        controller: {
            name: "modulo_completado",
            defaultValue: false,
        },
        field: {
            label: "Modulo completado",
            content: "¿El modulo ha sido completado?",
        },
    },
];

export default FormularioCursos;
