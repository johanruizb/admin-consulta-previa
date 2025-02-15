import ReportIcon from "@mui/icons-material/Report";

import CircularProgress from "@mui/joy/CircularProgress";
import FormControl from "@mui/joy/FormControl";
import FormHelperText from "@mui/joy/FormHelperText";
import FormLabel from "@mui/joy/FormLabel";
import Option from "@mui/joy/Option";
import { default as JoySelect } from "@mui/joy/Select";

import { Controller, useFormContext, useWatch } from "react-hook-form";

import { useEffect, useMemo } from "react";
import useSWR from "swr";
import { v4 } from "uuid";
import fetcher from "../fetcher";
import { format, getURL } from "../utils";

function getCustomURL(url, values) {
    return getURL(format(url, values));
}

export default function CustomAsyncSelect({ inputProps }) {
    const { control } = useFormContext();

    const {
        url,
        dependencies,
        controller: controllerProps,
        field: { ...fieldProps },
    } = inputProps;

    const values = useWatch({
        control,
        name: dependencies,
    });

    const customURL = getCustomURL(url, values);
    const validURL = Array.isArray(values)
        ? values.every((value) => value)
        : values;

    const { data, error, isLoading } = useSWR(
        validURL ? customURL : null,
        fetcher
    );

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
                ...inputProps,
                field: { ...inputProps.field, options: data },
            }}
        />
    );
}

function AsyncSelect({ inputProps }) {
    const { control, setValue } = useFormContext();

    const {
        controller: controllerProps,
        field: { label: formLabel, options, ...fieldProps },
    } = inputProps;

    const opciones = useMemo(
        () => options.filter((option) => option.value !== "all"),
        [options]
    );

    useEffect(() => {
        if (opciones.length === 1)
            setValue(controllerProps.name, opciones[0].value);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [opciones]);

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
                            {...fieldProps}
                            slotProps={{
                                button: {
                                    disabled: fieldProps.readOnly,
                                },
                            }}
                        >
                            {options?.map((option) => (
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
