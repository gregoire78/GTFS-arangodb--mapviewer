import axios from "axios";
import React, { useState } from "react";
import "./tripInfo.css";

export default function TripInfo({ trip, stop }: any) {
    const [stopTimes, seStopTimes] = useState<any>();
    const handleStopTimes = async (tripId: string) => {
        const res = await axios.get(`http://localhost:8080/${tripId}/stopTimes`);
        seStopTimes(res.data);
        return res.data;
    };
    return (
        <div>
            <button
                className="button-trip"
                style={{ backgroundColor: trip.color, color: trip.textColor }}
                onClick={async () => handleStopTimes(trip.id)}
            >
                {trip.departureTime.slice(0, -3)} - {trip.longName} - {trip.service} - {trip.headsign}
            </button>
            <div style={{ display: "grid", justifyContent: "center" }}>
                {stopTimes &&
                    stopTimes.map((st: any) => (
                        <div
                            key={st._id}
                            style={{
                                display: "flex",
                                backgroundColor: st.stopId === stop._key ? "yellow" : "inherit",
                            }}
                        >
                            <div style={{ marginRight: 10 }}>{st.departureTime}</div>
                            <div>{st.stopName}</div>
                        </div>
                    ))}
            </div>
        </div>
    );
}
