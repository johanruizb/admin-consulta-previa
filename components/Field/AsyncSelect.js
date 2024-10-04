import ReportIcon from "@mui/icons-material/Report";

import CircularProgress from "@mui/joy/CircularProgress";
import { default as JoySelect } from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import FormControl from "@mui/joy/FormControl";
import FormHelperText from "@mui/joy/FormHelperText";
import FormLabel from "@mui/joy/FormLabel";

import { Controller, useFormContext } from "react-hook-form";

import useSWRImmutable from "swr/immutable";

import fetcher from "../fetcher";
import { getURL } from "../utils";

export default function SelectWrapper({ inputProps }) {
    const { url, ...otherProps } = inputProps;
    const { data, error, isLoading } = useSWRImmutable(getURL(url), fetcher);

    const {
        controller: controllerProps,
        field: { ...fieldProps },
    } = inputProps;

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
                            {fieldProps.options.map((option) => (
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
