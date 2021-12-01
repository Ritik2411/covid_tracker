import numeral from "numeral"
import { Circle, Popup } from "react-leaflet"

const casesTypeColors = {
    cases:{
        hex:"#CC1034",
        multiplier:300
    },
    recovered:{
        hex:"#7dd71d",
        multiplier:400
    },
    deaths:{
        hex:"#fb4443",
        multiplier:1000
    }
}

export const sortData = (data) => {
    const sortedData = [...data]
    sortedData.sort((a,b)=>{
        if(a.cases>b.cases){
            return -1
        }
        else{
            return 1
        }
    })
    return sortedData
}

export const prettyprintstat = (stat) => (
    stat?`+${numeral(stat).format("0.0a")}`:`+0`
)

export const showDataOnMap = (data,casesType) => (
    data.map((country)=>(
        <Circle
            pathOptions={{
                color:casesTypeColors[casesType].hex,
                fillColor:casesTypeColors[casesType].hex
            }}
            center={[country.countryInfo.lat,country.countryInfo.long]}
            fillOpacity={0.4}
            
            radius={
                Math.sqrt(country[casesType]) * casesTypeColors[casesType].multiplier
            }
        >
            <Popup>
                <div className="info_container">
                    <div style={{backgroundImage:`url(${country.countryInfo.flag})`}} className="info_flag"/>
                    <div className="info_country">{country.country}</div>
                    <div className="info_cases">Cases: {numeral(country.cases).format("0,0")}</div>
                    <div className="info_recovered">Recovered: {numeral(country.recovered).format("0,0")}</div>
                    <div className="info_deaths">Deaths: {numeral(country.deaths).format("0,0")}</div>
                </div>
            </Popup>
        </Circle>
    ))
)
