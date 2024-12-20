import Option from "@mui/joy/Option";
import Select from "@mui/joy/Select";
import FormControl from "@mui/joy/FormControl";
import FormHelperText from "@mui/joy/FormHelperText";
import FormLabel from "@mui/joy/FormLabel";

import { Controller, useFormContext } from "react-hook-form";

export default function MultiSelect({ inputProps }) {
    const { control } = useFormContext();

    const {
        controller: controllerProps,
        field: { label: formLabel, InputProps, options, ...fieldProps },
    } = inputProps;

    return (
        <Controller
            control={control}
            render={({ field, fieldState: { error } }) => {
                const { onChange: onChangeController } = field;

                console.log(field.value);

                return (
                    <FormControl
                        error={Boolean(error?.type || error?.types)}
                        required={controllerProps.rules?.required?.value}
                    >
                        <FormLabel>{formLabel}</FormLabel>
                        <Select
                            {...field}
                            value={field.value ?? []}
                            onChange={(e, newValue) => {
                                onChangeController(newValue);
                            }}
                            {...fieldProps}
                            slotProps={{
                                button: {
                                    disabled: fieldProps.readOnly,
                                },
                            }}
                            multiple
                        >
                            {options.map((option) => (
                                <Option key={option.value} value={option.value}>
                                    {option.label}
                                </Option>
                            ))}
                        </Select>
                        <FormHelperText>{error?.message ?? " "}</FormHelperText>
                    </FormControl>
                );
            }}
            {...controllerProps}
        />
    );
}
