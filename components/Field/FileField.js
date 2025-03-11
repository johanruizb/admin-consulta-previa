import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import CircularProgress from "@mui/joy/CircularProgress";
import IconButton from "@mui/joy/IconButton";
import Stack from "@mui/joy/Stack";
import Tooltip from "@mui/joy/Tooltip";
import AspectRatio from "@mui/joy/AspectRatio";
import FormControl from "@mui/joy/FormControl";
import FormHelperText from "@mui/joy/FormHelperText";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";

import { Controller, useFormContext } from "react-hook-form";

import { forwardRef, useEffect, useRef, useState } from "react";
import { getURL } from "../utils";

import FileUploadIcon from "@mui/icons-material/FileUpload";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

import Image from "next/image";
import { useDropzone } from "react-dropzone";

const CustomImage = forwardRef(function CustomImage(
    { url, field, readOnly },
    ref,
) {
    const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
        accept: {
            "image/png": [".png", ".jpg", ".jpeg"],
        },
        multiple: false,
        maxSize: 10 * 1024 * 1024,
        onDropAccepted: (files) => {
            field.onChange(files[0]);
        },
    });

    const ratioRef = useRef();
    const inputRef = useRef();

    const [objectURL, setObjectURL] = useState();

    useEffect(() => {
        if (typeof url === "string")
            fetch(getURL("api/" + url)).then((response) => {
                response.blob().then((blob) => {
                    const url = window.URL.createObjectURL(blob);
                    setObjectURL(url);
                });
            });
        else if (url instanceof File) {
            const newURL = window.URL.createObjectURL(url);
            setObjectURL(newURL);
        }

        return () => {
            if (objectURL) {
                window.URL.revokeObjectURL(objectURL);
            }
        };
    }, [url]);

    const handleClick = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const w = window.open(objectURL);
        w.onclose = () => {
            window.URL.revokeObjectURL(objectURL);
        };
    };

    const handleReplace = () => {
        inputRef.current.click();
    };

    return (
        <AspectRatio ratio={16 / 9} ref={ratioRef}>
            <Box>
                {objectURL ? (
                    <Image
                        src={objectURL}
                        alt="Imagen"
                        ref={ref}
                        width={ratioRef?.current?.clientWidth ?? 0}
                        height={ratioRef?.current?.clientHeight ?? 0}
                        onClick={handleClick}
                    />
                ) : (
                    <CircularProgress variant="solid" color="neutral" />
                )}
                {!readOnly && (
                    <Stack
                        direction="row"
                        spacing={1.25}
                        sx={{
                            position: "absolute",
                            right: "50%",
                            top: "50%",
                            transform: "translate(50%, -50%)",
                        }}
                    >
                        <Tooltip
                            title="Abrir en nueva pestaña"
                            arrow
                            variant="soft"
                        >
                            <IconButton
                                color="primary"
                                variant="solid"
                                onClick={handleClick}
                            >
                                <OpenInNewIcon />
                            </IconButton>
                        </Tooltip>
                        <Button
                            color="primary"
                            variant="solid"
                            onClick={handleReplace}
                            startDecorator={<FileUploadIcon />}
                            {...getRootProps()}
                        >
                            Reemplazar imagen
                            <input
                                type="file"
                                hidden
                                {...field}
                                {...getInputProps()}
                            />
                        </Button>
                    </Stack>
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
            render={({ field: { value, ...field } }) => {
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
                                        field,
                                        readOnly: fieldProps.readOnly,
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
