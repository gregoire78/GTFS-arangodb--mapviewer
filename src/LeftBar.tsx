import axios from "axios"
import { useCallback, useEffect, useState } from "react"
import { StopsState } from "./App"
import './leftBar.css'
import StopInfo from "./StopInfo"
import { DateTime } from 'luxon'


export default function LeftBar({ stops }: StopsState) {

  const [date, setDate] = useState<string>(DateTime.now().toISODate())

  const geocoding =  useCallback(async (lat: number, lng: number) => {
    const res = await axios.get(`https://api-adresse.data.gouv.fr/reverse/?lon=${lng}&lat=${lat}&type=street`)
    console.log(res.data)
    return res.data
  }, [])

  useEffect(() => {
    if(stops) {
      stops.map((stop: any) => {
        //geocoding(stop.lat, stop.lon)
      })
    }
  }, [stops, geocoding])

  return (
    <div className="left-bar">
      <input defaultValue={date} onChange={(e) => setDate(e.target.value)} type={"date"} />
      {stops && stops.map((stop: any) => (
        <StopInfo stop={stop} key={stop._key} date={date} />
      ))}
    </div>
  )
}
