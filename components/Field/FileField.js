import AspectRatio from "@mui/joy/AspectRatio";
import FormControl from "@mui/joy/FormControl";
import FormHelperText from "@mui/joy/FormHelperText";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import { Box, CircularProgress, IconButton } from "@mui/joy";

import { Controller, useFormContext } from "react-hook-form";

import { getURL } from "../utils";
import { forwardRef, Fragment, useEffect, useState } from "react";
import { useHover } from "@uidotdev/usehooks";

import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import Image from "next/image";

const CustomImage = forwardRef(function CustomImage({ url }, ref) {
    const [objectURL, setObjectURL] = useState();
    const [hoverRef, hovering] = useHover();

    useEffect(() => {
        fetch(getURL("api/" + url)).then((response) => {
            console.log(response);
            response.blob().then((blob) => {
                const url = window.URL.createObjectURL(blob);
                setObjectURL(url);
            });
        });

        return () => {
            if (objectURL) {
                window.URL.revokeObjectURL(objectURL);
            }
        };
    }, []);

    const handleClick = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const w = window.open(objectURL);
        w.onclose = () => {
            window.URL.revokeObjectURL(objectURL);
        };
    };

    return (
        <AspectRatio ratio={16 / 9} ref={hoverRef} onClick={handleClick}>
            <Box>
                {objectURL ? (
                    <Image
                        src={objectURL}
                        alt="Imagen"
                        ref={ref}
                        width={hoverRef?.current?.clientWidth ?? 0}
                        height={hoverRef?.current?.clientHeight ?? 0}
                    />
                ) : (
                    <CircularProgress variant="solid" color="neutral" />
                )}
                {/* <img src={objectURL} alt="Imagen" ref={ref} /> */}
                {hovering && (
                    <IconButton
                        color="primary"
                        variant="solid"
                        sx={{
                            position: "absolute",
                            right: "50%",
                            top: "50%",
                            transform: "translate(50%, -50%)",
                        }}
                        onClick={handleClick}
                    >
                        <OpenInNewIcon />
                    </IconButton>
                )}
            </Box>
        </AspectRatio>
    );
});

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
                        <AspectRatio variant="plain">
                            <Input
                                onClick={() => onClick(value)}
                                readOnly
                                component={CustomImage}
                                slotProps={{
                                    root: {
                                        url: value,
                                    },
                                }}
                            />
                        </AspectRatio>
                        <FormHelperText> </FormHelperText>
                    </FormControl>
                );
            }}
            {...controllerProps}
        />
    );
}
