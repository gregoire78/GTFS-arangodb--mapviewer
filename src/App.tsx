import Mapy from "./Mapy";
import "./App.css";
import LeftBar from "./LeftBar";
import { SetStateAction, useState } from "react";
import "@fontsource/ubuntu";

export interface StopsState {
    setStops?: SetStateAction<any>;
    stops?: any;
}

function App() {
    const [stops, setstops] = useState<any>();

    return (
        <div className="App">
            <Mapy setStops={setstops} />
            <LeftBar stops={stops} />
        </div>
    );
}

export default App;
