"use client";

import fetcher from "@/components/fetcher";
import { getURL } from "@/components/utils";
import { useCiclo } from "@/contexts/CicloContext";
import { DialogTitle, Divider } from "@mui/joy";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Option from "@mui/joy/Option";
import Select from "@mui/joy/Select";
import Skeleton from "@mui/joy/Skeleton";
import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";
import PropTypes from "prop-types";
import { memo, useCallback, useEffect, useMemo } from "react";
import { useController, useFormContext, useWatch } from "react-hook-form";
import useSWR from "swr";

/**
 * Selector de grupo para un curso específico
 */
const GrupoSelect = memo(function GrupoSelect({
    cursoId,
    cursoName,
    gruposData,
    isLoading,
    value,
    onChange,
    disabled,
}) {
    const handleChange = useCallback(
        (_, newValue) => {
            onChange(cursoId, newValue);
        },
        [cursoId, onChange],
    );

    if (isLoading) {
        return (
            <FormControl size="sm">
                <Skeleton variant="text" width={100} height={20} />
                <Skeleton variant="rectangular" height={36} />
            </FormControl>
        );
    }

    // No mostrar si no hay grupos disponibles
    if (!gruposData || gruposData.length === 0) {
        return null;
    }

    return (
        <FormControl size="sm">
            <FormLabel>Grupo - {cursoName}</FormLabel>
            <Select
                size="sm"
                placeholder="Seleccionar grupo"
                value={value ?? ""}
                onChange={handleChange}
                disabled={disabled}
            >
                <Option value="">Sin grupo</Option>
                {gruposData.map((grupo) => (
                    <Option key={grupo.id} value={grupo.id}>
                        {grupo.name}
                    </Option>
                ))}
            </Select>
        </FormControl>
    );
});

GrupoSelect.propTypes = {
    cursoId: PropTypes.number.isRequired,
    cursoName: PropTypes.string.isRequired,
    gruposData: PropTypes.array,
    isLoading: PropTypes.bool,
    value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    onChange: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
};

/**
 * Hook para cargar grupos de un curso específico
 */
function useGruposPorCurso(cursoId, cicloId) {
    const url = useMemo(() => {
        if (!cursoId || !cicloId) return null;
        return getURL(
            `/api/moodle/curso/${cursoId}/grupos?ciclo_id=${cicloId}`,
        );
    }, [cursoId, cicloId]);

    const { data, isLoading } = useSWR(url, fetcher);

    return { gruposData: data, isLoading };
}

/**
 * Componente selector de grupos para múltiples cursos
 * Muestra un selector por cada curso inscrito que tenga grupos disponibles
 */
function GruposSelector({ disabled = false }) {
    const { selectedCicloId } = useCiclo();
    const { control } = useFormContext();

    // Observar cambios en cursos_inscritos
    const cursosInscritos = useWatch({
        control,
        name: "cursos_inscritos",
        defaultValue: [],
    });

    // Controller para grupos_asignados
    const { field } = useController({
        control,
        name: "grupos_asignados",
        defaultValue: [],
    });

    // Cargar datos de cursos para obtener nombres
    const { data: cursosData } = useSWR(
        selectedCicloId
            ? getURL(`/api/usuarios/cursos?ciclo_id=${selectedCicloId}`)
            : null,
        fetcher,
    );

    // Crear mapa de cursos para acceso rápido
    const cursosMap = useMemo(() => {
        if (!Array.isArray(cursosData)) return {};
        return cursosData.reduce((acc, curso) => {
            acc[curso.value ?? curso.id] = curso.shortname ?? curso.name;
            return acc;
        }, {});
    }, [cursosData]);

    // Convertir grupos_asignados a mapa para acceso rápido
    const gruposAsignadosMap = useMemo(() => {
        if (!Array.isArray(field.value)) return {};
        return field.value.reduce((acc, asignacion) => {
            acc[asignacion.curso_id] = asignacion.grupo_id;
            return acc;
        }, {});
    }, [field.value]);

    // Handler para cambio de grupo
    const handleGrupoChange = useCallback(
        (cursoId, grupoId) => {
            const currentValue = Array.isArray(field.value) ? field.value : [];

            // Buscar si ya existe una asignación para este curso
            const existingIndex = currentValue.findIndex(
                (a) => a.curso_id === cursoId,
            );

            let newValue;
            if (grupoId === "" || grupoId === null) {
                // Eliminar asignación si selecciona "Sin grupo"
                if (existingIndex >= 0) {
                    newValue = currentValue.filter(
                        (_, i) => i !== existingIndex,
                    );
                } else {
                    newValue = currentValue;
                }
            } else {
                // Actualizar o crear asignación
                if (existingIndex >= 0) {
                    newValue = currentValue.map((a, i) =>
                        i === existingIndex ? { ...a, grupo_id: grupoId } : a,
                    );
                } else {
                    newValue = [
                        ...currentValue,
                        { curso_id: cursoId, grupo_id: grupoId },
                    ];
                }
            }

            field.onChange(newValue);
        },
        [field],
    );

    // Limpiar grupos de cursos que ya no están inscritos
    useEffect(() => {
        if (!Array.isArray(field.value) || !Array.isArray(cursosInscritos))
            return;

        const cursosInscritosSet = new Set(cursosInscritos);
        const gruposFiltrados = field.value.filter((a) =>
            cursosInscritosSet.has(a.curso_id),
        );

        if (gruposFiltrados.length !== field.value.length) {
            field.onChange(gruposFiltrados);
        }
    }, [cursosInscritos, field]);

    // No mostrar nada si no hay cursos inscritos
    if (!Array.isArray(cursosInscritos) || cursosInscritos.length === 0) {
        return null;
    }

    return (
        <Stack spacing={1.5}>
            <DialogTitle>Asignación de grupos</DialogTitle>
            <Stack
                direction={{ xs: "column", md: "row" }}
                spacing={1.5}
                flexWrap="wrap"
            >
                {cursosInscritos.map((cursoId) => (
                    <GrupoSelectWrapper
                        key={cursoId}
                        cursoId={cursoId}
                        cursoName={cursosMap[cursoId] || `Curso ${cursoId}`}
                        cicloId={selectedCicloId}
                        value={gruposAsignadosMap[cursoId]}
                        onChange={handleGrupoChange}
                        disabled={disabled}
                    />
                ))}
            </Stack>
        </Stack>
    );
}

GruposSelector.propTypes = {
    disabled: PropTypes.bool,
};

/**
 * Wrapper que carga los grupos para un curso específico
 */
const GrupoSelectWrapper = memo(function GrupoSelectWrapper({
    cursoId,
    cursoName,
    cicloId,
    value,
    onChange,
    disabled,
}) {
    const { gruposData, isLoading } = useGruposPorCurso(cursoId, cicloId);

    // No renderizar si no hay grupos para este curso
    if (!isLoading && (!gruposData || gruposData.length === 0)) {
        return null;
    }

    return (
        <GrupoSelect
            cursoId={cursoId}
            cursoName={cursoName}
            gruposData={gruposData}
            isLoading={isLoading}
            value={value}
            onChange={onChange}
            disabled={disabled}
        />
    );
});

GrupoSelectWrapper.propTypes = {
    cursoId: PropTypes.number.isRequired,
    cursoName: PropTypes.string.isRequired,
    cicloId: PropTypes.number,
    value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    onChange: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
};

export default memo(GruposSelector);
