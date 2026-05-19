import './App.css'
import {useEffect, useState} from "react";

function App(){
  const[satellites, setSatellites] = useState([]);
  const[limit, setLimit] = useState(10)

    useEffect(() => {
        fetch(`http://127.0.0.1:8000/satellites?limit=${limit}`)
            .then((response) => response.json())
            .then((data) => {
                console.log(data)
                setSatellites(data)
            })
    }, [limit]);
  return(
      <div>
        <h1>AstroDebris</h1>
          <p>Satellites Visible: {limit}</p>
          <input
              type = "range"
              min = "1"
              max = "300"
              value = {limit}
              onChange = {(e) => setLimit(e.target.value)}
          />
        <ul>
            {satellites.map((satellite,index) =>
            <li key = {index}>
                <br />
                {satellite.name}
                <br />
                latitude: {satellite.latitude}
                <br />
                longitude: {satellite.longitude}
                <br />
                altitude: {satellite.altitude}
            </li>
                )}
        </ul>
      </div>
  );
}

export default App;



