"use client";

import { useState, useEffect } from "react";
import {
  Autocomplete,
  AutocompleteItem,
  AutocompleteProps,
} from "@heroui/autocomplete";
import qs from "qs";

import { useGet } from "@/hooks/useApi";

// import { Item } from "@/generated/prisma/client";

// type PlaceValues = Partial<Pick<Item, "country" | "state" | "place">>;

interface SearchPlaceProps {
  countries: string[];
  states: string[];
}

const SearchPlace: React.FC<SearchPlaceProps> = ({ countries, states }) => {
  const [country, setCountry] = useState<AutocompleteProps["selectedKey"]>();
  const [state, setState] = useState<AutocompleteProps["selectedKey"]>();
  const [place, setPlace] = useState<AutocompleteProps["selectedKey"]>();
  const [placeQuery, setPlaceQuery] = useState("");
  const [debouncedPlaceQuery, setDebouncedPlaceQuery] = useState("");

  // Debounce the place query to avoid bombarding the API
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedPlaceQuery(placeQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [placeQuery]);

  const queryString = qs.stringify({
    q: debouncedPlaceQuery,
    country,
    state,
  });
  const apiUrl =
    debouncedPlaceQuery && debouncedPlaceQuery !== place
      ? `/api/places?${queryString}`
      : null;

  const { data: places = [], isLoading } = useGet<string[]>(apiUrl);

  const handlePlaceInputChange = (value: string) => {
    if (value === "") {
      setPlace(null);
    }
    setPlaceQuery(value);
  };

  const handlePlaceChange = (value: AutocompleteProps["selectedKey"]) => {
    setPlace(value);
    setPlaceQuery(value?.toString() || "");
  };

  return (
    <div className="flex gap-4">
      {/* Country select */}
      <Autocomplete
        className="basis-1/4"
        isClearable={false}
        label="Країна"
        selectedKey={country}
        onSelectionChange={setCountry}
      >
        {countries.map((country) => (
          <AutocompleteItem key={country} textValue={country}>
            {country}
          </AutocompleteItem>
        ))}
      </Autocomplete>

      {/* State select */}
      <Autocomplete
        className="basis-1/4"
        isClearable={false}
        label="Область"
        selectedKey={state}
        onSelectionChange={setState}
      >
        {states.map((state) => (
          <AutocompleteItem key={state} textValue={state}>
            {state}
          </AutocompleteItem>
        ))}
      </Autocomplete>

      {/* Place autocomplete (async) */}
      <Autocomplete
        className="basis-1/2"
        inputValue={placeQuery}
        isClearable={false}
        isLoading={isLoading}
        label="Населений пункт"
        selectedKey={place}
        onInputChange={handlePlaceInputChange}
        onSelectionChange={handlePlaceChange}
      >
        {places.map((placeOption: string) => (
          <AutocompleteItem key={placeOption} textValue={placeOption}>
            {placeOption}
          </AutocompleteItem>
        ))}
      </Autocomplete>
    </div>
  );
};

export default SearchPlace;
