"use client";

import { useState, useEffect } from "react";
import {
  Autocomplete,
  AutocompleteItem,
  AutocompleteProps,
} from "@heroui/autocomplete";
import qs from "qs";

import { useGet } from "@/hooks/useApi";

interface AutocompletePlaceProps
  extends Omit<
    AutocompleteProps,
    | "children"
    | "value"
    | "onChange"
    | "selectedKey"
    | "inputValue"
    | "onInputChange"
    | "onSelectionChange"
  > {
  value?: AutocompleteProps["selectedKey"];
  onChange: (place?: AutocompleteProps["selectedKey"]) => void;
}

const AutocompletePlace: React.FC<AutocompletePlaceProps> = ({
  value,
  onChange,
  ...autocompleteProps
}) => {
  const [placeQuery, setPlaceQuery] = useState(value?.toString() || "");
  const [debouncedPlaceQuery, setDebouncedPlaceQuery] = useState(value?.toString() || "");

  // Debounce the place query to avoid bombarding the API
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedPlaceQuery(placeQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [placeQuery]);

  const queryString = qs.stringify({
    q: debouncedPlaceQuery,
  });
  const apiUrl =
    debouncedPlaceQuery && debouncedPlaceQuery !== value
      ? `/api/places?${queryString}`
      : null;

  const { data: places = [], isLoading } = useGet<string[]>(apiUrl);

  const handlePlaceInputChange = (value: string) => {
    if (value === "") {
      onChange(undefined);
    }
    setPlaceQuery(value);
  };

  const handlePlaceChange = (value: AutocompleteProps["selectedKey"]) => {
    onChange(value);
    setPlaceQuery(value?.toString() || "");
  };

  return (
    <Autocomplete
      className="basis-1/2"
      inputValue={placeQuery}
      isClearable={false}
      isLoading={isLoading}
      label="Населений пункт"
      selectedKey={value}
      onInputChange={handlePlaceInputChange}
      onSelectionChange={handlePlaceChange}
      {...autocompleteProps}
    >
      {places.map((placeOption: string) => (
        <AutocompleteItem key={placeOption} textValue={placeOption}>
          {placeOption}
        </AutocompleteItem>
      ))}
    </Autocomplete>
  );
};

export default AutocompletePlace;
