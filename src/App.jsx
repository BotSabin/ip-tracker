import { useState, useRef, useEffect } from "react";
import { IoIosArrowForward } from "react-icons/io";
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import "leaflet/dist/leaflet.css"

import iconLocation from '../public/icon-location.svg'

function App() {
  const [ipInfo, setIpInfo] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const mapRef = useRef(null);

  const handleSubmit = async () => {
    try {
      // Fetching the IP address
      const response = await fetch("https://api.ipify.org");
      const ip = await response.text();
      
      // Set the input value to the fetched IP
      setInputValue(ip);
      
      // Fetching location information based on the IP address
      const locationResponse = await fetch(`https://geo.ipify.org/api/v2/country,city?apiKey=at_gQVWx1NcHIS8DBxsbO8Yqqj6Nd1vF&ipAddress=${ip}`);
      const locationData = await locationResponse.json();
      setIpInfo(locationData);
      
      // Show location on the map if valid coordinates are received
      if (locationData && locationData.location && typeof locationData.location.lat === 'number' && typeof locationData.location.lng === 'number') {
        showLocationOnMap(locationData.location.lat, locationData.location.lng);
      } else {
        console.error("Invalid latitude or longitude data received:", locationData);
      }
    } catch (error) {
      console.error("Error fetching IP information: ", error);
    }
  };

  // useEffect(() => {
  //   handleSubmit();
  // }, []);
  

  useEffect(() => {
    const customIcon = L.icon({
      iconUrl: iconLocation,
      iconSize: [32, 32],
      iconAnchor: [16, 32]
    });
    L.Marker.prototype.options.icon = customIcon;
  }, []);
  
  const showLocationOnMap = (lat, lng) => {
    const map = mapRef.current;
    if (map && typeof lat === 'number' && typeof lng === 'number') {
      map.setView([lat, lng], 13);
    }
  };

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  

  return (
    <main className="w-full max-w-[1440px] mx-auto font-rubik">
      <picture className="w-full">
        <source srcSet="bg-pattern-desktop.png" media="(min-width: 768px)" className="" />
        <img src="bg-pattern-mobile.png" alt="" className="w-full h-full" />
      </picture>
      <section className="absolute top-0 left-0 w-full z-index-[1000]">
        <h1 className="text-white text-2xl md:text-3xl font-normal text-center py-8">IP Address Tracker</h1>
        <div className="flex flex-col px-5 gap-y-5 relative">
          <div className="flex items-center h-12 w-full md:max-w-[500px] mx-auto">
            <input
              type="text"
              placeholder="Search for any IP address or domain"
              value={inputValue}
              onChange={handleInputChange}
              className="h-full w-full rounded-l-lg px-4 text-[18px] outline-none"
            />
            <button
              onClick={handleSubmit}
              className="bg-black text-white text-xl h-full items-center justify-center flex px-4 rounded-r-lg
              hover:bg-verydark transition-colors duration-300"
            >
              <IoIosArrowForward />
            </button>
          </div>
          {ipInfo && (
            <div className="bg-white w-full md:max-w-[1100px] flex flex-col
             md:flex-row items-center text-center md:text-start md:justify-between
              mx-auto rounded-lg md:divide-x gap-y-5 md:absolute top-24 z-10 left-1/2 md:-translate-x-1/2 
              py-10 px-6">
              <div className="md:flex md:flex-col md:gap-y-2 md:px-8">
                <p className="uppercase text-darkgray font-bold text-[.675rem] md:text-[.75rem] tracking-widest">ip address</p>
                <span className="text-xl text-verydark font-medium md:text-2xl">{ipInfo.ip}</span>
              </div>
              <div className="md:flex md:flex-col md:gap-y-2 md:px-8">
                <p className="uppercase text-darkgray font-bold text-[.675rem] md:text-[.75rem] tracking-widest">location</p>
                <span className="text-xl text-verydark font-medium md:text-2xl">{`${ipInfo.location.region}, ${ipInfo.location.country}`}</span>
              </div>
              <div className="md:flex md:flex-col md:gap-y-2 md:px-8">
                <p className="uppercase text-darkgray font-bold text-[.675rem] md:text-[.75rem] tracking-widest">timezone</p>
                <span className="text-xl text-verydark font-medium md:text-2xl">{ipInfo.location && ipInfo.location.timezone}</span>
              </div>
              <div className="md:flex md:flex-col md:gap-y-2 md:px-8">
                <p className="uppercase text-darkgray font-bold text-[.675rem] md:text-[.75rem] tracking-widest">isp</p>
                <span className="text-xl text-verydark font-medium md:text-2xl">{ipInfo.isp}</span>
              </div>
            </div>
          )}
        </div>
      </section>

      {ipInfo && ipInfo.location && ipInfo.location.lat && ipInfo.location.lng && (
        <MapContainer
         style={{ width: '100%', height: '500px' }} center={[ipInfo.location.lat, ipInfo.location.lng]} zoom={13} scrollWheelZoom={false} ref={mapRef}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[ipInfo.location.lat, ipInfo.location.lng]}></Marker>
        </MapContainer>
    )}
    </main>
  );
}

export default App;
