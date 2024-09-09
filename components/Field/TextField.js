import { FormControl, FormHelperText, FormLabel, Input } from "@mui/joy";
import { Controller, useFormContext } from "react-hook-form";

export default function TextField({ inputProps }) {
    console.log("TextField » inputProps", inputProps);

    const { control } = useFormContext();

    const {
        controller: controllerProps,
        field: { InputProps, onChange: onChangeField, ...fieldProps },
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
                        <FormLabel>{fieldProps.label}</FormLabel>
                        <Input
                            {...field}
                            onChange={(e) => {
                                onChangeField?.(e, onChangeController) ||
                                    onChangeController(e);
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
