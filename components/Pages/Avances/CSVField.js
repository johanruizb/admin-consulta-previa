import CloudUploadIcon from "@mui/icons-material/CloudUpload";

import FormControl from "@mui/joy/FormControl";
import FormHelperText from "@mui/joy/FormHelperText";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";

import { useFormContext } from "react-hook-form";

import { useDropzone } from "react-dropzone";
import { useController } from "react-hook-form";

export default function CSVField() {
    const { control } = useFormContext();
    const {
        field,
        fieldState: { error },
    } = useController({
        name: "csv",
        control,
        rules: {
            required: {
                value: true,
                message: "Este campo es requerido",
            },
        },
    });

    const { getRootProps, getInputProps } = useDropzone({
        accept: {
            // CSV
            "text/csv": [".csv"],
        },
        multiple: false,
        maxSize: 10 * 1024 * 1024,
        onDropAccepted: (files) => {
            field.onChange(files[0]);
        },
    });

    return (
        <FormControl
            sx={{
                "*:hover": {
                    cursor: "pointer !important",
                },
            }}
            error={Boolean(error)}
            required
            {...getRootProps()}
        >
            <FormLabel>Archivo CSV</FormLabel>
            <Input
                value={field?.value?.name ?? ""}
                readOnly
                startDecorator={<CloudUploadIcon />}
            />
            <input {...getInputProps()} />
            <FormHelperText>{error?.message ?? " "}</FormHelperText>
        </FormControl>
    );
}
