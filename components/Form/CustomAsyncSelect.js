import ReportIcon from "@mui/icons-material/Report";

import { CircularProgress, Select as JoySelect, Option } from "@mui/joy";
import FormControl from "@mui/joy/FormControl";
import FormHelperText from "@mui/joy/FormHelperText";
import FormLabel from "@mui/joy/FormLabel";

import { Controller, useFormContext, useWatch } from "react-hook-form";

import useSWRImmutable from "swr/immutable";

import fetcher from "../fetcher";
import { format, getURL } from "../utils";

function getCustomURL(url, values) {
    return getURL(format(url, values));
}

export default function CustomAsyncSelect({ inputProps }) {
    const { control } = useFormContext();

    const { url, ...otherProps } = inputProps;

    const {
        dependencies,
        controller: controllerProps,
        field: { ...fieldProps },
    } = inputProps;

    const values = useWatch({
        control,
        name: dependencies,
    });

    const customURL = getCustomURL(url, values);
    const { data, error, isLoading } = useSWRImmutable(customURL, fetcher);

    return isLoading || error ? (
        <FormControl
            error={error}
            required={controllerProps.rules?.required?.value}
        >
            <FormLabel>{fieldProps.label}</FormLabel>
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
        field: { InputProps, ...fieldProps },
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
                        <FormLabel>{fieldProps.label}</FormLabel>
                        <JoySelect
                            {...field}
                            value={parseInt(field.value) || ""}
                            onChange={(e, value) => field.onChange(value)}
                        >
                            {fieldProps?.options?.map((option) => (
                                <Option
                                    key={parseInt(option.value)}
                                    value={parseInt(option.value)}
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