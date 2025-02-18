import SearchIcon from "@mui/icons-material/Search";
import Accordion from "@mui/joy/Accordion";
import AccordionDetails from "@mui/joy/AccordionDetails";
import AccordionSummary from "@mui/joy/AccordionSummary";
import Box from "@mui/joy/Box";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import Stack from "@mui/joy/Stack";
import Grid from "@mui/material/Grid2";
import { useSessionStorage } from "@uidotdev/usehooks";
import Fuse from "fuse.js";
import { cloneDeep, debounce } from "lodash";
import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import FormularioCursos, { FormularioGrupos } from "./constants";

function filter(originalData, searchValue, callback) {
    console.log(originalData, searchValue);
    if (searchValue !== undefined && searchValue !== "") {
        let result = cloneDeep(originalData);
        const fuse = new Fuse(result, {
            keys: ["documento", "usuario", "email"],
            useExtendedSearch: true,
            // threshold: 0.3,
        });
        result = fuse.search("'" + searchValue).map((item) => item.item);
        callback(result);
    } else {
        callback();
    }
}

export default function FiltrarCursos({ setFilter, data }) {
    const [expanded, setExpanded] = useSessionStorage(
        "FiltrarCursos__expanded",
        false
    );
    const [search, setSearch] = useState();

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const setSearchDebounced = useCallback(
        debounce((value) => {
            setSearch(value);
        }, 250),
        []
    );

    useEffect(() => {
        filter(data?.resultados ?? [], search, setFilter);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search, data]);

    // FormularioGrupos
    const { control } = useFormContext();
    const course_id = useWatch({
        control,
        name: "activity__module__course_id",
    });

    const FormGroups = useMemo(() => {
        return FormularioGrupos[course_id];
    }, [course_id]);

    // console.log(course_id);
    // console.log(FormularioGrupos[course_id]);

    return (
        <Box
            sx={{
                display: { xs: "none", sm: "initial" },
            }}
        >
            <Accordion
                expanded={expanded}
                onChange={(e, expanded) => setExpanded(expanded)}
            >
                <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    spacing={1}
                >
                    <FormControl sx={{ flex: 1 }} size="sm">
                        <FormLabel>Buscar</FormLabel>
                        <Input
                            size="sm"
                            placeholder="Buscar en la tabla"
                            onChange={(e) => {
                                const value = e.target.value;
                                setSearchDebounced(value);
                            }}
                            startDecorator={<SearchIcon />}
                        />
                    </FormControl>
                    <AccordionSummary
                        sx={{
                            pt: "24px",
                            ".MuiAccordionSummary-button": {
                                minHeight: "32px",
                            },
                        }}
                    >
                        {expanded ? "Ocultar" : "Ver"} todos los filtros
                    </AccordionSummary>
                </Stack>
                <AccordionDetails
                    sx={{
                        pt: 1,
                    }}
                >
                    <Grid container spacing={1.25}>
                        {FormularioCursos.map((slotProps, index) => {
                            const {
                                Component,
                                size = {
                                    xs: 12,
                                    md: 3,
                                },
                                ...inputProps
                            } = slotProps;

                            return Component ? (
                                <Fragment key={index}>
                                    {index == 1 &&
                                        FormGroups?.map((slotProps, index) => {
                                            const {
                                                Component,
                                                size = {
                                                    xs: 12,
                                                    md: 3,
                                                },
                                                ...inputProps
                                            } = slotProps;

                                            return Component ? (
                                                <Grid key={index} size={size}>
                                                    <Component
                                                        inputProps={inputProps}
                                                    />
                                                </Grid>
                                            ) : null;
                                        })}
                                    <Grid key={index} size={size}>
                                        <Component inputProps={inputProps} />
                                    </Grid>
                                </Fragment>
                            ) : null;
                        })}
                    </Grid>
                </AccordionDetails>
            </Accordion>
        </Box>
    );
}
