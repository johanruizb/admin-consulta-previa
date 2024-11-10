import Close from "@mui/icons-material/Close";
import Checkbox from "@mui/joy/Checkbox";

import FormControl from "@mui/joy/FormControl";
import FormHelperText from "@mui/joy/FormHelperText";
import FormLabel from "@mui/joy/FormLabel";

import { Controller, useFormContext } from "react-hook-form";

export default function CustomCheckbox({ inputProps }) {
    const { control } = useFormContext();

    const {
        controller: controllerProps,
        field: { InputProps, ...fieldProps },
    } = inputProps;

    return (
        <Controller
            control={control}
            render={({ field, fieldState }) => {
                const { error } = fieldState;

                return (
                    <FormControl
                        error={Boolean(error?.type || error?.types)}
                        required={controllerProps.rules?.required?.value}
                    >
                        <FormLabel
                            sx={{
                                visibility: fieldProps.label
                                    ? "visible"
                                    : "hidden",
                            }}
                        >
                            {fieldProps.label ??
                                `${controllerProps.name} sin etiqueta`}
                        </FormLabel>
                        <Checkbox
                            uncheckedIcon={<Close />}
                            label={fieldProps.content}
                            // {...field}
                            onChange={(e) => field.onChange(e.target.checked)}
                            checked={field.value ?? false}
                            sx={{
                                alignItems: "center",
                                height: "36px",
                            }}
                        />
                        <FormHelperText>{error?.message ?? " "}</FormHelperText>
                    </FormControl>
                );
            }}
            {...controllerProps}
        />
    );
}
