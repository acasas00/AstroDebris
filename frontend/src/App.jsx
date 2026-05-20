import './App.css'
import Globe from './components/Globe.jsx'
import {useEffect, useState} from "react";

function App(){
    const [satellites, setSatellites] = useState([]);
    const [limit, setLimit] = useState(1000);
    const [showPayloads, setShowPayloads] = useState(true);
    const [showRocketBodies, setShowRocketBodies] = useState(true);
    const [showDebris, setShowDebris] = useState(true);

    const filteredSatellites = satellites.filter((satellite) => {
    if (!satellite || !satellite.type) {return false;}
    if (satellite.type === "PAYLOAD" && showPayloads) {return true;}
    if (satellite.type === "ROCKET BODY" && showRocketBodies) {return true;}
    if (satellite.type === "DEBRIS" && showDebris) {return true;}
    return false;}
    );


    useEffect(() => {
        fetch(`http://127.0.0.1:8000/satellites`)
            .then((response) => response.json())
            .then((data) => {
                console.log(data)
                setSatellites(data)
            })
    }, []);

    const toggleStyle = {
        marginRight: "15px",
        color: "white",
        fontSize: "18px",
    }
  return(
      <div className="page-header">
        <h1 className="title">AstroDebris</h1>
          <div className="globe-container">

          <Globe satellites = {filteredSatellites.slice(0,limit)} />
              <div className="slider-container">
                <p style={{ color: "white", fontSize: "18px" }}>
                Satellites Visible:

                <input
                type="number"
                min="1"
                max={filteredSatellites.length}
                value={limit}
                onChange={(e) => {
                const value = Number(e.target.value);

                if (value >= 1 && value <= filteredSatellites.length) {
                setLimit(value);
                }
            }}
                style={{
                    width: "90px",
                    marginLeft: "10px",
                    marginRight: "10px",
                    background: "#111",
                    color: "white",
                    border: "1px solid cyan",
                    padding: "4px",
                    fontSize: "16px",
                }}
                />

                / {filteredSatellites.length}
                </p>

                <div style = {{padding: "10px"}}>
                  <label style={toggleStyle}>
                    <input
                    type="checkbox"
                    checked={showPayloads}
                    onChange={() => setShowPayloads(!showPayloads)}
                    />
                    Payloads
                </label>

                <label style={toggleStyle}>
                    <input
                    type="checkbox"
                    checked={showRocketBodies}
                    onChange={() => setShowRocketBodies(!showRocketBodies)}
                    />
                Rocket Bodies
                </label>

                <label style={toggleStyle}>
                    <input
                    type="checkbox"
                    checked={showDebris}
                    onChange={() => setShowDebris(!showDebris)}
                    />
                Debris
                </label>
                </div>
              </div>
          </div>
      </div>
  );
}

export default App;

