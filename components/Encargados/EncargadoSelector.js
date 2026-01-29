"use client";

import { memo, useCallback, useState } from "react";
import Autocomplete from "@mui/joy/Autocomplete";
import AutocompleteOption from "@mui/joy/AutocompleteOption";
import CircularProgress from "@mui/joy/CircularProgress";
import ListItemContent from "@mui/joy/ListItemContent";
import ListItemDecorator from "@mui/joy/ListItemDecorator";
import Typography from "@mui/joy/Typography";
import PersonIcon from "@mui/icons-material/Person";
import { useUsuariosAsignables } from "@/hooks/useEncargados";

/**
 * Selector de usuarios para asignar como encargados.
 * Autocomplete con búsqueda en backend.
 */
const EncargadoSelector = memo(function EncargadoSelector({
    value = null,
    onChange,
    placeholder = "Buscar usuario...",
    disabled = false,
    size = "sm",
}) {
    const [inputValue, setInputValue] = useState("");
    const { usuarios, isLoading } = useUsuariosAsignables(inputValue);

    const handleInputChange = useCallback((_, newInputValue) => {
        setInputValue(newInputValue);
    }, []);

    const handleChange = useCallback(
        (_, newValue) => {
            onChange?.(newValue);
        },
        [onChange]
    );

    return (
        <Autocomplete
            size={size}
            placeholder={placeholder}
            value={value}
            onChange={handleChange}
            inputValue={inputValue}
            onInputChange={handleInputChange}
            options={usuarios}
            getOptionLabel={(option) => option?.full_name || option?.username || ""}
            isOptionEqualToValue={(option, val) => option?.id === val?.id}
            loading={isLoading}
            disabled={disabled}
            slotProps={{
                input: {
                    autoComplete: "off",
                },
            }}
            endDecorator={
                isLoading ? <CircularProgress size="sm" sx={{ mr: 1 }} /> : null
            }
            renderOption={(props, option) => (
                <AutocompleteOption {...props} key={option.id}>
                    <ListItemDecorator>
                        <PersonIcon />
                    </ListItemDecorator>
                    <ListItemContent>
                        <Typography level="body-sm">
                            {option.full_name || option.username}
                        </Typography>
                        {option.full_name && (
                            <Typography level="body-xs" textColor="text.tertiary">
                                @{option.username}
                            </Typography>
                        )}
                    </ListItemContent>
                </AutocompleteOption>
            )}
            noOptionsText="No se encontraron usuarios"
            loadingText="Buscando..."
        />
    );
});

export default EncargadoSelector;
