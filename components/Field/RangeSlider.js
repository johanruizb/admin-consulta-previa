import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Box from "@mui/joy/Box";
import Slider from "@mui/joy/Slider";
import Grid from "@mui/material/Grid2";
import { debounce } from "lodash";
import { useCallback } from "react";
import { Controller, useFormContext, useWatch } from "react-hook-form";

const marks = [
    {
        value: 0,
        label: "0%",
    },
    // {
    //     value: 10,
    //     label: "10%",
    // },
    {
        value: 20,
        label: "20%",
    },
    // {
    //     value: 30,
    //     label: "30%",
    // },
    {
        value: 40,
        label: "40%",
    },
    // {
    //     value: 50,
    //     label: "50%",
    // },
    {
        value: 60,
        label: "60%",
    },
    // {
    //     value: 70,
    //     label: "70%",
    // },
    {
        value: 80,
        label: "80%",
    },
    // {
    //     value: 90,
    //     label: "90%",
    // },
    {
        value: 100,
        label: "100%",
    },
];

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
        <Grid
            size={{
                xs: 12,
                md: 3,
            }}
        >
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
                                    height: "36px",
                                    // pt: 1.5,
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
                                    size="sm"
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
