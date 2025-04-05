/// <reference types="@types/google.maps" />
import { useState, useMemo } from 'react';
import { useLoadScript, GoogleMap, Marker, InfoWindow } from '@react-google-maps/api';
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from 'use-places-autocomplete';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';

// Определяем типы
type LatLngLiteral = google.maps.LatLngLiteral;
type PlaceInfo = {
  position: LatLngLiteral;
  address: string;
};

type MapProps = {
  onPlaceSelect?: (place: string) => void;
};

type SearchBoxProps = {
  setSelected: (position: LatLngLiteral) => void;
  setClickedPlace: (place: PlaceInfo | null) => void;
};

const mapContainerStyle = {
  width: '100%',
  height: '100%',
};

// Начальный центр карты (Москва)
const defaultCenter = {
  lat: 55.751244,
  lng: 37.618423,
};

const options = {
  disableDefaultUI: false,
  zoomControl: true,
};

const libraries: ("places")[] = ["places"];

// Выносим SearchBox в отдельный компонент
function SearchBox({ setSelected, setClickedPlace }: SearchBoxProps) {
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      componentRestrictions: { country: 'ru' },
    },
    debounce: 300,
  });

  const handleSelect = async (placeDescription: string) => {
    try {
      const results = await getGeocode({ address: placeDescription });
      const { lat, lng } = await getLatLng(results[0]);
      const position = { lat, lng };
      
      setSelected(position);
      setClickedPlace({
        position,
        address: results[0].formatted_address || placeDescription,
      });
      
      setValue('', false);
      clearSuggestions();
    } catch (error) {
      console.error('Error: ', error);
    }
  };

  return (
    <Box 
      sx={{ 
        position: 'absolute',
        top: '1rem',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '400px',
        zIndex: 10,
      }}
    >
      <Autocomplete
        freeSolo
        options={status === "OK" ? data : []}
        getOptionLabel={(option) => 
          typeof option === 'string' 
            ? option 
            : option.description
        }
        filterOptions={(x) => x}
        value={value}
        onChange={(event, newValue) => {
          if (newValue && typeof newValue !== 'string') {
            handleSelect(newValue.description);
          }
        }}
        onInputChange={(event, newInputValue) => {
          setValue(newInputValue);
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Поиск места..."
            variant="outlined"
            fullWidth
            sx={{
              backgroundColor: 'white',
              borderRadius: '4px',
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#e2e8f0',
                },
                '&:hover fieldset': {
                  borderColor: '#cbd5e1',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#3b82f6',
                },
              },
            }}
          />
        )}
        renderOption={(props, option) => (
          <li {...props} key={option.place_id}>
            <Box sx={{ py: 1, px: 2 }}>
              {option.description}
            </Box>
          </li>
        )}
      />
    </Box>
  );
}

// Основной компонент карты
export default function Map({ onPlaceSelect }: MapProps) {
  const [selected, setSelected] = useState<LatLngLiteral | null>(null);
  const [clickedPlace, setClickedPlace] = useState<PlaceInfo | null>(null);
  const [geocoder, setGeocoder] = useState<google.maps.Geocoder | null>(null);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries,
  });

  const center = useMemo(() => selected || defaultCenter, [selected]);

  const onMapLoad = () => {
    setGeocoder(new google.maps.Geocoder());
  };

  const handleMapClick = async (e: google.maps.MapMouseEvent) => {
    if (!geocoder || !e.latLng) return;

    try {
      const results = await geocoder.geocode({
        location: e.latLng,
      });

      if (results.results[0]) {
        setClickedPlace({
          position: {
            lat: e.latLng.lat(),
            lng: e.latLng.lng(),
          },
          address: results.results[0].formatted_address,
        });
      }
    } catch (error) {
      console.error('Geocoding error:', error);
    }
  };

  const handleExplore = () => {
    if (clickedPlace && onPlaceSelect) {
      onPlaceSelect(clickedPlace.address);
      document.querySelector('#contact-form')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (loadError) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-gray-100">
        <div className="text-red-500">Ошибка загрузки карты: {loadError.message}</div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-gray-100">
        <div className="text-gray-500">Загрузка карты...</div>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full">
      <SearchBox 
        setSelected={setSelected} 
        setClickedPlace={setClickedPlace} 
      />
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={selected ? 15 : 13}
        center={center}
        options={options}
        onClick={handleMapClick}
        onLoad={onMapLoad}
      >
        {clickedPlace && (
          <>
            <Marker position={clickedPlace.position} />
            <InfoWindow
              position={clickedPlace.position}
              onCloseClick={() => setClickedPlace(null)}
              options={{
                maxWidth: 350,
              }}
            >
              <div className="w-[200px] p-3 overflow-x-hidden text-center">
                <p className="text-sm mb-3 break-words">
                  {clickedPlace.address}
                </p>
                <div className="flex justify-center">
                  <button
                    onClick={handleExplore}
                    className="bg-green-500 text-white px-6 py-2 rounded-md text-sm hover:bg-green-600 transition-colors"
                  >
                    Получить дашборд
                  </button>
                </div>
              </div>
            </InfoWindow>
          </>
        )}
      </GoogleMap>
    </div>
  );
}