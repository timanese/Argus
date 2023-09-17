import { useState, useMemo, useEffect } from "react";
import { GoogleMap, useLoadScript, MarkerF } from "@react-google-maps/api";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import { Box, Input, List, ListItem } from "@chakra-ui/react";

export default function Places({ setLocation }) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  if (!isLoaded) return <div>Loading...</div>;
  return <Map setLocation={setLocation} />;
}

function Map({ setLocation }) {
  const [selected, setSelected] = useState({ lat: 43.45, lng: -80.49 });
  return (
    <>
      <div className="places-container">
        <PlacesAutocomplete
          setSelected={setSelected}
          setLocation={setLocation}
        />
      </div>

      <GoogleMap
        zoom={14}
        center={selected}
        mapContainerClassName="map-container"
      >
        {selected && <MarkerF position={selected} />}
      </GoogleMap>
    </>
  );
}

const PlacesAutocomplete = ({ setSelected, setLocation }) => {
  const {
    ready,
    value,
    setValue,
    suggestions: { status, data },
    clearSuggestions,
  } = usePlacesAutocomplete();

  const handleSelect = async (address) => {
    setValue(address, false);
    clearSuggestions();

    const results = await getGeocode({ address });
    const { lat, lng } = await getLatLng(results[0]);
    setSelected({ lat, lng });
  };
  useEffect(() => {
    setLocation(value);
  }, [value, setLocation]);

  return (
    <Box>
      <Input
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
        }}
        disabled={!ready}
        className="combobox-input"
        placeholder="Search an address"
      />
      {status === "OK" && (
        <List>
          {data.map(({ place_id, description }) => (
            <ListItem
              key={place_id}
              onClick={() => handleSelect(description)}
              cursor="pointer"
              _hover={{ bg: "gray.100" }}
            >
              {description}
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
};
