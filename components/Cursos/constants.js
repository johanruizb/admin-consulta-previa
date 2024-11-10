import AsyncSelect from "@/components/Field/AsyncSelect";
import CustomSelect from "../Field/Select";
import CustomCheckbox from "../Field/CheckBox";

const FormularioCursos = [
    // {
    //     Component: AsyncSelect,
    //     controller: {
    //         name: "pais_nac",
    //         defaultValue: "",
    //     },
    //     field: {
    //         label: "País de nacimiento",
    //         placeholder: "Seleccione un país",
    //     },
    //     url: "/api/ubicacion/paises",
    // },
    // {
    //     Component: AsyncSelect,
    //     controller: {
    //         name: "estado_res",
    //     },
    //     field: {
    //         label: "Departamento de residencia",
    //         placeholder: "Seleccione un departamento",
    //     },
    //     url: "/api/ubicacion/estados/48",
    // },
    // {
    //     Component: CustomSelect,
    //     controller: {
    //         name: "genero",
    //         defaultValue: "",
    //     },
    //     field: {
    //         options: [
    //             {
    //                 value: 1,
    //                 label: "Femenino",
    //             },
    //             {
    //                 value: 2,
    //                 label: "Masculino",
    //             },
    //             {
    //                 value: 3,
    //                 label: "Transgénero",
    //             },
    //             {
    //                 value: 4,
    //                 label: "No binario",
    //             },
    //             {
    //                 value: 5,
    //                 label: "Prefiero no decirlo",
    //             },
    //             {
    //                 value: 0,
    //                 label: "Otro (especifique)",
    //             },
    //         ],
    //         label: "Género",
    //         placeholder: "Seleccione un género",
    //     },
    // },
    // {
    //     Component: CustomSelect,
    //     controller: {
    //         name: "etnia",
    //         defaultValue: "",
    //     },
    //     field: {
    //         options: [
    //             {
    //                 value: 1,
    //                 label: "Indígena",
    //             },
    //             {
    //                 value: 2,
    //                 label: "Mestizo",
    //             },
    //             {
    //                 value: 3,
    //                 label: "Blanco",
    //             },
    //             { value: 4, label: "Rom" },
    //             {
    //                 value: 5,
    //                 label: "Raizal del Archipiélago de San Andrés y Providencia",
    //             },
    //             {
    //                 value: 6,
    //                 label: "Palenquero de San Basilio",
    //             },
    //             {
    //                 value: 7,
    //                 label: "Negro(a), afrocolombiano(a) o afrodescendiente",
    //             },
    //             {
    //                 value: 8,
    //                 label: "Mulato(a)",
    //             },
    //             {
    //                 value: 9,
    //                 label: "Ninguno de los anteriores",
    //             },
    //         ],
    //         label: "Grupo poblacional",
    //         placeholder: "Seleccione un grupo poblacional",
    //     },
    // },
    // {
    //     Component: CustomSelect,
    //     controller: {
    //         name: "tipo_cliente",
    //         defaultValue: "",
    //     },
    //     field: {
    //         options: [
    //             {
    //                 value: 1,
    //                 label: "Comunidad Negro(a) afrocolombiano(a) o afrodescendiente",
    //             },
    //             {
    //                 value: 2,
    //                 label: "Comunidad Indígena",
    //             },
    //             {
    //                 value: 3,
    //                 label: "Ejecutores de procesos Consulta Previa",
    //             },
    //             {
    //                 value: 4,
    //                 label: "Institucionalidad interviniente en Consulta Previa",
    //             },
    //             {
    //                 value: 5,
    //                 label: "Contratista del Ministerio del Interior",
    //             },
    //             {
    //                 value: 6,
    //                 label: "Funcionarios Ministerio del Interior",
    //             },
    //             {
    //                 value: 7,
    //                 label: "Población civil",
    //             },
    //             {
    //                 value: 8,
    //                 label: "Empresario",
    //             },
    //             {
    //                 value: 9,
    //                 label: "Educación",
    //             },
    //         ],
    //         label: "De los siguientes roles en cuál se reconoce?",
    //         placeholder: "Seleccione un rol",
    //     },
    // },
    // {
    //     Component: CustomSelect,
    //     controller: {
    //         name: "zona",
    //         defaultValue: "",
    //     },
    //     field: {
    //         options: [
    //             {
    //                 value: "rural",
    //                 label: "Rural",
    //             },
    //             {
    //                 value: "urbana",
    //                 label: "Urbana",
    //             },
    //         ],
    //         label: "Zona de residencia",
    //         placeholder: "Seleccione una zona",
    //     },
    // },
    // {
    //     Component: CustomSelect,
    //     controller: {
    //         name: "conectividad",
    //         defaultValue: "",
    //     },
    //     field: {
    //         options: [
    //             {
    //                 value: "nula",
    //                 label: "Sin conexión",
    //             },
    //             {
    //                 value: "baja",
    //                 label: "Solo con wifi público",
    //             },
    //             {
    //                 value: "media",
    //                 label: "Por intervalos de tiempo con dificultad",
    //             },
    //             {
    //                 value: "plena",
    //                 label: "Todo el día sin dificultad",
    //             },
    //             {
    //                 value: "otra",
    //                 label: "Otra (especificar)",
    //             },
    //         ],
    //         label: "Conectividad",
    //         placeholder: "Seleccione una opción",
    //     },
    // },
    {
        Component: CustomSelect,
        controller: {
            name: "module",
            defaultValue: "",
        },
        field: {
            options: [
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
        Component: CustomCheckbox,
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
