import AsyncSelect from "@/components/Field/AsyncSelect";
import CustomCheckbox from "../Field/CheckBox";
// import RangeSlider from "../Field/RangeSlider";
import CustomSelect from "../Field/Select";
import ThreeCheckBox from "../Field/ThreeCheckBox";
import CustomAsyncSelect from "../Form/CustomAsyncSelect";
import DynamicCursoSelect from "./DynamicCursoSelect";

const FormularioCursos = [
    {
        Component: DynamicCursoSelect,
        controller: {
            name: "activity__module__course_id",
            defaultValue: "",
        },
        field: {
            label: "Curso",
            placeholder: "Seleccione un curso",
            sx: {
                borderColor: "var(--joy-palette-primary-500) !important",
            },
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
            defaultValue: "all",
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
            tooltip: "Filtra personas según si completaron todos los módulos del curso",
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
            content: "Mostrar personas sin actividad",
            label: "Personas sin registro de actividad",
        },
    },
];

const FiltroCursos = [
    FormularioCursos.slice(0, 3),
    FormularioCursos.slice(3, FormularioCursos.length),
];

export default FormularioCursos;
export { FiltroCursos };
