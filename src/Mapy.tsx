import { useState, useMemo } from "react";
import maplibregl from "maplibre-gl";
import axios from "axios";
import { FullscreenControl, GeolocateControl, Map, Marker, NavigationControl, ScaleControl } from "react-map-gl";
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

const API_KEY = import.meta.env.VITE_MAPTILER_KEY;

export default function Mapy({ setStops }: StopsState) {
    const [markers, setMarkers] = useState<Set<any> | null>(null);

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
                {stop.routes.map((r: any, i: number) => {
                    switch (r.type) {
                        case 1:
                            return <img key={i} src={metro} height={25} />;
                        case 2:
                            if (r.agency === "RER") {
                                return <img key={i} src={rer} height={25} />;
                            }
                            if (r.agency === "Transilien") {
                                return <img key={i} src={train} height={25} />;
                            }
                            if (r.agency === "TER") {
                                return <img key={i} src={ter} width={25} />;
                            }
                            break;
                        case 3:
                            return <img key={i} src={bus} height={25} />;
                        default:
                            return <Pin key={i} />;
                    }
                })}
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
                    zoom: 15,
                    bearing: 0,
                    pitch: 0,
                }}
                mapStyle={`https://api.maptiler.com/maps/openstreetmap/style.json?key=${API_KEY}`}
                onLoad={async (e) => {
                    const { lat, lng } = e.target.getCenter();
                    const stops = await getStops(lat, lng);
                    setMarkers(stops);
                }}
                onMoveEnd={async (e) => {
                    if (!markers) {
                        return;
                    }
                    const { lat, lng } = e.target.getCenter();
                    const stops = await getStops(lat, lng);
                    setMarkers(stops);
                }}
            >
                <GeolocateControl position="top-right" />
                <FullscreenControl position="top-right" />
                <NavigationControl position="top-right" />
                <ScaleControl />
                {pins}
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
