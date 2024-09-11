import { Option, Select as JoySelect } from "@mui/joy";
import FormControl from "@mui/joy/FormControl";
import FormHelperText from "@mui/joy/FormHelperText";
import FormLabel from "@mui/joy/FormLabel";

import { Controller, useFormContext } from "react-hook-form";

export default function Select({ inputProps }) {
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
                        <JoySelect
                            {...field}
                            onChange={(e, newValue) => {
                                onChangeField?.(newValue, onChangeController) ||
                                    onChangeController(newValue);
                            }}
                        >
                            {fieldProps.options.map((option) => (
                                <Option key={option.value} value={option.value}>
                                    {option.label}
                                </Option>
                            ))}
                        </JoySelect>
                        <FormHelperText>{error?.message ?? " "}</FormHelperText>
                    </FormControl>
                );
            }}
            {...controllerProps}
        />
    );
}
