import AsyncSelect from "../Field/AsyncSelect";
import BirthdayField from "../Field/BirthdayField";
import FileField from "../Field/FileField";
import MultiSelect from "../Field/MultiSelect";
import PhoneField from "../Field/PhoneField";
import CustomSelect from "../Field/Select";
import TextField from "../Field/TextField";
import CustomAsyncSelect from "./CustomAsyncSelect";
import EmptyField from "./EmptyField";
import { replaceAllSpaces, toUpperCase } from "./functions";
import OtraConectividad from "./OtraConectividad";
import OtroGenero from "./OtroGenero";

const FormularioVerificacion = [
    {
        Component: TextField,
        controller: {
            name: "nombres",
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
            onChange: toUpperCase,
        },
    },
    {
        Component: TextField,
        controller: {
            name: "apellidos",
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
            label: "Apellidos",
            onChange: toUpperCase,
        },
    },
    {
        Component: CustomSelect,
        controller: {
            name: "tipo_doc",
            defaultValue: "",
            rules: {
                required: {
                    value: true,
                    message: "Este campo no puede estar vacio",
                },
            },
        },
        field: {
            options: [
                {
                    value: 1,
                    label: "(CC) Cédula de ciudadanía",
                },
                {
                    value: 2,
                    label: "(CE) Cédula de extranjería",
                },
                {
                    value: 3,
                    label: "(PA) Pasaporte",
                },
                {
                    value: 4,
                    label: "(PR) Permiso de residencia",
                },
                {
                    value: 5,
                    label: "(TI) Tarjeta de identidad",
                },
            ],
            label: "Tipo de documento de identidad",
            required: true,
        },
    },
    {
        Component: TextField,
        controller: {
            name: "num_doc",
            defaultValue: "",
            rules: {
                required: {
                    value: true,
                    message: "Este campo no puede estar vacio",
                },
                pattern: {
                    value: /^[^.,\s]+$/,
                    message:
                        "El número de documento no puede tener espacios, puntos o comas",
                },
            },
        },
        field: {
            label: "Número de documento",
            required: true,
            onBlur: replaceAllSpaces,
        },
    },
    {
        Component: AsyncSelect,
        controller: {
            name: "pais_exp",
            rules: {
                required: {
                    value: true,
                    message: "Este campo no puede estar vacio",
                },
            },
        },
        field: {
            label: "País de expedición",
            required: true,
        },
        url: "/api/ubicacion/paises",
    },
    {
        Component: EmptyField,
    },
    {
        Component: FileField,
        controller: {
            name: "foto_doc1_url",
        },
        field: {
            label: "Foto del frente del documento",
        },
    },
    {
        Component: FileField,
        controller: {
            name: "foto_doc2_url",
        },
        field: {
            label: "Foto del reverso del documento",
        },
    },
    {
        Component: BirthdayField,
        controller: {
            name: "fecha_nac",
            defaultValue: "",
            rules: {
                required: {
                    value: true,
                    message: "Este campo no puede estar vacio",
                },
            },
        },
        field: {
            label: "Fecha de nacimiento",
            required: true,
        },
    },
    {
        Component: AsyncSelect,
        controller: {
            name: "pais_nac",
            rules: {
                required: {
                    value: true,
                    message: "Este campo no puede estar vacio",
                },
            },
        },
        field: {
            label: "País de nacimiento",
            required: true,
        },
        url: "/api/ubicacion/paises",
    },
    {
        Component: CustomAsyncSelect,
        controller: {
            name: "estado_nac",
            rules: {
                required: {
                    value: true,
                    message: "Este campo no puede estar vacio",
                },
            },
        },
        field: {
            label: "Departamento de nacimiento",
            required: true,
        },
        dependencies: ["pais_nac"],
        url: "/api/ubicacion/estados/$1",
    },
    {
        Component: CustomAsyncSelect,
        controller: {
            name: "ciudad_nac",
            rules: {
                required: {
                    value: true,
                    message: "Este campo no puede estar vacio",
                },
            },
        },
        field: {
            label: "Ciudad de nacimiento",
            required: true,
        },
        dependencies: ["estado_nac"],
        url: "/api/ubicacion/ciudades/$1",
    },
    {
        Component: CustomSelect,
        controller: {
            name: "genero",
            defaultValue: "",
            rules: {
                required: {
                    value: true,
                    message: "Este campo no puede estar vacio",
                },
            },
        },
        field: {
            options: [
                {
                    value: 1,
                    label: "Mujer",
                },
                {
                    value: 2,
                    label: "Hombre",
                },
                {
                    value: 6,
                    label: "Mujer transg\u00e9nero",
                },
                {
                    value: 7,
                    label: "Hombre transg\u00e9nero",
                },
                {
                    value: 4,
                    label: "Persona no binaria",
                },
                {
                    value: 8,
                    label: "Persona g\u00e9nero fluido",
                },
                {
                    value: 9,
                    label: "Ninguno",
                },
                {
                    value: 5,
                    label: "Prefiero no responder",
                },
                {
                    value: 0,
                    label: "Otra",
                },
            ],
            label: "Género",
            required: true,
        },
    },
    {
        Component: OtroGenero,
        controller: {
            name: "genero_otro",
            defaultValue: "",
            rules: {
                required: {
                    value: true,
                    message: "Este campo no puede estar vacio",
                },
            },
        },
        field: {
            label: "Otro (especificar)",
            required: true,
            onChange: toUpperCase,
        },
    },
    {
        Component: CustomSelect,
        controller: {
            name: "etnia",
            defaultValue: "",
            rules: {
                required: {
                    value: true,
                    message: "Este campo no puede estar vacio",
                },
            },
        },
        field: {
            options: [
                {
                    value: 1,
                    label: "Indígena",
                },
                {
                    value: 2,
                    label: "Mestizo",
                },
                {
                    value: 3,
                    label: "Blanco",
                },
                { value: 4, label: "Rom" },
                {
                    value: 5,
                    label: "Raizal del Archipiélago de San Andrés y Providencia",
                },
                {
                    value: 6,
                    label: "Palenquero de San Basilio",
                },
                {
                    value: 7,
                    label: "Negro(a), afrocolombiano(a) o afrodescendiente",
                },
                {
                    value: 8,
                    label: "Mulato(a)",
                },
                {
                    value: 9,
                    label: "Ninguno de los anteriores",
                },
            ],
            label: "Etnia",
            required: true,
        },
    },
    {
        Component: CustomSelect,
        controller: {
            name: "tipo_cliente",
            defaultValue: "",
            rules: {
                required: {
                    value: true,
                    message: "Este campo no puede estar vacio",
                },
            },
        },
        field: {
            options: [
                {
                    value: 1,
                    label: "Comunidad Negro(a) afrocolombiano(a) o afrodescendiente",
                },
                {
                    value: 2,
                    label: "Comunidad Indígena",
                },
                {
                    value: 3,
                    label: "Ejecutores de procesos Consulta Previa",
                },
                {
                    value: 4,
                    label: "Institucionalidad interviniente en Consulta Previa",
                },
                {
                    value: 5,
                    label: "Contratista del Ministerio del Interior",
                },
                {
                    value: 6,
                    label: "Funcionarios Ministerio del Interior",
                },
                {
                    value: 7,
                    label: "Población civil",
                },
                {
                    value: 8,
                    label: "Empresario",
                },
                {
                    value: 17,
                    label: "Educación pública",
                },
                {
                    value: 18,
                    label: "Educación privada",
                },
                {
                    value: 10,
                    label: "Contratista/Funcionario de otros Ministerios",
                },
                {
                    value: 11,
                    label: "Alcaldías",
                },
                {
                    value: 12,
                    label: "Educadores o profesores",
                },
                {
                    value: 13,
                    label: "Estudiantes universitarios",
                },
                {
                    value: 14,
                    label: "Líder/lideresa comunitaria",
                },
                {
                    value: 15,
                    label: "Funcionarios/contratistas del Ministerio del Interior",
                },
                {
                    value: 16,
                    label: "Funcionarios/contratistas de otra entidad pública ",
                },
            ],
            label: "De los siguientes roles en cuál se reconoce?",
            required: true,
        },
    },
    {
        Component: TextField,
        controller: {
            name: "entidad",
            defaultValue: "",
            rules: {
                maxLength: {
                    value: 300,
                    message: "El nombre no puede tener más de 300 caracteres",
                },
                // minLength: {
                //     value: 3,
                //     message: "El nombre no puede tener menos de 3 caracteres",
                // },
                // required: {
                //     value: true,
                //     message: "Este campo no puede estar vacio",
                // },
            },
        },
        field: {
            label: "Nombre de la entidad u organización que representa",
            required: true,
            onChange: toUpperCase,
        },
    },
    {
        Component: PhoneField,
        controller: {
            name: "telefono1",
            defaultValue: "",
            rules: {
                required: {
                    value: true,
                    message: "Este campo no puede estar vacio",
                },
            },
        },
        field: {
            label: "Número de teléfono",
            required: true,
        },
    },
    {
        Component: TextField,
        controller: {
            name: "correo_electronico",
            defaultValue: "",
            rules: {
                required: {
                    value: true,
                    message: "Este campo no puede estar vacio",
                },
                pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/,
                    message: "Por favor verifica el correo",
                },
            },
        },
        field: {
            label: "Correo electrónico",
            required: true,
            onBlur: replaceAllSpaces,
        },
    },
    {
        Component: AsyncSelect,
        controller: {
            name: "estado_res",
            defaultValue: "",
            rules: {
                required: {
                    value: true,
                    message: "Este campo no puede estar vacio",
                },
            },
        },
        field: {
            label: "Departamento de residencia",
            required: true,
        },
        url: "/api/ubicacion/estados/48",
    },
    {
        Component: CustomAsyncSelect,
        controller: {
            name: "ciudad",
            defaultValue: "",
            rules: {
                required: {
                    value: true,
                    message: "Este campo no puede estar vacio",
                },
            },
        },
        field: {
            label: "Ciudad de residencia",
            required: true,
        },
        dependencies: ["estado_res"],
        url: "/api/ubicacion/ciudades/$1",
    },
    // {
    //     Component: TextField,
    //     controller: {
    //         name: "barrio",
    //         defaultValue: "",
    //     },
    //     field: {
    //         label: "Barrio de residencia",
    //         required: true,
    //     },
    // },
    {
        Component: CustomSelect,
        controller: {
            name: "zona",
            defaultValue: "",
            rules: {
                required: {
                    value: true,
                    message: "Este campo no puede estar vacio",
                },
            },
        },
        field: {
            options: [
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
            required: true,
        },
    },
    {
        Component: CustomSelect,
        controller: {
            name: "conectividad",
            defaultValue: "",
            rules: {
                required: {
                    value: true,
                    message: "Este campo no puede estar vacio",
                },
            },
        },
        field: {
            options: [
                { value: "nula", label: "No cuento con acceso a internet" },
                {
                    value: "baja",
                    label: "Accedo a internet mediante puntos públicos o compartidos",
                },
                {
                    value: "media",
                    label: "Por intervalos de tiempo con dificultad",
                },
                { value: "plena", label: "Todo el día sin dificultad" },
                { value: "hogar", label: "Tengo internet privado en el hogar" },
                {
                    value: "movil",
                    label: "Uso internet móvil a través del plan de datos del celular",
                },
                { value: "otra", label: "Otra (especificar)" },
            ],
            label: "Conectividad",
            required: true,
        },
    },
    {
        Component: OtraConectividad,
        controller: {
            name: "otra_conectividad",
            defaultValue: "",
            rules: {
                required: {
                    value: true,
                    message: "Este campo no puede estar vacio",
                },
            },
        },
        field: {
            label: "Otra conectividad (especificar)",
            required: true,
            onChange: toUpperCase,
        },
    },
    {
        Component: CustomSelect,
        controller: {
            name: "nivel_educativo",
            rules: {
                required: {
                    value: true,
                    message: "Este campo no puede estar vacio",
                },
            },
        },
        field: {
            label: "Nivel educativo",
            required: true,
            options: [
                {
                    value: 2,
                    label: "Ninguno / Sin escolaridad",
                },
                {
                    value: 3,
                    label: "Preescolar",
                },
                {
                    value: 4,
                    label: "Primaria incompleta",
                },
                {
                    value: 5,
                    label: "Primaria completa",
                },
                {
                    value: 6,
                    label: "Secundaria incompleta",
                },
                {
                    value: 7,
                    label: "Secundaria completa (Bachiller)",
                },
                {
                    value: 8,
                    label: "T\u00e9cnico profesional",
                },
                {
                    value: 9,
                    label: "Tecn\u00f3logo",
                },
                {
                    value: 10,
                    label: "Profesional universitario",
                },
                {
                    value: 11,
                    label: "Especializaci\u00f3n",
                },
                {
                    value: 12,
                    label: "Maestr\u00eda",
                },
                {
                    value: 13,
                    label: "Doctorado",
                },
            ],
        },
    },
    {
        Component: AsyncSelect,
        controller: {
            name: "cursos_inscritos",
            defaultValue: [],
        },
        field: {
            label: "Curso inscrito",
            multiple: true,
        },
        url: "/api/usuarios/cursos/disponibles",
        useVersion: true,
    },
    {
        Component: AsyncSelect,
        controller: {
            name: "etiquetas",
        },
        field: {
            label: "Etiquetas",
            multiple: true,
        },
        url: "/api/usuarios/etiquetas",
    },
    // {
    //     Component: TextField,
    //     controller: {
    //         name: "continuar_curso_120",
    //         defaultValue: "",
    //     },
    //     field: {
    //         label: "Le interesa seguir fortaleciendo sus conocimiento y competencias sobre Consulta Previa a través de un diplomado virtual gratuito de 120 horas certificado por la Universidad del Valle.",
    //         onChange: (e) => {},
    //         readOnly: true,
    //     },
    //     size: 12,
    // },
];

const DOCUMENTOS = {
    1: "(CC) Cédula de ciudadanía",
    2: "(CE) Cédula de extranjería",
    3: "(PA) Pasaporte",
    4: "(PR) Permiso de residencia",
    5: "(TI) Tarjeta de identidad",
};

export default FormularioVerificacion;
export { DOCUMENTOS };
