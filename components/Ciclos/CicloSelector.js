import { useCiclo } from "@/contexts/CicloContext";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Option from "@mui/joy/Option";
import Select from "@mui/joy/Select";
import { useEffect } from "react";

export default function CicloSelector({
    value,
    onChange,
    label = "Ciclo académico",
    placeholder = "Seleccione un ciclo",
    size = "sm",
    required = false,
    disabled = false,
}) {
    // Usar el contexto de ciclos
    const { ciclos, selectedCicloId, setCiclo, isLoading, error } = useCiclo();

    // Sincronizar con prop onChange cuando cambia el ciclo en el contexto
    useEffect(() => {
        if (selectedCicloId && onChange) {
            onChange(selectedCicloId);
        }
    }, [selectedCicloId, onChange]);

    // Usar value prop si se proporciona, sino usar el del contexto
    // Asegurar que siempre sea un valor definido para evitar controlled/uncontrolled warning
    const currentValue = value !== undefined ? value : selectedCicloId || "";

    const handleChange = (event, newValue) => {
        setCiclo(newValue);
        onChange?.(newValue);
    };

    if (isLoading) {
        return (
            <FormControl size={size} disabled>
                <FormLabel>{label}</FormLabel>
                <Select placeholder="Cargando ciclos..." size={size} disabled />
            </FormControl>
        );
    }

    if (error) {
        return (
            <FormControl size={size} disabled>
                <FormLabel>{label}</FormLabel>
                <Select
                    placeholder="Error al cargar ciclos"
                    size={size}
                    disabled
                    value=""
                />
            </FormControl>
        );
    }

    return (
        <FormControl size={size} required={required}>
            <FormLabel>{label}</FormLabel>
            <Select
                placeholder={placeholder}
                value={currentValue}
                onChange={handleChange}
                size={size}
                disabled={disabled || isLoading}
                slotProps={{
                    button: {
                        sx: { whiteSpace: "nowrap" },
                    },
                }}
            >
                {ciclos.map((ciclo) => (
                    <Option key={ciclo.id} value={ciclo.id}>
                        {ciclo.name}
                    </Option>
                ))}
            </Select>
        </FormControl>
    );
}
