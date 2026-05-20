import { useEffect, useRef } from "react";
import { Viewer, Ion, Cartesian3, Color } from "cesium";
import "cesium/Build/Cesium/Widgets/widgets.css";

Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIyMjRkYjRjZi0yZGZhLTQ3ZTUtYjdiNS03ZmNhOTZjOTMxYTAiLCJpZCI6NDMzNjU4LCJpc3MiOiJodHRwczovL2lvbi5jZXNpdW0uY29tIiwiYXVkIjoidW5kZWZpbmVkX2RlZmF1bHQiLCJpYXQiOjE3NzkyMTUxMDl9.OQwYsdCd3dsftQGZHJVU5hi-rXq3PB9kSwuWezfAOd8"

function Globe({ satellites = [] }) {
    const cesiumContainer = useRef(null);
    const viewerRef = useRef(null);

    useEffect(() => {
        viewerRef.current = new Viewer(cesiumContainer.current, {
            animation: false,
            timeline: false,
            baseLayerPicker: false,
            geocoder: false,
            homeButton: false,
            sceneModePicker: false,
            navigationHelpButton: false,
            fullscreenButton: false,
            });

        return () => {
            if (viewerRef.current && !viewerRef.current.isDestroyed()) {
                viewerRef.current.destroy();
            }
        };
    }, []);

    useEffect(() => {
        const viewer = viewerRef.current;

        if (!viewer) return;

        viewer.entities.removeAll();

        satellites.forEach((satellite) => {
            viewer.entities.add({
                name: satellite.name,

                description: `
                    <div style="
                        background: #050816;
                        color: #ffffff;
                        padding: 14px;
                        font-family: Arial, sans-serif;
                        border: 1px solid cyan;
                        box-shadow: 0 0 12px cyan;
                    ">

                    <h2 style="
                    color: cyan;
                    margin-top: 0;
                    ">
                    ${satellite.name}
                    </h2>

                    <p style="color:white;"><b>Name:</b> ${satellite.name}</p>
                    <p style="color:white;"><b>Type:</b> ${satellite.type}</p>
                    <p style="color:white;"><b>NORAD ID:</b> ${satellite.norad_id}</p>
                    <p style="color:white;"><b>Altitude:</b> ${satellite.altitude.toFixed(2)} km</p>
                    <p style="color:white;"><b>Latitude:</b> ${satellite.latitude.toFixed(2)}</p>
                    <p style="color:white;"><b>Longitude:</b> ${satellite.longitude.toFixed(2)}</p>

                   </div>
`,

                position: Cartesian3.fromDegrees(
                    satellite.longitude,
                    satellite.latitude,
                    satellite.altitude * 1000
                ),
                point: {
                    pixelSize: 5,
                    color:
                    satellite.type === "PAYLOAD"
                    ? Color.LIME
                    : satellite.type === "ROCKET BODY"
                    ? Color.ORANGE
                    : satellite.type === "DEBRIS"
                    ? Color.RED
                    : Color.WHITE,
                },
            });
        });
    }, [satellites]);

    return (
        <div
            ref={cesiumContainer}
            style={{
                width: "100vw",
                height: "100vh",
            }}
        />
    );
}

export default Globe;