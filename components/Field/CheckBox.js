import Close from "@mui/icons-material/Close";
import HelpIcon from "@mui/icons-material/Help";
import Checkbox from "@mui/joy/Checkbox";
import Stack from "@mui/joy/Stack";
import Tooltip from "@mui/joy/Tooltip";

import FormControl from "@mui/joy/FormControl";
import FormHelperText from "@mui/joy/FormHelperText";
import FormLabel from "@mui/joy/FormLabel";

import { Controller, useFormContext } from "react-hook-form";

export default function CustomCheckbox({ inputProps }) {
    const { control } = useFormContext();

    const {
        controller: controllerProps,
        field: { InputProps, tooltip, ...fieldProps },
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
                        <Stack direction="row" alignItems="center" spacing={1}>
                            <Checkbox
                                uncheckedIcon={<Close />}
                                label={fieldProps.content}
                                onChange={(e) => field.onChange(e.target.checked)}
                                checked={field.value ?? false}
                                sx={{
                                    alignItems: "center",
                                    height: "36px",
                                }}
                            />
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
                        <FormHelperText>{error?.message ?? " "}</FormHelperText>
                    </FormControl>
                );
            }}
            {...controllerProps}
        />
    );
}
