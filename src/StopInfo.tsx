import axios from "axios";
import React, { useState } from "react";
import TripInfo from "./TripInfo";

export default function StopInfo({stop, date}: any) {
    const [trips, setTrips] = useState<any>()
    const handleTrips = async (stopId: string) => {
        const res = await axios.get(`http://localhost:8080/${stopId}/trips`, {
            params: {
                date
            }
        })
        setTrips(res.data)
        return res.data
    }
    return (
        <div>
            <button style={{fontSize: 20, width: '100%'}} onClick={async () => handleTrips(stop._key)}>{stop.name}</button>
            {trips && trips.map((trip: any) => (
                <TripInfo key={trip.id} trip={trip} stop={stop} />
            ))}
        </div>
    )
}
