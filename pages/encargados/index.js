"use client";

import { useCallback, useMemo, useState } from "react";
import Head from "next/head";
import useSWR from "swr";
import fetcher from "@/components/fetcher";
import Layout from "@/components/Home/Layout";
import { getURL } from "@/components/utils";
import { useCiclo } from "@/contexts/CicloContext";
import usePermission from "@/hooks/usePermission";
import { useEncargados } from "@/hooks/useEncargados";
import { EncargadosTable } from "@/components/Encargados";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import GroupsIcon from "@mui/icons-material/Groups";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import SchoolIcon from "@mui/icons-material/School";
import Accordion from "@mui/joy/Accordion";
import AccordionDetails from "@mui/joy/AccordionDetails";
import AccordionGroup from "@mui/joy/AccordionGroup";
import AccordionSummary from "@mui/joy/AccordionSummary";
import Box from "@mui/joy/Box";
import Breadcrumbs from "@mui/joy/Breadcrumbs";
import Chip from "@mui/joy/Chip";
import CircularProgress from "@mui/joy/CircularProgress";
import Link from "@mui/joy/Link";
import Sheet from "@mui/joy/Sheet";
import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";

export default function EncargadosPage() {
    const { selectedCicloId } = useCiclo();
    const [expandedCursos, setExpandedCursos] = useState([]);

    usePermission("moodle.view_encargadogrupo");

    const { data: cursos, isLoading: cursosLoading } = useSWR(
        selectedCicloId
            ? getURL(`/api/usuarios/cursos?ciclo_id=${selectedCicloId}`)
            : null,
        fetcher,
    );

    const { data: gruposData, isLoading: gruposLoading } = useSWR(
        selectedCicloId
            ? getURL(`/api/moodle/grupos?ciclo_id=${selectedCicloId}`)
            : null,
        fetcher,
    );

    const {
        encargadosPorGrupo,
        isLoading: encargadosLoading,
        isPending,
        asignar,
        remover,
    } = useEncargados();

    const gruposPorCurso = useMemo(() => {
        const grupos = gruposData?.data ?? gruposData;
        if (!grupos || !Array.isArray(grupos)) return {};

        const mapa = {};
        for (const grupo of grupos) {
            const cursoId = grupo.course__id || grupo.course_id;
            if (!mapa[cursoId]) {
                mapa[cursoId] = [];
            }
            mapa[cursoId].push({
                id: grupo.id,
                name: grupo.name,
                shortname: grupo.shortname,
            });
        }
        return mapa;
    }, [gruposData]);

    const handleAccordionChange = useCallback((cursoId) => {
        setExpandedCursos((prev) =>
            prev.includes(cursoId)
                ? prev.filter((id) => id !== cursoId)
                : [...prev, cursoId],
        );
    }, []);

    const isLoading = cursosLoading || gruposLoading || encargadosLoading;

    const cursosConGrupos = useMemo(() => {
        if (!cursos) return [];
        return cursos.filter((curso) => {
            const cursoId = curso.value ?? curso.id;
            return gruposPorCurso[cursoId]?.length > 0;
        });
    }, [cursos, gruposPorCurso]);

    return (
        <Layout>
            <Head>
                <title>Encargados de grupos - Consulta previa</title>
            </Head>

            <Box sx={{ display: "flex", alignItems: "center" }}>
                <Breadcrumbs
                    size="sm"
                    aria-label="breadcrumbs"
                    separator={<ChevronRightRoundedIcon fontSize="sm" />}
                    sx={{ pl: 0 }}
                >
                    <Link
                        underline="none"
                        color="neutral"
                        href="/"
                        aria-label="Home"
                    >
                        <HomeRoundedIcon />
                    </Link>
                    <Typography
                        color="primary"
                        sx={{ fontWeight: 500, fontSize: 12 }}
                    >
                        Encargados
                    </Typography>
                </Breadcrumbs>
            </Box>

            <Box
                sx={{
                    display: "flex",
                    mb: 2,
                    gap: 1,
                    flexDirection: { xs: "column", sm: "row" },
                    alignItems: { xs: "start", sm: "center" },
                    flexWrap: "wrap",
                    justifyContent: "space-between",
                }}
            >
                <Stack spacing={0.5}>
                    <Typography level="h2" component="h1">
                        Encargados de grupos
                    </Typography>
                    <Typography level="body-sm" textColor="text.secondary">
                        Asigna usuarios responsables para cada grupo
                    </Typography>
                </Stack>
            </Box>

            {isLoading ? (
                <Stack
                    justifyContent="center"
                    alignItems="center"
                    sx={{ minHeight: 200 }}
                >
                    <CircularProgress />
                </Stack>
            ) : cursosConGrupos.length === 0 ? (
                <Sheet
                    variant="soft"
                    color="neutral"
                    sx={{ p: 4, borderRadius: "md", textAlign: "center" }}
                >
                    <GroupsIcon sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} />
                    <Typography level="title-md">
                        No hay grupos disponibles
                    </Typography>
                    <Typography level="body-sm" textColor="text.secondary">
                        No se encontraron cursos con grupos para el ciclo
                        seleccionado.
                    </Typography>
                </Sheet>
            ) : (
                <AccordionGroup
                    variant="outlined"
                    sx={{ borderRadius: "md", flex: "none" }}
                >
                    {cursosConGrupos.map((curso) => {
                        const cursoId = curso.value ?? curso.id;
                        const grupos = gruposPorCurso[cursoId] || [];
                        const isExpanded = expandedCursos.includes(cursoId);

                        const encargadosAsignados = grupos.reduce(
                            (count, grupo) => {
                                return (
                                    count +
                                    (encargadosPorGrupo[grupo.id]?.length > 0
                                        ? 1
                                        : 0)
                                );
                            },
                            0,
                        );

                        return (
                            <Accordion
                                key={cursoId}
                                expanded={isExpanded}
                                onChange={() => handleAccordionChange(cursoId)}
                            >
                                <AccordionSummary
                                    indicator={<ExpandMoreIcon />}
                                    slotProps={{
                                        button: {
                                            sx: { py: 1.5 },
                                        },
                                    }}
                                >
                                    <Stack
                                        direction="row"
                                        spacing={2}
                                        alignItems="center"
                                        sx={{ width: "100%" }}
                                    >
                                        <SchoolIcon color="primary" />
                                        <Box sx={{ flexGrow: 1 }}>
                                            <Typography level="title-sm">
                                                {curso.shortname ?? curso.name}
                                            </Typography>
                                            <Typography
                                                level="body-xs"
                                                textColor="text.tertiary"
                                            >
                                                {grupos.length} grupos
                                            </Typography>
                                        </Box>
                                        <Chip
                                            size="sm"
                                            variant="soft"
                                            color={
                                                encargadosAsignados ===
                                                grupos.length
                                                    ? "success"
                                                    : encargadosAsignados > 0
                                                      ? "warning"
                                                      : "neutral"
                                            }
                                        >
                                            {encargadosAsignados}/
                                            {grupos.length} asignados
                                        </Chip>
                                    </Stack>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <EncargadosTable
                                        grupos={grupos}
                                        encargadosPorGrupo={encargadosPorGrupo}
                                        isPending={isPending}
                                        onAsignar={asignar}
                                        onRemover={remover}
                                    />
                                </AccordionDetails>
                            </Accordion>
                        );
                    })}
                </AccordionGroup>
            )}
        </Layout>
    );
}
