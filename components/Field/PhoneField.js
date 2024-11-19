import FormControl from "@mui/joy/FormControl";
import FormHelperText from "@mui/joy/FormHelperText";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import { Controller, useFormContext } from "react-hook-form";

import { forwardRef } from "react";
import { IMaskInput } from "react-imask";

const PhoneMask = forwardRef(function PhoneMask(props, ref) {
    const { onChange, ...other } = props;
    return (
        <IMaskInput
            {...other}
            // mask={`+${COLOMBIA.phonecode} #00 000 0000`}
            mask={`#00 000 0000`}
            definitions={{
                "#": /[1-9]/,
            }}
            inputRef={ref}
            onAccept={(value) =>
                onChange({ target: { name: props.name, value } })
            }
            overwrite
        />
    );
});

export default function PhoneField({ inputProps }) {
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
                            slotProps={{
                                input: {
                                    component: PhoneMask,
                                },
                            }}
                            readOnly={fieldProps.readOnly}
                        />
                        <FormHelperText>{error?.message ?? " "}</FormHelperText>
                    </FormControl>
                );
            }}
            {...controllerProps}
        />
    );
}
