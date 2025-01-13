import Fuse from "fuse.js";

import { chunk } from "lodash";
import { cloneDeep } from "lodash";

function filterTable(originalData, filter, setRows) {
    let result = cloneDeep(originalData);

    result = originalData.filter((row) => {
        const curso_20horas = filter.curso_20horas
            ? String(row.curso_20horas) === String(filter.curso_20horas)
            : true;
        const diplomado_120horas = filter.diplomado_120horas
            ? String(row.diplomado_120horas) ===
              String(filter.diplomado_120horas)
            : true;
        const info_validada = filter.info_validada
            ? String(row.info_validada) === String(filter.info_validada)
            : true;

        return curso_20horas && diplomado_120horas && info_validada;
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
