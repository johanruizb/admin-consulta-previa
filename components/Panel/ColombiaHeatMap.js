// import {
//     ComposableMap,
//     Geographies,
//     Geography,
//     ZoomableGroup,
// } from "react-simple-maps";
// import { scaleSequential } from "d3-scale";
// import { useState } from "react";

// const ColombiaHeatMap = ({ data }) => {
//     const [position, setPosition] = useState({ coordinates: [0, 0], zoom: 1 });

//     function handleZoomIn() {
//         if (position.zoom >= 4) return;
//         setPosition((pos) => ({ ...pos, zoom: pos.zoom * 2 }));
//     }

//     function handleZoomOut() {
//         if (position.zoom <= 1) return;
//         setPosition((pos) => ({ ...pos, zoom: pos.zoom / 2 }));
//     }

//     function handleMoveEnd(position) {
//         setPosition(position);
//     }

//     return (
//         <div>
//             <ComposableMap zoomAndPan>
//                 <ZoomableGroup
//                     zoom={position.zoom}
//                     center={position.coordinates}
//                     onMoveEnd={handleMoveEnd}
//                 >
//                     <Geographies geography="/Colombia_departamentos_poblacion.geojson">
//                         {({ geographies }) =>
//                             geographies.map((geo) => (
//                                 <Geography
//                                     key={geo.rsmKey}
//                                     geography={geo}
//                                     // fill={colorScale(data[geo.properties.NAME] || 0)}
//                                 />
//                             ))
//                         }
//                     </Geographies>
//                 </ZoomableGroup>
//             </ComposableMap>
//         </div>
//     );
// };

// export default ColombiaHeatMap;

import { useState } from "react";
import {
    ComposableMap,
    Geographies,
    Geography,
    ZoomableGroup,
} from "react-simple-maps";

const ColombiaHeatMap = () => {
    const [position, setPosition] = useState({
        coordinates: [-73.1965095953676, 4.41593657055012],
        zoom: 8,
    });

    function handleZoomIn() {
        if (position.zoom >= 4) return;
        setPosition((pos) => ({ ...pos, zoom: pos.zoom * 2 }));
    }

    function handleZoomOut() {
        if (position.zoom <= 1) return;
        setPosition((pos) => ({ ...pos, zoom: pos.zoom / 2 }));
    }

    function handleMoveEnd(position) {
        setPosition(position);
    }

    console.log(position);

    return (
        <div>
            <ComposableMap>
                <ZoomableGroup
                    zoom={position.zoom}
                    center={position.coordinates}
                    onMoveEnd={handleMoveEnd}
                >
                    <Geographies geography="https://raw.githubusercontent.com/jacasta2/colombian_map/refs/heads/main/existing_topojson_map/departamentos31686813089148425.json">
                        {({ geographies }) =>
                            geographies.map((geo) => (
                                <Geography key={geo.rsmKey} geography={geo} />
                            ))
                        }
                    </Geographies>
                </ZoomableGroup>
            </ComposableMap>
            <div className="controls">
                <button onClick={handleZoomIn}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="3"
                    >
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                </button>
                <button onClick={handleZoomOut}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="3"
                    >
                        <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default ColombiaHeatMap;
