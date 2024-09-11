import FormControl from "@mui/joy/FormControl";
import FormHelperText from "@mui/joy/FormHelperText";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";

import { Controller, useFormContext } from "react-hook-form";

import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import IconButton from "@mui/joy/IconButton";
import { getURL } from "../utils";

export default function FileField({ inputProps }) {
    const { control } = useFormContext();

    const {
        controller: controllerProps,
        field: { InputProps, onChange: onChangeField, ...fieldProps },
    } = inputProps;

    const onClick = (url) => {
        fetch(getURL("api/" + url)).then((response) => {
            console.log(response);
            response.blob().then((blob) => {
                const url = window.URL.createObjectURL(blob);
                const w = window.open(url);
                w.onclose = () => {
                    window.URL.revokeObjectURL(url);
                };
            });
        });
    };

    return (
        <Controller
            control={control}
            render={({ field: { value } }) => {
                return (
                    <FormControl
                        sx={{
                            "*:hover": {
                                cursor: "pointer !important",
                            },
                        }}
                    >
                        <FormLabel>{fieldProps.label}</FormLabel>
                        <Input
                            onClick={() => onClick(value)}
                            defaultValue={value}
                            endDecorator={
                                <IconButton>
                                    <OpenInNewIcon />
                                </IconButton>
                            }
                            readOnly
                        />
                        <FormHelperText> </FormHelperText>
                    </FormControl>
                );
            }}
            {...controllerProps}
        />
    );
}
