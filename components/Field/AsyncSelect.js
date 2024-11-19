import ReportIcon from "@mui/icons-material/Report";

import CircularProgress from "@mui/joy/CircularProgress";
import FormControl from "@mui/joy/FormControl";
import FormHelperText from "@mui/joy/FormHelperText";
import FormLabel from "@mui/joy/FormLabel";
import Option from "@mui/joy/Option";
import { default as JoySelect } from "@mui/joy/Select";

import { Controller, useFormContext } from "react-hook-form";

import useSWRImmutable from "swr/immutable";

import { v4 } from "uuid";
import fetcher from "../fetcher";
import { getURL } from "../utils";

export default function SelectWrapper({ inputProps }) {
    const { url, ...otherProps } = inputProps;
    const { data, error, isLoading } = useSWRImmutable(getURL(url), fetcher);

    const {
        controller: controllerProps,
        field: { label: formLabel },
    } = inputProps;

    return isLoading || error ? (
        <FormControl
            error={Boolean(error)}
            required={controllerProps.rules?.required?.value}
        >
            <FormLabel>{formLabel}</FormLabel>
            <JoySelect
                endDecorator={
                    isLoading ? (
                        <CircularProgress size="sm" />
                    ) : (
                        error && <ReportIcon color="danger" />
                    )
                }
            />
            <FormHelperText>
                {error ? "No se han podido recuperar las opciones" : " "}
            </FormHelperText>
        </FormControl>
    ) : (
        <AsyncSelect
            inputProps={{
                ...otherProps,
                field: { ...otherProps.field, options: data },
            }}
        />
    );
}

function AsyncSelect({ inputProps }) {
    const { control } = useFormContext();

    const {
        controller: controllerProps,
        field: {
            label: formLabel,
            // options,
            ...fieldProps
        },
    } = inputProps;

    return (
        <Controller
            control={control}
            render={({ field, fieldState: { error } }) => {
                return (
                    <FormControl
                        error={Boolean(error?.type || error?.types)}
                        required={controllerProps.rules?.required?.value}
                    >
                        <FormLabel>{formLabel}</FormLabel>
                        <JoySelect
                            {...field}
                            value={
                                isNaN(parseInt(field.value))
                                    ? field.value
                                    : parseInt(field.value)
                            }
                            onChange={(e, value) => field.onChange(value)}
                            // {...fieldProps}
                            slotProps={{
                                button: {
                                    disabled: fieldProps.readOnly,
                                },
                            }}
                        >
                            {fieldProps?.options?.map((option) => (
                                <Option
                                    key={v4()}
                                    value={
                                        isNaN(parseInt(option.value))
                                            ? option.value
                                            : parseInt(option.value)
                                    }
                                >
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
