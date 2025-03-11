import Box from "@mui/joy/Box";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Slider from "@mui/joy/Slider";
import Grid from "@mui/material/Grid2";
import { debounce, range } from "lodash";
import { useCallback } from "react";
import { Controller, useFormContext, useWatch } from "react-hook-form";

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

export default function RangeSlider({ inputProps }) {
    const { control } = useFormContext();

    const { controller: controllerProps } = inputProps;

    const activity__module_id = useWatch({
        control,
        name: "activity__module_id",
    });

    const onChange = (value, field) => {
        field.onChange(value);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const debounceOnChange = useCallback(debounce(onChange, 250), []);

    return activity__module_id === "all" ? null : (
        <Grid size={12}>
            <Controller
                control={control}
                render={({ field, fieldState: { error } }) => {
                    return (
                        <FormControl
                            error={error}
                            required={controllerProps.rules?.required?.value}
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <FormLabel>Porcentaje de avance</FormLabel>
                            <Box
                                sx={{
                                    width: "92%",
                                    // height: "36px",
                                    pb: 1.5,
                                }}
                            >
                                <Slider
                                    getAriaLabel={() => "Porcentaje de avance"}
                                    marks={marks}
                                    // value={field.value ?? [0, 100]}
                                    defaultValue={[0, 100]}
                                    // max={100}
                                    // min={0}
                                    step={5}
                                    onChange={(_, value) =>
                                        debounceOnChange(value, field)
                                    }
                                    valueLabelDisplay="auto"
                                    getAriaValueText={valueText}
                                    disableSwap
                                    // scale={(x) => x ** 10}
                                    // size="sm"
                                />
                            </Box>
                        </FormControl>
                    );
                }}
                {...controllerProps}
            />
        </Grid>
    );
}
