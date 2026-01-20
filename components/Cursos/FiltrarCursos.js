import SearchIcon from "@mui/icons-material/Search";
import Accordion from "@mui/joy/Accordion";
import AccordionDetails from "@mui/joy/AccordionDetails";
import AccordionSummary from "@mui/joy/AccordionSummary";
import Box from "@mui/joy/Box";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import Stack from "@mui/joy/Stack";
import Grid from "@mui/material/Grid";
import { useSessionStorage } from "@uidotdev/usehooks";
import Fuse from "fuse.js";
import { cloneDeep, debounce } from "lodash";
import { Fragment, useCallback, useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import FormularioCursos from "./constants";
import GruposSelect from "./GruposSelect";
import RangeSlider from "../Field/RangeSlider";
import CicloSelector from "../Ciclos/CicloSelector";
import DynamicCursoSelect from "./DynamicCursoSelect";
import CustomAsyncSelect from "../Form/CustomAsyncSelect";

function filter(originalData, searchValue, callback) {
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
        false,
    );
    const [search, setSearch] = useState();

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const setSearchDebounced = useCallback(
        debounce((value) => {
            setSearch(value);
        }, 250),
        [],
    );

    useEffect(() => {
        filter(data?.resultados ?? [], search, setFilter);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search, data]);

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
                    alignItems="flex-end"
                    spacing={1}
                    flexWrap="wrap"
                    useFlexGap
                >
                    <FormControl sx={{ minWidth: 150, flex: 1 }} size="md">
                        <FormLabel>Buscar</FormLabel>
                        <Input
                            size="md"
                            placeholder="Buscar en la tabla"
                            onChange={(e) => {
                                const value = e.target.value;
                                setSearchDebounced(value);
                            }}
                            startDecorator={<SearchIcon />}
                        />
                    </FormControl>
                    <Box sx={{ minWidth: 160 }}>
                        <DynamicCursoSelect
                            inputProps={{
                                ...FormularioCursos[0],
                                field: {
                                    ...FormularioCursos[0].field,
                                    size: "md",
                                },
                            }}
                        />
                    </Box>
                    <GruposSelect compact />
                    <Box sx={{ minWidth: 160 }}>
                        <CustomAsyncSelect
                            inputProps={{
                                ...FormularioCursos[1],
                                field: {
                                    ...FormularioCursos[1].field,
                                    size: "md",
                                },
                            }}
                        />
                    </Box>
                    <CicloSelector size="md" />
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
                        {FormularioCursos.slice(2).map((slotProps, index) => {
                            const {
                                Component,
                                size = {
                                    xs: 12,
                                    md: 3,
                                },
                                gridless,
                                ...inputProps
                            } = slotProps;

                            return Component ? (
                                <Fragment key={index}>
                                    {gridless ? (
                                        <Component
                                            key={index}
                                            inputProps={inputProps}
                                        />
                                    ) : (
                                        <Grid key={index} size={size}>
                                            <Component
                                                inputProps={inputProps}
                                            />
                                        </Grid>
                                    )}
                                </Fragment>
                            ) : null;
                        })}
                        {/* <GruposSelect /> */}
                        <RangeSlider
                            inputProps={{
                                controller: {
                                    name: "porcentaje_avance",
                                },
                            }}
                        />
                    </Grid>
                </AccordionDetails>
            </Accordion>
        </Box>
    );
}
