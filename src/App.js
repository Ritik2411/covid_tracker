import axios from 'axios';
import { useEffect, useState } from 'react';
import './App.css';
import Infobox from './Components/Infobox';
import Linegraph from './Components/Linegraph';
import Map from './Components/Map';
import Table from './Components/Table';
import { prettyprintstat, sortData } from './Util';
import "leaflet/dist/leaflet.css"

function App() {

  const [countries,setCountries]  = useState([])
  const [country,setCountry] = useState('Worldwide')
  const [countryInfo,setcountryinfo] = useState({})
  const [tabledata,setTabledata] = useState([])
  const [mapcenter,setMapCenter] = useState({lat:34.80746,lng:-40.4796})
  const [zoom,setZoom] = useState(3)
  const [mapCountries,setmapCountries] = useState([])
  const [casetype,setcasetype] = useState('cases')

  useEffect(()=>{
    axios.get("https://disease.sh/v3/covid-19/all").then((data)=>{
      setcountryinfo(data.data)
    }).catch((err)=>{
      console.log(err)
    })
  },[])

  useEffect(()=>{
    const getCountriesData = async() => {
      await axios.get("https://disease.sh/v3/covid-19/countries").then((data)=>{
        const countries = data.data.map((country)=>({
          name:country.country,
          value:country.countryInfo.iso2
        }))
        const sortedData = sortData(data.data)
        setTabledata(sortedData)
        setCountries(countries)
        setmapCountries(data.data)
      }).catch((err)=>{
        console.log(err)
      })
    }

    getCountriesData()
  },[])

  const countryChange = async(e) => {
    const countryCode = e.target.value
    
    const url = (countryCode === 'Worldwide')?"https://disease.sh/v3/covid-19/all":`https://disease.sh/v3/covid-19/countries/${countryCode}`
    await axios.get(url).then((data)=>{
      setCountry(countryCode)
      setcountryinfo(data.data)
      
      setMapCenter([data.data.countryInfo.lat,data.data.countryInfo.long])
      setZoom(4)
    }).catch((err)=>{
      console.log(err)
    })
  }

  return (
    <div className="App">
      <div className="app_left">
        <div className="app_header">
          <h1 className="app_title">Covid Tracker</h1>
          <select onChange={countryChange}
            value={country}
            className="country_select"
          >
            <option value="Worldwide">Worldwide</option>
            {
              (countries !== [])?(
                countries.map((countries)=>(
                  <option value={countries.value}>
                    {countries.name}
                  </option>
                ))
              ):null
            }
          </select>
        </div>
            
        <div className="app_status">
            <Infobox 
              title="Coronavirus Cases" 
              cases={prettyprintstat(countryInfo.todayCases)} 
              total={prettyprintstat(countryInfo.cases)}
              onClick={(e)=>setcasetype('cases')}  
            />

            <Infobox 
              title="Recovered" 
              cases={prettyprintstat(countryInfo.todayRecovered)} 
              total={prettyprintstat(countryInfo.recovered)}
              onClick={(e)=>setcasetype('recovered')}
            />

            <Infobox 
              title="Deaths" 
              cases={prettyprintstat(countryInfo.todayDeaths)} 
              total={prettyprintstat(countryInfo.deaths)}
              onClick={(e)=>setcasetype('deaths')}
            />
        </div>    

        <div className="map_component">
            <Map center={mapcenter} zoom={zoom} countries={mapCountries} casesType={casetype}/>
        </div>
      </div>
      
      <div className="app_right">
          <h3>Live cases by country</h3>
          <Table countries={tabledata}/>
          <h3>Worldwide new {casetype}</h3>  
          <Linegraph caseType={casetype}/>
      </div>
    </div>
  );
}

export default App;
