import HelpIcon from "@mui/icons-material/Help";
import Option from "@mui/joy/Option";
import Select from "@mui/joy/Select";
import Stack from "@mui/joy/Stack";
import Tooltip from "@mui/joy/Tooltip";
import FormControl from "@mui/joy/FormControl";
import FormHelperText from "@mui/joy/FormHelperText";
import FormLabel from "@mui/joy/FormLabel";

import { Controller, useFormContext } from "react-hook-form";

export default function CustomSelect({ inputProps }) {
    const { control } = useFormContext();

    const {
        controller: controllerProps,
        field: {
            label: formLabel,
            InputProps,
            onChange: onChangeField,
            options,
            tooltip,
            ...fieldProps
        },
    } = inputProps;

    return (
        <Controller
            control={control}
            render={({ field, fieldState: { error } }) => {
                const { onChange: onChangeController } = field;

                return (
                    <FormControl
                        error={Boolean(error?.type || error?.types)}
                        required={controllerProps.rules?.required?.value}
                    >
                        <FormLabel>{formLabel}</FormLabel>
                        <Stack direction="row" alignItems="center" spacing={0.5}>
                            {tooltip && (
                                <Tooltip
                                    title={tooltip}
                                    leaveDelay={1000}
                                    arrow
                                >
                                    <HelpIcon
                                        fontSize="small"
                                        sx={{ color: "text.tertiary", cursor: "help" }}
                                    />
                                </Tooltip>
                            )}
                        </Stack>
                        <Select
                            {...field}
                            onChange={(e, newValue) => {
                                onChangeField?.(newValue, onChangeController) ||
                                    onChangeController(newValue);
                            }}
                            {...fieldProps}
                            slotProps={{
                                button: {
                                    disabled: fieldProps.readOnly,
                                },
                            }}
                        >
                            {options.map((option) => (
                                <Option key={option.value} value={option.value}>
                                    {option.label}
                                </Option>
                            ))}
                            {options?.length === 0 && (
                                <Option disabled value="">
                                    No hay opciones disponibles
                                </Option>
                            )}
                        </Select>
                        {error?.message && (
                            <FormHelperText>
                                {error?.message ?? " "}
                            </FormHelperText>
                        )}
                    </FormControl>
                );
            }}
            {...controllerProps}
        />
    );
}
