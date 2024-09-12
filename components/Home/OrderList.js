/* eslint-disable jsx-a11y/anchor-is-valid */
import Box from "@mui/joy/Box";
import Chip from "@mui/joy/Chip";
import Divider from "@mui/joy/Divider";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import IconButton from "@mui/joy/IconButton";
import Input from "@mui/joy/Input";
import Option from "@mui/joy/Option";
import Select from "@mui/joy/Select";
import Sheet from "@mui/joy/Sheet";
import Typography from "@mui/joy/Typography";

import BlockIcon from "@mui/icons-material/Block";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import SearchIcon from "@mui/icons-material/Search";
import Pagination from "@mui/material/Pagination";

import FilterAltIcon from "@mui/icons-material/FilterAlt";

import { Stack } from "@mui/material";

import dayjs from "dayjs";

import { chunk } from "lodash";

import { Fragment, useMemo, useState } from "react";
import {
    Button,
    Link,
    List,
    ListDivider,
    ListItem,
    ListItemContent,
    Modal,
    ModalClose,
    ModalDialog,
} from "@mui/joy";

export default function OrderList({ data, onView }) {
    const [page, setPage] = useState(1);
    const [filter, setFilter] = useState({});
    const [open, setOpen] = useState(false);

    const rows = useMemo(() => {
        const filtered = [...(data ?? [])]?.filter((row) => {
            if (filter.info_validada !== undefined)
                return row.info_validada === filter.info_validada;
            return row;
        });

        const chunkedList = chunk(filtered, 50) ?? [];

        return {
            filtered,
            chunked: chunkedList,
            pages: chunkedList.length,
        };
    }, [data, filter]);

    return (
        <Fragment>
            <Sheet
                className="SearchAndFilters-mobile"
                sx={{ display: { xs: "flex", sm: "none" }, my: 1, gap: 1 }}
            >
                <Input
                    size="sm"
                    placeholder="Buscar en la lista"
                    startDecorator={<SearchIcon />}
                    sx={{ flexGrow: 1 }}
                />
                <IconButton
                    size="sm"
                    variant="outlined"
                    color="neutral"
                    onClick={() => setOpen(true)}
                >
                    <FilterAltIcon />
                </IconButton>
                <Modal open={open} onClose={() => setOpen(false)} keepMounted>
                    <ModalDialog
                        aria-labelledby="filter-modal"
                        layout="fullscreen"
                    >
                        <ModalClose />
                        <Typography id="filter-modal" level="h2">
                            Filtros
                        </Typography>
                        <Divider sx={{ my: 2 }} />
                        <Sheet
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 2,
                            }}
                        >
                            <FormControl size="sm">
                                <FormLabel>Estado</FormLabel>
                                <Select
                                    size="sm"
                                    placeholder="Filtrar por estado"
                                    slotProps={{
                                        button: {
                                            sx: { whiteSpace: "nowrap" },
                                        },
                                    }}
                                    onChange={(e, newValue) => {
                                        setFilter((prev) => ({
                                            ...prev,
                                            info_validada: newValue,
                                        }));
                                    }}
                                >
                                    <Option value={true}>Validado</Option>
                                    <Option value={false}>No validado</Option>
                                </Select>
                            </FormControl>
                            <Button
                                color="primary"
                                onClick={() => setOpen(false)}
                            >
                                Aplicar filtros
                            </Button>
                        </Sheet>
                    </ModalDialog>
                </Modal>
            </Sheet>
            <Box sx={{ display: { xs: "block", sm: "none" } }}>
                {rows?.chunked[page - 1]?.map((row) => (
                    <List
                        key={row.id}
                        size="sm"
                        sx={{ "--ListItem-paddingX": 0 }}
                    >
                        <ListItem
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "start",
                            }}
                        >
                            <ListItemContent
                                sx={{
                                    display: "flex",
                                    gap: 2,
                                    alignItems: "start",
                                }}
                            >
                                <div>
                                    <Typography
                                        gutterBottom
                                        sx={{ fontWeight: 600 }}
                                    >
                                        {row.nombres} {row.apellidos}
                                    </Typography>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 0.5,
                                            mb: 1,
                                        }}
                                    >
                                        <Typography level="body-xs">
                                            ({row.tipo_doc_abbreviation}){" "}
                                            {row.num_doc}
                                        </Typography>
                                        <Typography
                                            level="body-xs"
                                            sx={{ mx: "5px" }}
                                        >
                                            &bull;
                                        </Typography>
                                        <Typography level="body-xs">
                                            {row.telefono1}
                                        </Typography>
                                    </Box>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            gap: 0.5,
                                            mb: 1,
                                        }}
                                    >
                                        <Typography level="body-xs">
                                            {dayjs(row.created_at).format(
                                                "DD/MM/YYYY HH:mm:ss A"
                                            )}
                                        </Typography>
                                        <Typography level="body-xs">
                                            &bull;
                                        </Typography>
                                        <Typography level="body-xs">
                                            {row.estado_name}
                                        </Typography>
                                    </Box>
                                </div>
                            </ListItemContent>
                            <Stack
                                sx={{
                                    display: "flex",
                                    gap: 1,
                                    alignItems: "center",
                                }}
                            >
                                <Chip
                                    variant="soft"
                                    size="sm"
                                    startDecorator={
                                        {
                                            true: (
                                                <CheckRoundedIcon fontSize="small" />
                                            ),
                                            false: (
                                                <BlockIcon fontSize="small" />
                                            ),
                                        }[row.info_validada]
                                    }
                                    color={
                                        {
                                            true: "success",
                                            false: "danger",
                                        }[row.info_validada]
                                    }
                                >
                                    {row.info_validada
                                        ? "Validado"
                                        : "Sin validar"}
                                </Chip>
                                <Button
                                    variant="solid"
                                    color={
                                        row.info_validada
                                            ? "primary"
                                            : "success"
                                    }
                                    onClick={() => onView(row.id)}
                                >
                                    {row.info_validada ? "Editar" : "Validar"}
                                </Button>
                            </Stack>
                        </ListItem>
                        <ListDivider />
                    </List>
                ))}
                <Pagination
                    size="medium"
                    page={page}
                    count={rows.pages || 1}
                    variant="outlined"
                    onChange={(_, page) => setPage(page)}
                    sx={{
                        ".MuiPagination-ul": {
                            width: "100%",
                            justifyContent: "center",
                        },
                    }}
                />
            </Box>
        </Fragment>
    );
}
