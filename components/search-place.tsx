"use client";

import { Key, useEffect, useState } from "react";
import {
  Autocomplete,
  AutocompleteItem,
  AutocompleteProps,
} from "@heroui/autocomplete";

import { Item } from "@/generated/prisma/client";

type PlaceValues = Partial<Pick<Item, "country" | "state" | "place">>;

interface SearchPlaceProps {
  countries: string[];
  states: string[];
}

const SearchPlace: React.FC<SearchPlaceProps> = ({ countries, states }) => {
  const [country, setCountry] = useState<AutocompleteProps["selectedKey"]>();
  const [state, setState] = useState<AutocompleteProps["selectedKey"]>();
  const [place, setPlace] = useState("");
  const [placeOptions, setPlaceOptions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log({
      country: country?.toString(),
      state: state?.toString(),
      place,
    });
  }, [country, state, place]);

  // Async fetch for place autocomplete
  useEffect(() => {
    if (!place) {
      setPlaceOptions([]);
      return;
    }
    setLoading(true);
    fetch(`/api/places?q=${encodeURIComponent(place)}`)
      .then((res) => res.json())
      .then((data) => {
        setPlaceOptions(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [place]);

  return (
    <div className="flex flex-col gap-4">
      {/* Country select */}
      <Autocomplete
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
      {/* <Autocomplete
        label="Архів"
        isClearable={false}
        selectedKey={value}
        onSelectionChange={onChange}
        className={className}
      >
        {archives.map((archive) => (
          <AutocompleteItem key={archive.code} textValue={archive.code}>
            <div>
              <p>{archive.code}</p>
              {!withoutTitle && (
                <p className="opacity-70 text-sm text-wrap">{archive.title}</p>
              )}
            </div>
          </AutocompleteItem>
        ))}
      </Autocomplete> */}
    </div>
  );
};

export default SearchPlace;
