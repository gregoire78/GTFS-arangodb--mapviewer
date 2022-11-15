import { useState, useMemo } from "react";
import maplibregl from "maplibre-gl";
import axios from "axios";
import {
    FullscreenControl,
    GeoJSONSource,
    GeolocateControl,
    Layer,
    Map,
    Marker,
    NavigationControl,
    ScaleControl,
    Source,
} from "react-map-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import "./map.css";
import { StopsState } from "./App";
import Pin from "./Pin";
import rer from "./RER.svg";
import metro from "./metro.svg";
import train from "./train.svg";
import ter from "./terr.svg";
import bus from "./bus.svg";
import target from "./target.svg";
import tram from "./tram.svg";
import funi from "./funi.svg";

const API_KEY = import.meta.env.VITE_MAPTILER_KEY;

export default function Mapy({ setStops }: StopsState) {
    const [markers, setMarkers] = useState<Set<any> | null>(null);
    const [zoom, setZoom] = useState<number>(15);

    const getStops = async (lat: number, lng: number) => {
        const res = await axios.get(import.meta.env.VITE_API, {
            params: {
                lng,
                lat,
            },
        });
        setStops(res.data);
        return res.data;
    };

    const geocoding = async (lat: number, lng: number) => {
        const res = await axios.get(`https://api.maptiler.com/geocoding/${lng},${lat}.json?key=${API_KEY}`);
        return res.data;
    };

    const pins = useMemo(() => {
        if (!markers) return;
        return [...markers.values()].map((stop) => (
            <Marker
                key={`marker-${stop._key}`}
                longitude={stop.lon}
                latitude={stop.lat}
                anchor="bottom"
                onClick={(e) => {
                    // If we let the click event propagates to the map, it will immediately close the popup
                    // with `closeOnClick: true`
                    e.originalEvent.stopPropagation();
                    //setPopupInfo(city);
                }}
            >
                <div className="pin" style={{ cursor: "pointer" }} title={stop.name}>
                    {stop.routes.map((r: any, i: number) => {
                        switch (r.type) {
                            case 0:
                                return (
                                    <div key={i} style={{ display: "flex" }}>
                                        <img src={tram} height={25} />
                                        <div className="tram" style={{ borderBlock: `solid 4px ${r.color}` }}>
                                            {r.shortName}
                                        </div>
                                    </div>
                                );
                            case 1:
                                return (
                                    <div key={i} style={{ display: "flex" }}>
                                        <img src={metro} height={25} />
                                        <div className="metro" style={{ backgroundColor: r.color, color: r.textColor }}>
                                            {r.shortName}
                                        </div>
                                    </div>
                                );
                            case 2:
                                if (r.agency === "RER") {
                                    return (
                                        <div key={i} style={{ display: "flex" }}>
                                            <img src={rer} height={25} />
                                            <div className="rer" style={{ backgroundColor: r.color, color: r.textColor }}>
                                                {r.shortName}
                                            </div>
                                        </div>
                                    );
                                }
                                if (r.agency === "Transilien") {
                                    return (
                                        <div key={i} style={{ display: "flex" }}>
                                            <img src={train} height={25} />
                                            <div className="train" style={{ backgroundColor: r.color, color: r.textColor }}>
                                                {r.shortName}
                                            </div>
                                        </div>
                                    );
                                }
                                if (r.agency === "TER") {
                                    return <img key={i} src={ter} width={25} alt={stop.name} />;
                                }
                                break;
                            case 3:
                                return null;
                            //return <img key={i} className="bus" src={bus} height={20} alt={stop.name} />;
                            case 7:
                                return <img key={i} src={funi} width={25} alt={stop.name} />;
                            default:
                                return <Pin key={i} />;
                        }
                    })}
                </div>
            </Marker>
        ));
    }, [markers]);

    return (
        <div className="map-wrap">
            <Map
                mapLib={maplibregl}
                initialViewState={{
                    latitude: 48.870440981418454,
                    longitude: 2.31674525603746,
                    zoom: zoom,
                    bearing: 0,
                    pitch: 0,
                }}
                mapStyle={`https://api.maptiler.com/maps/openstreetmap/style.json?key=${API_KEY}`}
                onLoad={async (e) => {
                    const { lat, lng } = e.target.getCenter();
                    const stops = await getStops(lat, lng);
                    setMarkers(stops);
                }}
                onZoomEnd={(z) => setZoom(z.target.getZoom())}
                onMoveEnd={async (e) => {
                    if (!markers) {
                        return;
                    }
                    const { lat, lng } = e.target.getCenter();
                    const stops = await getStops(lat, lng);
                    setMarkers(stops);
                }}
                onClick={(event) => {
                    if (!event.features) return;
                    const feature = event.features[0];
                    if (!feature) return;
                    const clusterId = feature.properties?.cluster_id;

                    const mapboxSource = event.target.getSource("earthquakes") as GeoJSONSource;

                    mapboxSource.getClusterExpansionZoom(clusterId, (err, zoom) => {
                        if (err) {
                            return;
                        }
                        event.target.easeTo({
                            center: feature.geometry.coordinates,
                            zoom,
                            duration: 500,
                        });
                    });
                }}
                interactiveLayerIds={["clusters"]}
            >
                <GeolocateControl position="top-right" />
                <FullscreenControl position="top-right" />
                <NavigationControl position="top-right" />
                <ScaleControl />
                {pins}
                {markers && (
                    <Source
                        id="earthquakes"
                        type="geojson"
                        data={
                            markers && {
                                type: "FeatureCollection",
                                features: [...markers].map((s: any) => {
                                    return {
                                        type: "Feature",
                                        properties: { id: s._key, name: s.name },
                                        geometry: { type: "Point", coordinates: [s.lon, s.lat, 0.0] },
                                    };
                                }),
                            }
                        }
                        cluster={true}
                        clusterMaxZoom={14}
                        clusterRadius={50}
                    >
                        <Layer
                            {...{
                                id: "clusters",
                                type: "circle",
                                source: "earthquakes",
                                filter: ["has", "point_count"],
                                paint: {
                                    //"circle-color": ["step", ["get", "point_count"], "#51bbd6", 5, "#f1f075", 10, "#f28cb1"],
                                    "circle-color": "#51bbd6",
                                    "circle-stroke-width": 1,
                                    "circle-stroke-color": "#fff",
                                    "circle-radius": ["step", ["get", "point_count"], 10, 100, 15, 750, 20],
                                },
                            }}
                        />
                        <Layer
                            {...{
                                id: "cluster-count",
                                type: "symbol",
                                source: "earthquakes",
                                filter: ["has", "point_count"],
                                layout: {
                                    "text-field": "{point_count_abbreviated}",
                                    "text-font": ["Ubuntu"],
                                    "text-size": 12,
                                },
                            }}
                        />
                        <Layer
                            {...{
                                id: "unclustered-point",
                                type: "circle",
                                source: "earthquakes",
                                filter: ["!", ["has", "point_count"]],
                                paint: {
                                    "circle-color": "#11b4da",
                                    "circle-radius": 4,
                                    "circle-stroke-width": 1,
                                    "circle-stroke-color": "#fff",
                                },
                            }}
                        />
                        <Layer
                            {...{
                                id: "unclustered-point-text",
                                type: "symbol",
                                source: "earthquakes",
                                filter: ["!", ["has", "point_count"]],
                                layout: {
                                    "text-anchor": "top",
                                    "text-field": "{name}",
                                    "text-font": ["Ubuntu"],
                                    "text-size": 10,
                                    "text-offset": [0, 0.5],
                                },
                            }}
                        />
                    </Source>
                )}
            </Map>
            <div
                style={{
                    pointerEvents: "none",
                    flex: 1,
                    width: "100%",
                    height: "100%",
                    position: "absolute",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "transparent",
                    top: 0,
                    display: "flex",
                }}
            >
                <img src={target} />
            </div>
        </div>
    );
}
