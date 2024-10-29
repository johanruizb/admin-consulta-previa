import AsyncSelect from "../Field/AsyncSelect";
import BirthdayField from "../Field/BirthdayField";
import FileField from "../Field/FileField";
import PhoneField from "../Field/PhoneField";
import Select from "../Field/Select";
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
        Component: Select,
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
            name: "foto_doc1",
        },
        field: {
            label: "Foto del frente del documento",
        },
    },
    {
        Component: FileField,
        controller: {
            name: "foto_doc2",
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
        Component: Select,
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
                    label: "Femenino",
                },
                {
                    value: 2,
                    label: "Masculino",
                },
                {
                    value: 3,
                    label: "Transgénero",
                },
                {
                    value: 4,
                    label: "No binario",
                },
                {
                    value: 5,
                    label: "Prefiero no decirlo",
                },
                {
                    value: 0,
                    label: "Otro (especifique)",
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
        Component: Select,
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
        Component: Select,
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
                    value: 9,
                    label: "Educación",
                },
            ],
            label: "De los siguientes roles en cual se reconoce",
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
                minLength: {
                    value: 3,
                    message: "El nombre no puede tener menos de 3 caracteres",
                },
                required: {
                    value: true,
                    message: "Este campo no puede estar vacio",
                },
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
    // {
    //     Component: PhoneField,
    //     controller: {
    //         name: "whatsapp",
    //         defaultValue: "",
    //     },
    //     field: {
    //         label: "Número de WhatsApp",
    //     },
    // },
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
    //         name: "direccion",
    //         defaultValue: "",
    //         rules: {
    //             required: {
    //                 value: true,
    //                 message: "Este campo no puede estar vacio",
    //             },
    //         },
    //     },
    //     field: {
    //         label: "Dirección de residencia",
    //         required: true,
    //     },
    // },
    {
        Component: TextField,
        controller: {
            name: "barrio",
            defaultValue: "",
            rules: {
                required: {
                    value: true,
                    message: "Este campo no puede estar vacio",
                },
            },
        },
        field: {
            label: "Barrio de residencia",
            required: true,
        },
    },
    {
        Component: Select,
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
        Component: Select,
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
                {
                    value: "nula",
                    label: "Sin conexión",
                },
                {
                    value: "baja",
                    label: "Solo con wifi público",
                },
                {
                    value: "media",
                    label: "Por intervalos de tiempo con dificultad",
                },
                {
                    value: "plena",
                    label: "Todo el día sin dificultad",
                },
                {
                    value: "otra",
                    label: "Otra (especificar)",
                },
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
        Component: Select,
        controller: {
            name: "curso_inscrito",
            defaultValue: "",
        },
        field: {
            label: "Curso inscrito",
            options: [
                {
                    value: 1,
                    label: "Curso virtual de autoformación en Consulta Previa - Grupos étnicos (20 horas)",
                },
                {
                    value: 2,
                    label: "Curso virtual de autoformación en consulta previa para fortalecimiento de capacidades institucionales (20 horas)",
                },
            ],
        },
    },
    {
        Component: TextField,
        controller: {
            name: "continuar_curso_120",
            defaultValue: "",
        },
        field: {
            label: "Le interesa seguir fortaleciendo sus conocimiento y competencias sobre Consulta Previa a través de un diplomado virtual gratuito de 120 horas certificado por la Universidad del Valle.",
            onChange: (e) => {},
            readOnly: true,
        },
        size: 12,
    },
];

export default FormularioVerificacion;
