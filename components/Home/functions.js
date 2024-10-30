import Fuse from "fuse.js";

import { chunk } from "lodash";

import { cloneDeep } from "lodash";

function filterTable(originalData, filter, setRows) {
    let result = cloneDeep(originalData);

    result = originalData.filter((row) => {
        const curso_inscrito = filter.curso_inscrito
            ? String(row.curso_inscrito) === String(filter.curso_inscrito)
            : true;
        const info_validada = filter.info_validada
            ? String(row.info_validada) === String(filter.info_validada)
            : true;

        return curso_inscrito && info_validada;
    });

    if (filter.search !== undefined) {
        const fuse = new Fuse(result, {
            keys: [
                "num_doc",
                "nombres",
                "apellidos",
                "telefono1",
                "estado_name",
            ],
            useExtendedSearch: true,
            // threshold: 0.3,
        });
        // result = fuse.search("=" + filter.search).map((item) => item.item);
        result = fuse.search("'" + filter.search).map((item) => item.item);
    }

    const chunkedList = chunk(result, 50);

    setRows((prev) => ({
        ...prev,
        filtered: result,
        chunked: chunkedList,
        pages: chunkedList.length,
    }));
}

export { filterTable };
