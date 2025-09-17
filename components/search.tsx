"use client";

import { useState, useEffect } from "react";
import { Autocomplete, AutocompleteItem, AutocompleteProps } from "@heroui/autocomplete";

import { usePost } from "@/hooks/useApi";
import useSearch from "@/hooks/useSearch";
import { SearchRequest, SearchResponse } from "@/app/api/search/route";
import AutocompletePlace from "@/components/autocomplete-place";
import CatalogDuckTable from "@/components/table";

type TableItem = SearchResponse[number];

interface SearchProps {
  countries: string[];
  states: string[];
}

const Search: React.FC<SearchProps> = ({ countries, states }) => {
  const [defaultValues, setQueryParams] = useSearch();
  const [searchValues, setSearchValues] = useState<SearchRequest>(defaultValues);
  const { trigger, isMutating, data: searchResults } = usePost<SearchResponse, SearchRequest>(`/api/search`);

  useEffect(() => {
    console.log(searchValues);
    trigger(searchValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelectChange = (key: keyof SearchRequest) => (value: AutocompleteProps["selectedKey"]) => {
    setSearchValues({ ...searchValues, [key]: value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setQueryParams(searchValues);
    trigger(searchValues);
  };

  return (
    <>
      <form className="flex flex-col gap-2 items-center" onSubmit={handleSubmit}>
        <fieldset className="flex w-full gap-2" disabled={false}>
          <legend className="sr-only">Локація</legend>
          <Autocomplete
            className="basis-1/4"
            isClearable={false}
            label="Країна"
            selectedKey={searchValues.country}
            onSelectionChange={handleSelectChange("country")}
          >
            {countries.map((country) => (
              <AutocompleteItem key={country} textValue={country}>
                {country}
              </AutocompleteItem>
            ))}
          </Autocomplete>

          <Autocomplete
            className="basis-1/4"
            isClearable={false}
            label="Область"
            selectedKey={searchValues.state}
            onSelectionChange={handleSelectChange("state")}
          >
            {states.map((state) => (
              <AutocompleteItem key={state} textValue={state}>
                {state}
              </AutocompleteItem>
            ))}
          </Autocomplete>

          <AutocompletePlace
            country={searchValues.country}
            state={searchValues.state}
            value={searchValues.place}
            onChange={handleSelectChange("place")}
          />
        </fieldset>
      </form>
      <CatalogDuckTable<TableItem>
        isLoading={isMutating}
        columns={[
          { headerName: "Архів", field: "archive.code" },
          { headerName: "Фонд", field: "fund" },
          { headerName: "Опис", field: "description" },
          { headerName: "Справа", field: "case" },
        ]}
        rows={searchResults || []}
      />
    </>
  );
};

export default Search;
