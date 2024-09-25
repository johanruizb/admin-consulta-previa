import FormControl from "@mui/joy/FormControl";
import FormHelperText from "@mui/joy/FormHelperText";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import { Controller, useFormContext } from "react-hook-form";

export default function TextField({ inputProps }) {
    const { control } = useFormContext();

    const {
        controller: controllerProps,
        field: {
            InputProps,
            onChange: onChangeField,
            label: fieldLabel,
            ...fieldProps
        },
    } = inputProps;

    return (
        <Controller
            control={control}
            render={({ field, fieldState }) => {
                const { error } = fieldState;
                const { onChange: onChangeController } = field;

                return (
                    <FormControl
                        error={Boolean(error?.type || error?.types)}
                        required={controllerProps.rules?.required?.value}
                    >
                        <FormLabel>{fieldLabel}</FormLabel>
                        <Input
                            {...field}
                            value={field.value ?? ""}
                            onChange={(e) => {
                                onChangeField?.(e, onChangeController) ||
                                    onChangeController(e);
                            }}
                            {...fieldProps}
                        />
                        <FormHelperText>{error?.message ?? " "}</FormHelperText>
                    </FormControl>
                );
            }}
            {...controllerProps}
        />
    );
}
