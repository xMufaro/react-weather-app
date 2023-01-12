import './App.css'
import { FormEvent, useState } from 'react';
import { MdErrorOutline } from "react-icons/md"
import { AiOutlineArrowDown, AiOutlineArrowUp } from "react-icons/ai"
import day from "./assets/day.jpg"
import night from "./assets/night.jpg"

const baseURi = "http://api.weatherapi.com/v1";
const apiKey = "e965ed607d7744038fd151533231101"

function App() {
  const [data, setData] = useState<any>();
  const [hasExpanded, setHasExpanded] = useState<boolean>(false);
  const [hasQueried, setHasQueried] = useState<boolean>(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = Object.fromEntries(new FormData(e.currentTarget));
    const query = formData.query as string;
    await fetch(`${baseURi}/current.json?key=${apiKey}&q=${query}`, {
      method: "GET"
    }).then(async (res) => await res.json()).then((res) => {
      setData(res)
    });
    setHasQueried(true)
  } 

  return (
    <div className="App">
      <div className='App-background'>
        <img src={data?.current?.is_day === 1 ? day : night} alt="" className={data?.current?.is_day === 1 ? "light_theme" : "dark-theme"} />
      </div>
      <div className='App-content'>
      <form className='location-form' onSubmit={(e) => onSubmit(e)}>
        <input type="text" name="query" placeholder="Your city" />
        <button type="submit">Search</button>
      </form>
      {hasQueried && (
        data.error ? (
        <div className='fetching-error'>
          <MdErrorOutline size={40} />
          <p>{data.error.code}: {data.error.message}</p>
        </div>
        ) : (
          <div className='fetched-data'>
            <div className="city-header-data">
              <h1>{data.location?.name}, {data.location.country}</h1>
              <p>Local time - {data.location.localtime}</p>
              <button onClick={() => setHasExpanded(!hasExpanded)} className='additional-city-data__expander'>
                <div>
                 <p>Show additional city data</p>
                 {hasExpanded ? <AiOutlineArrowUp className='arrow'/> : <AiOutlineArrowDown className='arrow' />}
                </div>
              </button>
              {hasExpanded && (
                <div className="additional-city-data">
                  <div>
                    <p>Timezone</p>
                    <p>{data.location.tz_id}</p>
                  </div>
                  <div>
                    <p>Latitude</p>
                    <p>{data.location.lat}</p>
                  </div>
                  <div>
                    <p>Longitude</p>
                    <p>{data.location.lon}</p>
                  </div>
                </div>
              )}
            </div>
            <div className='weather-data'>
                <div className="weather-data-content">
                <div className='basic-info'>
                  <img src={data.current?.condition.icon} alt="" />
                  <h2>{Math.floor(data.current?.temp_c)}°C</h2>
                  <p>{data.current?.condition.text}</p>
                </div>
                <div className='advanced-info'>
                  <div>
                    <p>Feels like</p>
                    <p>{Math.floor(data.current?.feelslike_c)}°C</p>
                  </div>
                  <div>
                    <p>Wind</p>
                    <p>{data.current?.wind_kph} kph</p>
                  </div>
                  <div>
                    <p>Wind Direction</p>
                    <p>{data.current?.wind_dir}</p>
                  </div>
                  <div>
                    <p>Clouds</p>
                    <p>{data.current?.cloud}%</p>
                  </div>
                  <div>
                    <p>Humidity</p>
                    <p>{data.current?.humidity}%</p>
                  </div>
                  <div>
                    <p>Pressure</p>
                    <p>{data.current?.pressure_mb} mb</p>
                  </div>
                </div>
                </div>
                
            </div>
          </div>
        )
      )}
      </div>
      
    </div>
  )
}

export default App
