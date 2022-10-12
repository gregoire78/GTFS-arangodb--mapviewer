import Map from './Map'
import './App.css'
import LeftBar from './LeftBar'
import { SetStateAction, useState } from 'react'

export interface StopsState {
  setStops?: SetStateAction<any>,
  stops?: any
}

function App() {

  const [stops, setstops] = useState<any>()

  return (
    <div className="App">
      <Map setStops={setstops} />
      <LeftBar stops={stops} />
    </div>
  )
}

export default App
