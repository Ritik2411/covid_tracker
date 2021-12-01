import React from 'react'
import {MapContainer as LeafletMap, TileLayer, useMap} from 'react-leaflet'
import "leaflet/dist/leaflet.css"
import "./Map.css"
import { showDataOnMap } from '../Util'


function Map({countries,center,zoom,casesType}) {
    
    const ChangeView = ({ center, zoom }) => {
        const map = useMap()
        map.setView(center,zoom)
        return null
    }

    console.log(countries)

    return (
        <div className="map_container">
            <LeafletMap center={center} zoom={zoom}>
                <ChangeView center={center} zoom={zoom}/>
                <TileLayer 
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* To get Circles */}
                {showDataOnMap(countries,casesType)}
            </LeafletMap>
        </div>
    )
}

export default Map
