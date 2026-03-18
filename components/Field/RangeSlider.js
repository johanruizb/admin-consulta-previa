import Box from "@mui/joy/Box";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Slider from "@mui/joy/Slider";
import Grid from "@mui/material/Grid";
import { debounce, range } from "lodash";
import { useCallback } from "react";
import { Controller, useFormContext } from "react-hook-form";

function getMarks() {
    const rango = range(0, 101, 10);
    return rango.map((value) => {
        return {
            value,
            label: `${value}%`,
        };
    });
}

const marks = getMarks();

function valueText(value) {
    return `${value}%`;
}

export default function RangeSlider({ inputProps, personCount }) {
    const { control } = useFormContext();

    const { controller: controllerProps } = inputProps;

    const onChange = (value, field) => {
        field.onChange(value);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const debounceOnChange = useCallback(debounce(onChange, 250), []);

    return (
        <Controller
            control={control}
            render={({ field, fieldState: { error } }) => {
                const value = field.value ?? [0, 100];
                const label = personCount != null
                    ? `Porcentaje de avance (${value[0]}% - ${value[1]}%): ${personCount} personas`
                    : `Porcentaje de avance (${value[0]}% - ${value[1]}%)`;
                return (
                    <FormControl
                        error={error}
                        required={controllerProps.rules?.required?.value}
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: "100%",
                            py: 1,
                        }}
                    >
                        <FormLabel>{label}</FormLabel>
                        <Box
                            sx={{
                                width: "92%",
                                pb: 1.5,
                            }}
                        >
                            <Slider
                                getAriaLabel={() => "Porcentaje de avance"}
                                marks={marks}
                                defaultValue={[0, 100]}
                                step={5}
                                onChange={(_, value) =>
                                    debounceOnChange(value, field)
                                }
                                valueLabelDisplay="auto"
                                getAriaValueText={valueText}
                                disableSwap
                            />
                        </Box>
                    </FormControl>
                );
            }}
            {...controllerProps}
        />
    );
}
