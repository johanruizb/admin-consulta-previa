import fetcher from "@/components/fetcher";
import STORAGE from "@/hooks/storage";
import { getURL } from "@/components/utils";
import { preload } from "swr";

const SELECTED_CICLO_STORAGE_KEY = "selected-ciclo-id";
let preloadPromise;

const toNumber = (value) => {
    if (typeof value === "number" && Number.isFinite(value)) return value;
    if (typeof value === "string") {
        const parsed = parseInt(value, 10);
        if (Number.isFinite(parsed)) return parsed;
    }
    return null;
};

const safePreload = async (key) => {
    if (!key) return null;
    try {
        return await preload(key, fetcher);
    } catch (error) {
        if (process.env.NODE_ENV !== "production") {
            console.warn("SWR preload fallo", key, error);
        }
        return null;
    }
};

const resolveSelectedCicloId = (ciclos) => {
    const list = Array.isArray(ciclos?.data) ? ciclos.data : ciclos;
    if (!Array.isArray(list) || list.length === 0) return null;

    const storedValue = STORAGE.load?.(
        SELECTED_CICLO_STORAGE_KEY,
        STORAGE.SESSION_STORAGE,
        null,
    );

    let selectedId = toNumber(storedValue);
    if (
        selectedId !== null &&
        !list.some((ciclo) => toNumber(ciclo?.id) === selectedId)
    ) {
        selectedId = null;
    }

    if (selectedId === null) {
        const current = list.find((ciclo) => ciclo?.is_current);
        selectedId = toNumber(current?.id);
    }

    if (selectedId === null) {
        selectedId = toNumber(list[0]?.id);
    }

    if (selectedId !== null) {
        STORAGE.save?.(
            SELECTED_CICLO_STORAGE_KEY,
            selectedId,
            STORAGE.SESSION_STORAGE,
        );
    }

    return selectedId;
};

const buildCourseQuery = (cicloId, courseIds, extraParams = {}) => {
    if (!cicloId) return null;

    const params = new URLSearchParams();
    params.set("ciclo_id", String(cicloId));

    Object.entries(extraParams).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            params.set(key, String(value));
        }
    });

    courseIds
        .filter((id) => id !== null)
        .forEach((id) => params.append("courses", String(id)));

    return params.toString();
};

const runInitializePreload = async () => {
    if (typeof window === "undefined") return;

    const baseTasks = [
        safePreload(getURL("api/user")),
        // safePreload("/api/permissions"),
        safePreload(getURL("api/usuarios/ciclos")),
    ];

    const [, , ciclosResponse] = await Promise.allSettled(baseTasks);
    const ciclosValue =
        ciclosResponse.status === "fulfilled" ? ciclosResponse.value : null;

    const selectedCicloId = resolveSelectedCicloId(ciclosValue);
    if (!selectedCicloId) {
        return;
    }

    const cursosKey = getURL(
        `api/usuarios/cursos/disponibles?ciclo_id=${selectedCicloId}`,
    );
    const cursosResult = await safePreload(cursosKey);

    const cursosList = Array.isArray(cursosResult?.data)
        ? cursosResult.data
        : Array.isArray(cursosResult)
          ? cursosResult
          : [];

    const courseIds = cursosList
        .map((curso) => toNumber(curso?.id))
        .filter((id) => id !== null);

    const followUpTasks = [
        safePreload(
            getURL(`/api/usuarios/summary?ciclo_id=${selectedCicloId}`),
        ),
    ];

    if (courseIds.length > 0) {
        const estadisticasQuery = buildCourseQuery(selectedCicloId, courseIds);
        followUpTasks.push(
            safePreload(
                getURL(`api/usuarios/estadisticas?${estadisticasQuery}`),
            ),
        );

        const inscripcionesQuery = buildCourseQuery(
            selectedCicloId,
            courseIds,
            {
                periodo: "dias",
            },
        );
        followUpTasks.push(
            safePreload(
                getURL(
                    `api/usuarios/inscripciones-por-periodo/?${inscripcionesQuery}`,
                ),
            ),
        );
    }

    await Promise.allSettled([...baseTasks, ...followUpTasks]);
};

export const initializePreload = () => {
    if (!preloadPromise) {
        preloadPromise = runInitializePreload().catch((error) => {
            if (process.env.NODE_ENV !== "production") {
                console.warn("initializePreload fallo", error);
            }
        });
    }

    return preloadPromise;
};
