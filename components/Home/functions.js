import Fuse from "fuse.js";

import { chunk } from "lodash";

const FUSE_OPTIONS = {
    keys: [
        "num_doc",
        "nombres",
        "apellidos",
        "telefono1",
        "correo_electronico",
        "estado_name",
    ],
    useExtendedSearch: true,
};

const normalizeFilterValue = (value) => {
    if (value === undefined || value === null || value === "") {
        return undefined;
    }

    if (value === "true") {
        return true;
    }

    if (value === "false") {
        return false;
    }

    return value;
};

const matchesValue = (rowValue, expected) => {
    if (expected === undefined) {
        return true;
    }

    if (rowValue === undefined || rowValue === null) {
        return false;
    }

    if (typeof expected === "boolean") {
        if (typeof rowValue === "string") {
            if (rowValue === "true" || rowValue === "false") {
                return (rowValue === "true") === expected;
            }
        }

        return rowValue === expected;
    }

    return String(rowValue) === String(expected);
};

const buildPredicate = (filter) => {
    const normalized = {
        curso_20horas: normalizeFilterValue(filter.curso_20horas),
        diplomado_120horas: normalizeFilterValue(filter.diplomado_120horas),
        info_validada: normalizeFilterValue(filter.info_validada),
        plataforma_registro: normalizeFilterValue(filter.plataforma_registro),
        curso_inscrito: normalizeFilterValue(filter.curso_inscrito),
    };

    return (row) => {
        for (const [key, expected] of Object.entries(normalized)) {
            if (!matchesValue(row[key], expected)) {
                return false;
            }
        }

        return true;
    };
};

const createResult = (items) => {
    const chunkedList = chunk(items, 50);

    return {
        filtered: items,
        chunked: chunkedList,
        pages: chunkedList.length,
    };
};

function filterTable(originalData = [], filter = {}, setRows) {
    const data = Array.isArray(originalData) ? originalData : [];

    const predicate = buildPredicate(filter);
    const baseRows = data.filter(predicate);

    const searchTerm =
        typeof filter.search === "string" && filter.search !== ""
            ? filter.search
            : undefined;

    const filteredRows = (() => {
        if (!searchTerm || baseRows.length === 0) {
            return baseRows;
        }

        const fuse = new Fuse(baseRows, FUSE_OPTIONS);
        return fuse.search("'" + searchTerm).map((item) => item.item);
    })();

    const result = createResult(filteredRows);

    if (typeof setRows === "function") {
        setRows((prev) => ({
            ...prev,
            ...result,
        }));
    }

    return result;
}

export { filterTable };
