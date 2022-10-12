import { useRef, useState, useEffect, useCallback } from 'react'
import maplibregl, { Marker } from 'maplibre-gl'
import axios from "axios"

import 'maplibre-gl/dist/maplibre-gl.css'
import './map.css'
import { StopsState } from './App'

export default function Map({ setStops }: StopsState) {
    const mapContainer = useRef<any>()
    const map = useRef<any>()
    const [markers, setMarkers] = useState<Marker[] | null>(null)
    const API_KEY = import.meta.env.VITE_MAPTILER_KEY

    const getStops = async (lat: number, lng: number) => {
        const res = await axios.get(import.meta.env.VITE_API, {
            params: {
                lng,
                lat
            }
        })
        setStops(res.data)
        return res.data
    }

    const geocoding = async (lat: number, lng: number) => {
        const res = await axios.get(`https://api.maptiler.com/geocoding/${lng},${lat}.json?key=${API_KEY}`)
        return res.data
    }

    const setMarkerStops = useCallback(async (lat: number, lng: number) => {
        if(map.current) {
            let markertoAdd: Marker[] = []
            const stops: any[] = await getStops(lat, lng)
            for (const stop of stops) {
                const m = new maplibregl.Marker({color: "#FF0000"})
                    .setLngLat([stop.lon,stop.lat])
                    .setPopup(new maplibregl.Popup().setHTML(`
                        <p>${stop.name}</p>
                        <p>${stop._key}</p>
                    `))
                    .addTo(map.current)
                markertoAdd.push(m)
            }
            setMarkers(markertoAdd)
        }
    }, [])

    useEffect(() => {
        if(map.current && markers) {
            map.current.once('moveend', async () => {
                const {lat, lng} = map.current.getCenter()
                const stops: any[] = await getStops(lat, lng)
                const toRemove = markers.filter(m => {
                    const lnglat = m.getLngLat()
                    for (const stop of stops) {
                        if(stop.lon === lnglat.lng && stop.lat === lnglat.lat) {
                            return false
                        }
                    }
                    return true
                })
                for (const marker of toRemove) {
                    marker.remove()
                }
                const toAdd = stops.filter(stop => {
                    for (const marker of markers) {
                        const lnglat = marker.getLngLat()
                        if(stop.lon === lnglat.lng && stop.lat === lnglat.lat) {
                            return false
                        }
                    }
                    return true
                })
                let newMarkers: Marker[] = []
                for (const stop of toAdd) {
                    const m = new maplibregl.Marker({color: "#FF0000"})
                        .setLngLat([stop.lon,stop.lat])
                        .setPopup(new maplibregl.Popup().setHTML(`
                            <p>${stop.name}</p>
                        `))
                        .addTo(map.current)
                    newMarkers.push(m)
                }
                setMarkers([...markers.filter(m => {
                    for (const r of toRemove) {
                        if(r.getLngLat().lng === m.getLngLat().lng &&r.getLngLat().lat === m.getLngLat().lat) {
                            return false
                        }
                    }
                    return true
                }), ...newMarkers])
            })
        }
    }, [markers, map.current])

    useEffect(() => {
        if (map.current) return
        map.current = new maplibregl.Map({
            container: mapContainer.current,
            style: `https://api.maptiler.com/maps/openstreetmap/style.json?key=${API_KEY}`,
            center: [1.871324, 48.892713],
            zoom: 14
        })
        map.current.addControl(new maplibregl.NavigationControl({
            showZoom: true
        }), 'top-right')
        setMarkerStops(48.892713, 1.871324)
      }, [setMarkerStops])
    
    return (
        <div className="map-wrap">
            <div ref={mapContainer} className="map" />
        </div>
    )
}
