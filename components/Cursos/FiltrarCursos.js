/* eslint-disable jsx-a11y/anchor-is-valid */
import SearchIcon from "@mui/icons-material/Search";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    FormControl,
    FormLabel,
    Input,
    Stack,
} from "@mui/joy";
import Box from "@mui/joy/Box";
import Grid from "@mui/material/Grid2";
import { debounce } from "lodash";
import { useCallback, useEffect, useState } from "react";
import { FiltroCursos } from "./constants";

import Fuse from "fuse.js";

import { chunk } from "lodash";

import { cloneDeep } from "lodash";
import { useSessionStorage } from "@uidotdev/usehooks";

function filter(originalData, searchValue, callback) {
    if (searchValue !== undefined && searchValue !== "") {
        let result = cloneDeep(originalData);
        const fuse = new Fuse(result, {
            keys: ["documento", "usuario", "email"],
            useExtendedSearch: true,
            // threshold: 0.3,
        });
        result = fuse.search("'" + searchValue).map((item) => item.item);

        const chunkedList = chunk(result, 50);

        console.log({
            searchValue,
            chunked: chunkedList,
            pages: chunkedList.length,
        });

        callback({
            chunked: chunkedList,
            pages: chunkedList.length,
        });
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

    const setSearchDebounced = useCallback(
        debounce((value) => {
            setSearch(value);
        }, 250),
        []
    );

    useEffect(() => {
        filter(data?.all_res ?? [], search, setFilter);
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
                    {FiltroCursos.map((FormularioCurso, index) => (
                        <Grid key={index} container spacing={1.25}>
                            {FormularioCurso.map((slotProps, index) => {
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
                                        <Component inputProps={inputProps} />
                                    </Grid>
                                ) : null;
                            })}
                        </Grid>
                    ))}
                </AccordionDetails>
            </Accordion>
        </Box>
    );
}
