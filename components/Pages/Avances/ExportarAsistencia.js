"use client";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Chip from "@mui/joy/Chip";
import ChipDelete from "@mui/joy/ChipDelete";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import Modal from "@mui/joy/Modal";
import ModalClose from "@mui/joy/ModalClose";
import ModalDialog from "@mui/joy/ModalDialog";
import Option from "@mui/joy/Option";
import Select from "@mui/joy/Select";
import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";

import EventNoteIcon from "@mui/icons-material/EventNote";

import {
    Fragment,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";

import fetcher from "@/components/fetcher";
import usePermissionContext from "@/components/Home/permissionContext/usePermission";
import { getURL } from "@/components/utils";
import { useCiclo } from "@/contexts/CicloContext";
import dayjs from "dayjs";
import { useSnackbar } from "notistack";
import useSWR from "swr";

function ExportarAsistencia() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return mounted ? <ExportarAsistenciaInner /> : null;
}

function ExportarAsistenciaInner() {
    const { enqueueSnackbar } = useSnackbar();
    const {
        isLoading: permissionIsLoading,
        hasPermission,
        isAdmin,
    } = usePermissionContext();
    const { selectedCicloId } = useCiclo();

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [cursoId, setCursoId] = useState("all");
    const [grupoIds, setGrupoIds] = useState([]);
    const [fechaInicio, setFechaInicio] = useState(
        dayjs("2025-01-28").format("YYYY-MM-DD"),
    );
    const [fechaFin, setFechaFin] = useState(
        dayjs().endOf("month").format("YYYY-MM-DD"),
    );

    const defaultsApplied = useRef(false);

    const { data: cursos, isLoading: cursosLoading } = useSWR(
        selectedCicloId
            ? getURL(
                `api/usuarios/cursos/disponibles?ciclo_id=${selectedCicloId}`,
            )
            : null,
        fetcher,
    );

    const { data: misGrupos } = useSWR(
        selectedCicloId && !isAdmin
            ? getURL(
                `api/moodle/encargados/mis_grupos?ciclo_id=${selectedCicloId}`,
            )
            : null,
        fetcher,
    );

    useEffect(() => {
        if (defaultsApplied.current || isAdmin) return;
        if (!misGrupos || misGrupos.length === 0) return;

        const cursosUnicos = [
            ...new Set(misGrupos.map((g) => g.curso_id)),
        ];
        if (cursosUnicos.length === 1) {
            setCursoId(cursosUnicos[0]);
        } else {
            setCursoId("all");
        }
        setGrupoIds(misGrupos.map((g) => g.id));
        defaultsApplied.current = true;
    }, [misGrupos, isAdmin]);

    const cursoOptions = useMemo(() => {
        if (!cursos) return [];
        return cursos
            .filter((c) => c.id !== undefined && c.id !== null)
            .map((c) => ({
                value: c.id,
                label: c.shortname || c.name,
            }));
    }, [cursos]);

    const gruposUrl = useMemo(() => {
        if (!selectedCicloId) return null;
        if (cursoId === "all") {
            return getURL(`api/moodle/grupos?ciclo_id=${selectedCicloId}`);
        }
        return getURL(
            `api/moodle/curso/${cursoId}/grupos?ciclo_id=${selectedCicloId}`,
        );
    }, [cursoId, selectedCicloId]);

    const { data: grupos, isLoading: gruposLoading } = useSWR(
        gruposUrl,
        fetcher,
    );

    const grupoOptions = useMemo(() => {
        if (!grupos) return [];
        return grupos
            .filter(
                (g) => g.id !== "all" && g.id !== undefined && g.id !== null,
            )
            .map((g) => ({
                value: g.id,
                label: g.course__shortname
                    ? `${g.name} (${g.course__shortname})`
                    : g.name,
            }));
    }, [grupos]);

    const handleCursoChange = useCallback((_, val) => {
        setCursoId(val);
        setGrupoIds([]);
    }, []);

    const buildFilename = useCallback(() => {
        const cursoLabel =
            cursoId === "all"
                ? "Todos los cursos"
                : (cursoOptions.find((c) => c.value === cursoId)?.label ??
                    cursoId);

        let grupoLabel;
        if (grupoIds.length === 0) {
            grupoLabel = "Todos";
        } else {
            const nombres = grupoIds.map(
                (id) => grupoOptions.find((g) => g.value === id)?.label ?? id,
            );
            grupoLabel = `Grupos ${nombres.join(", ")}`;
        }

        const rango = `${fechaInicio} hasta ${fechaFin}`;
        const generado = dayjs().format("YYYY-MM-DD HH-mm-ss");
        return `${cursoLabel}, ${grupoLabel}_Asistencia ${rango} (${generado}).xlsx`;
    }, [cursoId, cursoOptions, grupoIds, grupoOptions, fechaInicio, fechaFin]);

    const handleExport = useCallback(() => {
        const cursoIds =
            cursoId === "all" ? cursoOptions.map((c) => c.value) : [cursoId];

        if (cursoIds.length === 0) {
            enqueueSnackbar("No hay cursos disponibles para exportar.", {
                variant: "warning",
            });
            return;
        }

        setLoading(true);
        const body = {
            curso_ids: cursoIds,
            fecha_inicio: fechaInicio,
            fecha_fin: fechaFin,
        };
        if (grupoIds.length > 0) {
            body.grupo_ids = grupoIds;
        }
        fetch(getURL("/api/moodle/reporte/asistencia"), {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        })
            .then(async (response) => {
                if (!response.ok) {
                    const errorData = await response.json().catch(() => null);
                    enqueueSnackbar(
                        errorData?.message ||
                        `No se pudo exportar el archivo. (${response.statusText})`,
                        { variant: "error" },
                    );
                } else {
                    const blob = await response.blob();
                    const reader = new FileReader();
                    reader.onload = () => {
                        const link = document.createElement("a");
                        link.href = reader.result;
                        link.download = buildFilename();
                        link.click();
                    };
                    reader.readAsDataURL(blob);
                    enqueueSnackbar("Archivo exportado correctamente.", {
                        variant: "success",
                    });
                    setOpen(false);
                }
            })
            .catch((error) => {
                enqueueSnackbar(
                    `No se pudo exportar el archivo. (${error?.message ?? "Error desconocido"})`,
                    { variant: "error" },
                );
            })
            .finally(() => {
                setLoading(false);
            });
    }, [
        cursoId,
        cursoOptions,
        grupoIds,
        fechaInicio,
        fechaFin,
        enqueueSnackbar,
        buildFilename,
    ]);

    if (permissionIsLoading) return null;
    if (!hasPermission("moodle.view_actividadescompletadas")) return null;

    return (
        <Fragment>
            <Button
                startDecorator={<EventNoteIcon />}
                variant="outlined"
                color="neutral"
                onClick={() => setOpen(true)}
            >
                Exportar asistencia
            </Button>
            <Modal open={open} onClose={() => setOpen(false)}>
                <ModalDialog sx={{ minWidth: 360, maxWidth: 420 }}>
                    <ModalClose />
                    <Typography level="h4">Exportar asistencia</Typography>
                    <Stack spacing={2} sx={{ mt: 1 }}>
                        <FormControl>
                            <FormLabel>Curso</FormLabel>
                            <Select
                                value={cursoId}
                                onChange={handleCursoChange}
                                disabled={cursosLoading}
                                placeholder={
                                    cursosLoading
                                        ? "Cargando cursos..."
                                        : "Seleccione un curso"
                                }
                            >
                                <Option value="all">Todos los cursos</Option>
                                {cursoOptions.map((c) => (
                                    <Option key={c.value} value={c.value}>
                                        {c.label}
                                    </Option>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl>
                            <FormLabel>Grupos</FormLabel>
                            <Select
                                multiple
                                value={grupoIds}
                                onChange={(_, val) => setGrupoIds(val)}
                                disabled={gruposLoading}
                                placeholder={
                                    gruposLoading
                                        ? "Cargando grupos..."
                                        : "Todos"
                                }
                                renderValue={(selected) => (
                                    <Box
                                        sx={{
                                            display: "flex",
                                            gap: 0.5,
                                            flexWrap: "wrap",
                                        }}
                                    >
                                        {selected.map((opt) => (
                                            <Chip
                                                key={opt.value}
                                                size="sm"
                                                variant="soft"
                                                endDecorator={
                                                    <ChipDelete
                                                        onDelete={() =>
                                                            setGrupoIds(
                                                                (prev) =>
                                                                    prev.filter(
                                                                        (id) =>
                                                                            id !==
                                                                            opt.value,
                                                                    ),
                                                            )
                                                        }
                                                    />
                                                }
                                            >
                                                {opt.label}
                                            </Chip>
                                        ))}
                                    </Box>
                                )}
                            >
                                {grupoOptions.map((g) => (
                                    <Option key={g.value} value={g.value}>
                                        {g.label}
                                    </Option>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl>
                            <FormLabel>Fecha inicio</FormLabel>
                            <Input
                                type="date"
                                value={fechaInicio}
                                onChange={(e) => setFechaInicio(e.target.value)}
                                slotProps={{
                                    input: { max: fechaFin },
                                }}
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel>Fecha fin</FormLabel>
                            <Input
                                type="date"
                                value={fechaFin}
                                onChange={(e) => setFechaFin(e.target.value)}
                                slotProps={{
                                    input: { min: fechaInicio },
                                }}
                            />
                        </FormControl>
                        <Button
                            loading={loading}
                            disabled={loading || !fechaInicio || !fechaFin}
                            onClick={handleExport}
                            fullWidth
                        >
                            Exportar
                        </Button>
                    </Stack>
                </ModalDialog>
            </Modal>
        </Fragment>
    );
}

export default ExportarAsistencia;