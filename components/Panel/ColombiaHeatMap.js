import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { scaleSequential } from "d3-scale";

const ColombiaHeatMap = ({ data }) => {
    return (
        <ComposableMap
            projectionConfig={{
                rotate: [-10.0, -53.0, 0],
                scale: 2,
            }}
        >
            <Geographies geography="/Colombia_departamentos_poblacion.geojson">
                {({ geographies }) =>
                    geographies.map((geo) => {
                        console.log(geo);
                        return (
                            <Geography
                                zoomAndPan=""
                                key={geo.rsmKey}
                                geography={geo}
                                // fill={colorScale(data[geo.properties.NAME] || 0)}
                            />
                        );
                    })
                }
            </Geographies>
        </ComposableMap>
    );
};

export default ColombiaHeatMap;
