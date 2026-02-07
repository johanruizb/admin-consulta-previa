import { useFormContext, useWatch } from "react-hook-form";
import Grid from "@mui/material/Grid";
import TextField from "../Field/TextField";

export default function OtraConectividad({ inputProps }) {
    const { control } = useFormContext();

    const conectividad = useWatch({
        control,
        name: "conectividad",
    });

    return conectividad === "otra" && <TextField inputProps={inputProps} />;
}
