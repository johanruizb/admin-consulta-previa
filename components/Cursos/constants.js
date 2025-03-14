import AsyncSelect from "@/components/Field/AsyncSelect";
import CustomCheckbox from "../Field/CheckBox";
// import RangeSlider from "../Field/RangeSlider";
import CustomSelect from "../Field/Select";
import ThreeCheckBox from "../Field/ThreeCheckBox";
import CustomAsyncSelect from "../Form/CustomAsyncSelect";

const FormularioCursos = [
    {
        Component: CustomSelect,
        controller: {
            name: "activity__module__course_id",
            defaultValue: 1,
        },
        field: {
            label: "Curso",
            placeholder: "Seleccione un curso",
            sx: {
                borderColor: "var(--joy-palette-primary-500) !important",
            },
            options: [
                {
                    value: 1,
                    label: "Curso virtual de autoformación en Consulta Previa - Grupos étnicos (20h)",
                },
                {
                    value: 2,
                    label: "Curso virtual de autoformación en consulta previa para fortalecimiento de capacidades institucionales (20h)",
                },
                {
                    value: 3,
                    label: "Diplomado - Grupos Étnicos",
                },
                {
                    value: 4,
                    label: "Diplomado - Funcionarios y/o Contratistas",
                },
            ],
        },
        size: {
            xs: 12,
            md: 6,
        },
    },
    {
        Component: CustomAsyncSelect,
        controller: {
            name: "activity__module_id",
        },
        field: {
            label: "Modulo",
            placeholder: "Seleccione una opción",
            sx: {
                borderColor: "var(--joy-palette-primary-500) !important",
            },
        },
        url: "/api/moodle/curso/$1/modulos",
        dependencies: ["activity__module__course_id"],
    },
    // {
    //     Component: RangeSlider,
    //     gridless: true,
    //     controller: {
    //         name: "porcentaje_avance",
    //     },
    // },
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
        Component: CustomCheckbox,
        controller: {
            name: "personas_sin_actividad",
            defaultValue: false,
        },
        field: {
            label: "Mostrar personas sin actividad",
            content: "Personas sin registro de actividad",
        },
    },
];

const FormularioGrupos = {
    3: [
        {
            Component: CustomSelect,
            controller: {
                name: "grupo_usuario",
            },
            field: {
                options: [
                    {
                        value: "all",
                        label: "Todos los grupos",
                    },
                    {
                        value: 1,
                        label: "Grupo C1",
                    },
                    {
                        value: 2,
                        label: "Grupo C2",
                    },
                    {
                        value: 3,
                        label: "Grupo C3",
                    },
                    {
                        value: 4,
                        label: "Grupo C4",
                    },
                    {
                        value: 5,
                        label: "Grupo C5",
                    },
                    {
                        value: 6,
                        label: "Grupo C6",
                    },
                ],
                label: "Grupo",
                placeholder: "Seleccione un grupo",
            },
        },
    ],
    4: [
        {
            Component: CustomSelect,
            controller: {
                name: "grupo_usuario",
            },
            field: {
                options: [
                    {
                        value: "all",
                        label: "Todos los grupos",
                    },
                    {
                        value: 7,
                        label: "Grupo F1",
                    },
                    {
                        value: 8,
                        label: "Grupo F2",
                    },
                    {
                        value: 9,
                        label: "Grupo F3",
                    },
                    {
                        value: 10,
                        label: "Grupo F4",
                    },
                    {
                        value: 11,
                        label: "Grupo F5",
                    },
                    {
                        value: 12,
                        label: "Grupo F6",
                    },
                ],
                label: "Grupo",
                placeholder: "Seleccione un grupo",
            },
        },
    ],
};

const FiltroCursos = [
    FormularioCursos.slice(0, 3),
    FormularioCursos.slice(3, FormularioCursos.length),
];

export default FormularioCursos;
export { FiltroCursos, FormularioGrupos };
