import axios from "axios";
import React, { useState } from "react";
import TripInfo from "./TripInfo";
import "./StopInfo.css";
import rer from "./RER.svg";
import metro from "./metro.svg";
import train from "./train.svg";
import ter from "./terr.svg";
import bus from "./bus.svg";
import tram from "./tram.svg";
import funi from "./funi.svg";
import { useMap } from "react-map-gl";

export default function StopInfo({ stop, date }: any) {
    const [trips, setTrips] = useState<any>();
    const handleTrips = async (stopId: string) => {
        const res = await axios.get(`http://localhost:8080/${stopId}/trips`, {
            params: {
                date,
            },
        });
        setTrips(res.data);
        return res.data;
    };
    const { myMap } = useMap();

    const onClick = () => {
        if (!myMap) return;
        myMap.flyTo({ center: [stop.lon, stop.lat], zoom: 16 });
    };

    const type = (t: number, agency: string) => {
        switch (t) {
            case 0:
                return <img src={tram} className="logo" />;
            case 1:
                return <img src={metro} className="logo" />;
            case 2:
                if (agency === "RER") {
                    return <img src={rer} className="logo" />;
                }
                if (agency === "Transilien") {
                    return <img src={train} className="logo" />;
                }
                if (agency === "TER") {
                    return <img src={ter} className="logo" />;
                }
                break;
            case 3:
                return <img src={bus} className="logo" />;
            case 7:
                return <img src={funi} className="logo" />;
            default:
                break;
        }
    };
    return (
        <div className="stop">
            <button className="button-target" title="voler vers le point" onClick={onClick}>
                go
            </button>
            <button className="button-route" onClick={async () => handleTrips(stop._key)}>
                {stop.name}
                <div className="routes">
                    {stop.routes.map((r: any, i: number) => (
                        <p
                            key={i}
                            className="route"
                            style={{
                                backgroundColor: r.color,
                                color: r.textColor,
                            }}
                        >
                            {type(r.type, r.agency)} {r.shortName}
                        </p>
                    ))}
                </div>
            </button>
            <div>{trips && trips.map((trip: any) => <TripInfo key={trip.id} trip={trip} stop={stop} />)}</div>
        </div>
    );
}
