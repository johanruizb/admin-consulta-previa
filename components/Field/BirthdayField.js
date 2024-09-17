import { Typography } from "@mui/joy";
import FormControl from "@mui/joy/FormControl";
import FormHelperText from "@mui/joy/FormHelperText";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";

import { Controller, useFormContext } from "react-hook-form";

import { useMemo } from "react";

import dayjs from "dayjs";

function YearCount({ date }) {
    const parsed = useMemo(() => {
        if (dayjs.isDayjs(date)) return date;
        else if (typeof date === "string") {
            const formattedDate = dayjs(date);
            return formattedDate.isValid() ? formattedDate : null;
        }

        return null;
    }, [date]);

    return (
        parsed && (
            <Typography level="body-sm" flex="none">
                {`${dayjs(dayjs()).diff(parsed, "years")} años`}
            </Typography>
        )
    );
}

export default function BirthdayField({ inputProps }) {
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

                return (
                    <FormControl
                        error={Boolean(error?.type || error?.types)}
                        required={controllerProps.rules?.required?.value}
                    >
                        <FormLabel>{fieldProps.label}</FormLabel>
                        <Input
                            {...field}
                            type="date"
                            endDecorator={<YearCount date={field.value} />}
                        />
                        <FormHelperText>{error?.message ?? " "}</FormHelperText>
                    </FormControl>
                );
            }}
            {...controllerProps}
        />
    );
}
