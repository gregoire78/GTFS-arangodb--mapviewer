import axios from "axios";
import React, { useState } from "react";

export default function TripInfo({ trip, stop }: any) {
    const [stopTimes, seStopTimes] = useState<any>();
    const handleStopTimes = async (tripId: string) => {
        const res = await axios.get(`http://localhost:8080/${tripId}/stopTimes`);
        seStopTimes(res.data);
        return res.data;
    };
    return (
        <div>
            <div style={{ backgroundColor: trip.color, color: trip.textColor }}>
                {trip.longName} - {trip.service}
            </div>
            <button style={{ fontSize: 14, width: "100%" }} onClick={async () => handleStopTimes(trip.id)}>
                {trip.headsign}
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
