import AsyncSelect from "../Field/AsyncSelect";
import DateField from "../Field/DateField";
import FileField from "../Field/FileField";
import PhoneField from "../Field/PhoneField";
import Select from "../Field/Select";
import TextField from "../Field/TextField";
import CustomAsyncSelect from "./CustomAsyncSelect";
import EmptyField from "./EmptyField";
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
            onChange: (e, onChangeController) =>
                onChangeController((e.target.value || "").toUpperCase()),
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
            onChange: (e, onChangeController) =>
                onChangeController((e.target.value || "").toUpperCase()),
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
                    label: "(TI) Tarjeta de identidad",
                },
                {
                    value: 3,
                    label: "(CE) Cédula de extranjería",
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
            },
        },
        field: {
            label: "Número de documento",
            required: true,
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
        Component: DateField,
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
            onChange: (e, onChangeController) =>
                onChangeController((e.target.value || "").toUpperCase()),
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
        Component: TextField,
        controller: {
            name: "entityName",
            defaultValue: "",
        },
        field: {
            label: "Nombre de la entidad u organización que representa",
            onChange: (e, onChangeController) =>
                onChangeController((e.target.value || "").toUpperCase()),
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
                    label: "Contratista del Estado",
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
        Component: PhoneField,
        controller: {
            name: "whatsapp",
            defaultValue: "",
        },
        field: {
            label: "Número de WhatsApp",
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
    {
        Component: TextField,
        controller: {
            name: "direccion",
            defaultValue: "",
            rules: {
                required: {
                    value: true,
                    message: "Este campo no puede estar vacio",
                },
            },
        },
        field: {
            label: "Dirección de residencia",
            required: true,
        },
    },
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
            name: "estrato",
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
                    label: "Estrato 1",
                },
                {
                    value: 2,
                    label: "Estrato 2",
                },
                {
                    value: 3,
                    label: "Estrato 3",
                },
                {
                    value: 4,
                    label: "Estrato 4",
                },
                {
                    value: 5,
                    label: "Estrato 5",
                },
                {
                    value: 6,
                    label: "Estrato 6",
                },
            ],
            label: "Estrato",
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
                    label: "NULA",
                },
                {
                    value: "baja",
                    label: "BAJA",
                },
                {
                    value: "media",
                    label: "MEDIA",
                },
                {
                    value: "plena",
                    label: "PLENA",
                },
            ],
            label: "Conectividad",
            required: true,
        },
    },
];

export default FormularioVerificacion;
