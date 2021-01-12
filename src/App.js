import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Polyline, CircleMarker, Popup, GeoJSON } from "react-leaflet";
import stData from "./data/contrib_locations_area3_france.json";
import linesData from "./data/graphs_area3_france.json";
import 'bootstrap/dist/css/bootstrap.css';
import { Button } from 'react-bootstrap';
import Select from 'react-select';
import { yearOptions, communitiesOptions } from './data/color';
import metropole from "./data/metropole.json";
import { Line } from 'react-chartjs-2';

import "./App.css";

function Option(props) {
  const {
    children,
    className,
    cx,
    getStyles,
    isDisabled,
    isFocused,
    isSelected,
    innerRef,
    innerProps,
  } = props;
  return (
    <div
      ref={innerRef}
      css={getStyles('option', props)}
      className={cx(
        {
          option: true,
          'option--is-disabled': isDisabled,
          'option--is-focused': isFocused,
          'option--is-selected': isSelected,
        },
        className
      )}
      {...innerProps}
    >
      {children}
    </div>
  );
}

const style = {
  fillColor: '#F28F3B',
  weight: 2,
  opacity: 1,
  color: 'white',
  dashArray: '3',
  fillOpacity: 0.5
}


function App() {
  const [selectedCountry, setSelectedCountry] = useState(communitiesOptions[0].value.substr(0,3));
  const [selectedYear, setSelectedYear] = useState(yearOptions[0].value);
  const [updatedLinesData, setUpdatedLinesData] = useState(linesData);
  const [updatedStData, setUpdatedStData] = useState(stData);
  const [showStats, setShowStats] = useState(false);  
  
  useEffect(() => {
    const dfName = selectedCountry.concat(selectedYear);
    const tempLinesData = linesData.filter(el => el.dfname.includes(dfName));
    const tempStData = stData.filter(el => el.dfname.includes(dfName));
    setUpdatedLinesData(tempLinesData);
    setUpdatedStData(tempStData);
  }, [selectedYear, selectedCountry])

  const handleCountrySelect = (e) => {
    setSelectedCountry(e.value)
  }

  const handleYearSelect = (e) => {
    setSelectedYear(e.value)
  }

  const handleStatsClick = () => {
    setShowStats(true);
  }
  const handleMapClick = () => {
    setShowStats(false);
  }

  return (
    <div>
      <div className = 'blockcentering'>
        <div className = 'dropdown'>
          <div>
            <h1 className='title_site'>Remoteness Influence Factor</h1>
          </div>
          <Select className = 'd-inline-block mt-4 col-md-2 col-offset-4'
            closeMenuOnSelect={true}
            components={{ Option }}
            styles={{
              option: base => ({
                ...base,
                border: `1px dotted ${yearOptions[1]}`,
                height: '100%',
                width: 300,
                flex: 1,
                position: 'relative'
              }),
            }}
            defaultValue={yearOptions[0]}
            options={yearOptions}
            onChange={handleYearSelect}
          />
          <Select className = 'd-inline-block mt-4 col-md-2 col-offset-4'
            closeMenuOnSelect={true}
            components={{ Option }}
            styles={{
              option: base => ({
                ...base,
                border: `1px dotted ${communitiesOptions[1]}`,
                height: '100%',
                width: 300,
                flex: 1
              }),
            }}
            defaultValue={communitiesOptions[0]}
            options={communitiesOptions}
            onChange={handleCountrySelect}
          />
        </div>
        <div className = 'button_gap'>
          <Button variant="dark" onClick={handleMapClick} >Maps</Button>{' '}
          <Button variant="dark" onClick={handleStatsClick} >Stats</Button>{' '}
        </div>   
      </div>
      
      { !showStats &&  
        <div className = 'playgroundPreview_1mpV map_lower'>
          <MapContainer center={[46.71111,1.7191]} zoom={6}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            />
            <GeoJSON
              data={metropole}
              style={() => ({
                color: '#4a83ec',
                weight: 0.5,
                fillColor: "#1a1d62",
                fillOpacity: 0.3,
              })}
            />

            {updatedLinesData.map(line => (
              <Polyline positions={[[
                line.sourcelat,
                line.sourcelong],
                [line.destlat,
                line.destlong]]} />
              /*<Marker
                key={st.name}
                position={[
                  st.latitude,
                  st.longitude
                ]}
              />*/
            ))}

            {updatedStData.map(st => (
              /*<CircleMarker 
              center={[
                st.latitude,
                st.longitude]}
              
              />*/
              <CircleMarker center={[
                st.latitude,
                st.longitude]} radius={3}>
                <Popup><b>{st.name}</b> <br /> Contribution to RIF: {st.Contribution_RIF} <br /> Betweenness Centrality: {st.BCn} </Popup>
              </CircleMarker>
              /*<Marker
                key={st.name}
                position={[
                  st.latitude,
                  st.longitude
                ]}
              />*/
            ))}
          </MapContainer>
        </div> 
      }

      { showStats &&
        <h1>Stats</h1>
      }
    </div>
  )
  }



export default App;
