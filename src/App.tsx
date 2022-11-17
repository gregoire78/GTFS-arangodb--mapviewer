import Mapy from "./Mapy";
import "./App.css";
import LeftBar from "./LeftBar";
import { SetStateAction, useState } from "react";
import "@fontsource/ubuntu";
import { MapProvider } from "react-map-gl";

export interface StopsState {
    setStops?: SetStateAction<any>;
    stops?: any;
}

function App() {
    const [stops, setstops] = useState<any>();
    const [popup, setPopup] = useState<any>();

    return (
        <div className="App">
            <MapProvider>
                <Mapy setStops={setstops} />
                <LeftBar stops={stops} />
            </MapProvider>
        </div>
    );
}

export default App;
