import axios from "axios";
import React, { useState } from "react";
import TripInfo from "./TripInfo";
import "./StopInfo.css";

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
    return (
        <div>
            <button
                style={{
                    fontSize: 15,
                    width: "100%",
                    border: "none",
                    marginBlockStart: 5,
                }}
                onClick={async () => handleTrips(stop._key)}
            >
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
                            {r.agency} {r.shortName}
                        </p>
                    ))}
                </div>
            </button>
            {trips && trips.map((trip: any) => <TripInfo key={trip.id} trip={trip} stop={stop} />)}
        </div>
    );
}
